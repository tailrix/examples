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

import { userSchema, UserTabContent } from "@/components/user-tabcontent"
import { orgSchema, OrgTabContent } from "@/components/org-tabcontent"

export function UserAndOrgTable({
    users: initialUsers,
    orgs: initialOrgs
}: {
    users: z.infer<typeof userSchema>[],
    orgs: z.infer<typeof orgSchema>[]
}) {
    const [userData] = React.useState(() => initialUsers)
    const [orgData] = React.useState(() => initialOrgs)

    return (
        <Tabs
            defaultValue="users"
            className="w-full flex-col justify-start gap-6"
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
                <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
                    <TabsTrigger value="users">Users</TabsTrigger>
                    <TabsTrigger value="organizations">Organizations</TabsTrigger>
                </TabsList>
            </div>
            <UserTabContent users={userData} />
            <OrgTabContent orgs={orgData} />
        </Tabs>
    )
}
