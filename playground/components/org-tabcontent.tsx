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
import { orgSchema } from "@/components/org-schema"
import { OrgCellViewer } from "@/components/org-cellviewer"
import { OrgNewDialogue } from "@/components/org-new-dialogue"

const OrgTableColumns: OrgColumnDef<z.infer<typeof orgSchema>>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            return (
                <div className="w-64">
                    <OrgCellViewer item={row.original} />
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
    orgs
}: {
    orgs: z.infer<typeof orgSchema>[]
}) {
    return (
        <TabsContent
            value="organizations"
            className="flex flex-col px-4 lg:px-6"
        >
            <DataTable
                data={orgs}
                columns={OrgTableColumns}
                enableRowReorder
                addNewDialogue={<OrgNewDialogue />}
            />
        </TabsContent>
    )
}