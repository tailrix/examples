import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export type Org = {
    id: string
    name: string
    description: string
    customerId: string
}

interface OrgSelectProps {
    orgs: Org[],
    currentOrgId: string,
    onOrgSelect: (orgId: string) => void
}

export function OrgSelect({
    orgs,
    currentOrgId,
    onOrgSelect,
}: OrgSelectProps) {
    return (
        <Select onValueChange={onOrgSelect} defaultValue={currentOrgId}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select an organization " />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Organization</SelectLabel>
                    {orgs.map((org) => (
                        <SelectItem
                            key={org.id}
                            value={org.id}
                        >
                            {org.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
