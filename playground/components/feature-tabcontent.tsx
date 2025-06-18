"use client"

import * as React from "react"
import {
    ColumnDef as FeatureColumnDef,
} from "@tanstack/react-table"
import { z } from "zod"

import {
    TabsContent,
} from "@/components/ui/tabs"

import { DataTable } from "@/components/table"
import { featureSchema } from "@/components/feature-schema"
import { Badge } from "@/components/ui/badge"

const FeatureTableColumns: FeatureColumnDef<z.infer<typeof featureSchema>>[] = [
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
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
            <div className="w-32">
                <Badge variant="outline" className="text-muted-foreground px-1.5">
                    {row.original.type}
                </Badge>
            </div>
        ),
    },
    {
        accessorKey: "value",
        header: "Value",
        cell: ({ row }) => (
            <div className="w-32">
                {row.original.value}
            </div >
        ),
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
            <div className="w-32">
                {row.original.type}
            </div>
        ),
    },
    {
        accessorKey: "featureId",
        header: "Id",
        cell: ({ row }) => (
            <Badge variant="outline" className="text-muted-foreground px-1.5">
                {row.original.featureId}
            </Badge>
        ),
    },
]

export function FeatureTabContent({
    features
}: {
    features: z.infer<typeof featureSchema>[]
}) {
    return (
        <TabsContent
            value="features"
            className="flex flex-col px-4 lg:px-6"
        >
            <DataTable
                data={features}
                columns={FeatureTableColumns}
                enableRowReorder
                addNewDialogue={<></>}
            />
        </TabsContent>
    )
}