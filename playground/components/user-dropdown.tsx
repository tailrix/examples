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
    users: User[],
    currentUserId: string,
    onUserSelect: (userId: string) => void
}

export function UserSelect({
    users,
    currentUserId,
    onUserSelect,
}: UserSelectProps) {
    return (
        <Select onValueChange={onUserSelect} defaultValue={currentUserId}>
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
                        >
                            {user.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
