"use client"

import * as React from "react"
import { z } from "zod"

import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { User, UserSelect } from "./user-dropdown"
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { OrgSelect } from "@/components/org-dropdown"
import { SubscriptionTabContent } from "@/components/sub-tabcontent"
import { featureSchema } from "./feature-schema"
import { FeatureTabContent } from "./feature-tabcontent"

export function FeatureSubscriptionTable({
  features: initialFeatures,
  users,
  currentUserId,
  currentOrgId
}: {
  features: z.infer<typeof featureSchema>[],
  users: User[],
  currentUserId: string,
  currentOrgId: string
}) {
  const [features,] = React.useState(() => initialFeatures)
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const tab = searchParams.get("tab");
  const validTabs = ["features", "subscriptions"];
  const currentTab = tab && validTabs.includes(tab) ? tab : "features";

  const currentUser = users.find(user => user.id === currentUserId);
  const orgList = (currentUser?.organizationNames || []).map((name, index) => ({
    id: currentUser?.organizationIds[index] || "",
    name: name,
    description: "",
    customerId: "",
  }))

  const handleUserSelected = (userId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("accountId", userId);
    router.replace(`${pathname}?${params.toString()}`);
  }

  const handleOrgSelected = (orgId: string) => {
    if (orgId === "personal") {
      orgId = "";
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("orgId", orgId);
    router.replace(`${pathname}?${params.toString()}`);
  }

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <Tabs
      defaultValue={currentTab}
      onValueChange={handleTabChange}
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <div className="hidden">
          <Select defaultValue="outline">
            <SelectTrigger
              className="flex w-fit @4xl/main:hidden"
              size="sm"
              id="view-selector"
            >
              <SelectValue placeholder="Select a view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="outline">Features</SelectItem>
              <SelectItem value="past-performance">Subscriptions</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <UserSelect
            users={users}
            onUserSelect={(userId) => { handleUserSelected(userId) }}
            currentUserId={currentUserId}
          />
          <OrgSelect
            orgs={orgList}
            currentOrgId={currentOrgId}
            onOrgSelect={(orgId) => { handleOrgSelected(orgId) }}
          />
        </div>
      </div>
      <FeatureTabContent features={features} />
      <SubscriptionTabContent accountId={currentUserId} orgId={currentOrgId} />
    </Tabs>
  )
}
