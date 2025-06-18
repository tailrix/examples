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
import { subSchema } from "@/components/sub-schema"
import { Subscription } from "tailrix"

const SubscriptionTableColumns: ColumnDef<z.infer<typeof subSchema>>[] = [
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
                    {row.original.subType}
                </Badge>
            </div>
        ),
    },
    {
        accessorKey: "subId",
        header: "Subscription ID",
        cell: ({ row }) => (
            <div className="w-32">
                <Badge variant="outline" className="text-muted-foreground px-1.5">
                    {row.original.subId}
                </Badge>
            </div>
        ),
    }
]

export function SubscriptionTabContent({
    accountId, orgId,
}: {
    accountId: string,
    orgId: string
}) {
    const [subscriptions, setSubscriptions] = React.useState<z.infer<typeof subSchema>[]>([]);

    React.useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const response = await fetch(`/api/subscriptions?accountId=${accountId}&orgId=${orgId}`);
                const data = await response.json();
                console.log("Fetched subscriptions in client:", data);
                setSubscriptions(data.map((sub: Subscription, idx: number) => ({
                    id: idx,
                    subId: sub.id,
                    name: sub.name,
                    subType: sub.subType,
                })));
            } catch (error) {
                console.error('Error fetching subscriptions:', error);
            }
        };

        fetchSubscriptions();
    }, [accountId, orgId]);

    return (
        <TabsContent
            value="subscriptions"
            className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
        >
            <DataTable
                data={subscriptions}
                columns={SubscriptionTableColumns}
                enableRowReorder
                addNewDialogue={<></>}
            />
        </TabsContent>
    )
}
