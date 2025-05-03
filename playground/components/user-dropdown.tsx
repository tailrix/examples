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

export type User = {
    id: string
    name: string
    email: string
}

interface UserSelectProps {
    users: User[]
    onUserSelect: (userId: string) => void
}

export function UserSelect({
    users,
    onUserSelect,
}: UserSelectProps) {
    return (
        <Select>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a user" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>User</SelectLabel>
                    {users.map((user) => (
                        <SelectItem
                            key={user.id}
                            value={user.id}
                            onClick={() => onUserSelect(user.id)}
                        >
                            {user.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
