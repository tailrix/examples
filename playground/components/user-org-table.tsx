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

import { UserTabContent } from "@/components/user-tabcontent"
import { OrgTabContent } from "@/components/org-tabcontent"
import { userSchema } from "@/components/user-schema"
import { orgSchema } from "@/components/org-schema"
import { useSearchParams, useRouter } from "next/navigation";

export function UserAndOrgTable({
    users,
    orgs,
    tab
}: {
    users: z.infer<typeof userSchema>[],
    orgs: z.infer<typeof orgSchema>[]
    tab?: string
}) {
    const searchParams = useSearchParams();
    const router = useRouter();

    function handleTabChange(value: string) {
        const params = new URLSearchParams(Array.from(searchParams.entries()));
        params.set("tab", value);
        router.replace(`${window.location.pathname}?${params.toString()}`);
    }

    return (
        <Tabs
            defaultValue={tab}
            className="w-full flex-col justify-start gap-6"
            onValueChange={handleTabChange}
        >
            <div className="flex items-center justify-between px-4 lg:px-6">
                <Label htmlFor="view-selector" className="sr-only">
                    View
                </Label>
                <div className="hidden">
                    <Select defaultValue="users">
                        <SelectTrigger
                            className="flex w-fit @4xl/main:hidden"
                            size="sm"
                            id="view-selector"
                        >
                            <SelectValue placeholder="Select a view" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="users">Users</SelectItem>
                            <SelectItem value="organizations">Organizations</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <TabsList
                    className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="organizations">Organizations</TabsTrigger>
                </TabsList>
            </div>
            <UserTabContent users={users} />
            <OrgTabContent orgs={orgs} />
        </Tabs>
    )
}
