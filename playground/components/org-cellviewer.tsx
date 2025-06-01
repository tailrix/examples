"use client"

import * as React from "react"
import { z } from "zod"
import { deleteOrg, updateOrg } from "@/app/actions/orgs";

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
import { useRouter } from "next/navigation";


export function OrgCellViewer({ item }: { item: z.infer<typeof orgSchema> }) {
    const isMobile = useIsMobile()
    const [open, setOpen] = React.useState(false);
    const formRef = React.useRef<HTMLFormElement>(null)
    const router = useRouter();

    const handleUpdate = async () => {
        if (!formRef.current) return
        const formData = new FormData(formRef.current)
        const validation = orgSchema.safeParse({
            id: item.id,
            orgId: item.orgId,
            name: formData.get("name")?.toString().trim() || "",
            description: formData.get("description")?.toString().trim() || "",
        });

        if (!validation.success) {
            console.error("Validation failed:", validation.error);
            alert("Validation failed. Please check the input fields.");
            return;
        }

        try {
            await updateOrg(formData);
            setOpen(false);
            router.refresh();
        } catch (error) {
            console.error("Failed to update organization:", error);
            alert("Failed to update organization. See console for details."); // Optional
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this organization?")) {
            try {
                await deleteOrg(item.orgId);
                // alert("Organization deleted successfully!"); // Optional
                setOpen(false); // Close the drawer
            } catch (error) {
                console.error("Failed to delete organization:", error);
                alert("Failed to delete organization. See console for details."); // Optional
            }
        }
    };

    return (
        <Drawer open={open} onOpenChange={setOpen} direction={isMobile ? "bottom" : "right"}>
            <DrawerTrigger asChild>
                <Button variant="link" className="text-foreground w-fit px-0 text-left" onClick={() => setOpen(true)}>
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
                    <form className="flex flex-col gap-4" ref={formRef}>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="header">Id</Label>
                            <Badge variant="outline" className="text-muted-foreground px-1.5">
                                {item.orgId}
                            </Badge>
                            <input type="hidden" name="orgId" value={item.orgId} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="header">Name</Label>
                            <Input id="name" name="name" defaultValue={item.name} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" name="description" defaultValue={item.description} />
                        </div>
                    </form>
                </div>
                <DrawerFooter>
                    <Button onClick={handleUpdate}>Submit</Button>
                    <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Done</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
