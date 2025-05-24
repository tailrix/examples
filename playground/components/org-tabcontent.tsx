"use client"

import * as React from "react"
import {
    ColumnDef as OrgColumnDef,
} from "@tanstack/react-table"
import { z } from "zod"

import {
    TabsContent,
} from "@/components/ui/tabs"

import { DataTable } from "@/components/table"

export const orgSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string()
})

const OrgTableColumns: OrgColumnDef<z.infer<typeof orgSchema>>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            return (
                <div className="w-64">
                    {row.original.name}
                </div >
            )
        },
        enableHiding: false,
        enableResizing: true
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
            <div className="w-32">
                {row.original.description}
            </div>
        ),
    }
]

export function OrgTabContent({
    orgs: initialOrgs
}: {
    orgs: z.infer<typeof orgSchema>[]
}) {
    const [orgData] = React.useState(() => initialOrgs)

    return (
        <TabsContent
            value="organizations"
            className="flex flex-col px-4 lg:px-6"
        >
            <DataTable
                data={orgData}
                columns={OrgTableColumns}
                enableRowReorder
            />
        </TabsContent>
    )
}