"use client"

import * as React from "react"
import {
    ColumnDef
} from "@tanstack/react-table"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import {
    TabsContent,
} from "@/components/ui/tabs"

import { DataTable } from "@/components/table"
import { UserNewDialogue } from "@/components/user-new-dialogue"
import { userSchema } from "@/components/user-schema"
import { UserCellViewer } from "@/components/user-cellviewer"

const UserTableColumns: ColumnDef<z.infer<typeof userSchema>>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            return (
                <div className="w-64">
                    <UserCellViewer item={row.original} />
                </div >
            )
        },
        enableHiding: false,
        enableResizing: true
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
            <div className="w-32">
                <Badge variant="outline" className="text-muted-foreground px-1.5">
                    {row.original.email}
                </Badge>
            </div>
        ),
    },
    {
        accessorKey: "customerId",
        header: "Customer ID",
        cell: ({ row }) => (
            <div className="w-32">
                {row.original.customerId}
            </div>
        ),
    },
    {
        accessorKey: "userId",
        header: "User ID",
        cell: ({ row }) => (
            <div className="w-32">
                <Badge variant="outline" className="text-muted-foreground px-1.5">
                    {row.original.userId}
                </Badge>
            </div>
        ),
    }
]

export function UserTabContent({
    users
}: {
    users: z.infer<typeof userSchema>[]
}) {
    return (
        <TabsContent
            value="users"
            className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
        >
            <DataTable
                data={users}
                columns={UserTableColumns}
                enableRowReorder
                addNewDialogue={<UserNewDialogue />}
            />
        </TabsContent>
    )
}
