"use client"

import * as React from "react"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { orgSchema } from "@/components/org-schema"


export function OrgCellViewer({ item }: { item: z.infer<typeof orgSchema> }) {
    const isMobile = useIsMobile()

    return (
        <Drawer direction={isMobile ? "bottom" : "right"}>
            <DrawerTrigger asChild>
                <Button variant="link" className="text-foreground w-fit px-0 text-left">
                    {item.name}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="gap-1">
                    <DrawerTitle>{item.name}</DrawerTitle>
                    <DrawerDescription>
                        Details of the organization.
                    </DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
                    <form className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="header">Id</Label>
                            <Badge variant="outline" className="text-muted-foreground px-1.5">
                                {item.orgId}
                            </Badge>
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="header">Name</Label>
                            <Input id="name" name="name" defaultValue={item.name} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="email">Description</Label>
                            <Input id="email" name="email" defaultValue={item.description} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="target">Customer Id</Label>
                            <Input id="target" defaultValue={item.customId} />
                        </div>
                    </form>
                </div>
                <DrawerFooter>
                    <Button>Submit</Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Done</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
