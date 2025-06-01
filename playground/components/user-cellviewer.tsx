"use client"

import * as React from "react"
import { z } from "zod"
import { deleteUser, updateUser } from "@/app/actions/users";

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
import { userSchema } from "./user-schema"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";


export function UserCellViewer({ item }: { item: z.infer<typeof userSchema> }) {
    const isMobile = useIsMobile()
    const [open, setOpen] = React.useState(false);
    const router = useRouter();
    const formRef = React.useRef<HTMLFormElement>(null)

    const handleUpdate = async () => {
        if (!formRef.current) return
        const formData = new FormData(formRef.current)
        const validation = userSchema.safeParse({
            id: item.id,
            userId: item.userId,
            name: formData.get("name")?.toString().trim() || "",
            email: (formData.get("email") ?? "").toString().trim(),
            customerId: (formData.get("customerId") ?? "").toString().trim(),
            phone: (formData.get("phone") ?? "").toString().trim(),
            address: (formData.get("address") ?? "").toString().trim(),
            taxExempt: formData.get("taxExempt") === "on" ? true : false,
        });

        if (!validation.success) {
            console.error("Validation failed:", validation.error);
            alert("Validation failed. Please check the input fields.");
            return;
        }

        try {
            await updateUser(formData);
            setOpen(false);
            router.refresh();
        } catch (error) {
            console.error("Failed to update user:", error);
            alert("Failed to update user. See console for details."); // Optional
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await deleteUser(item.userId);
                // alert("User deleted successfully!"); // Optional: or use a toast notification
                setOpen(false); // Close the drawer
                // window.location.reload(); // Alternative: reload the page
                router.refresh();
            } catch (error) {
                console.error("Failed to delete user:", error);
                alert("Failed to delete user. See console for details."); // Optional
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
                        Details of the user.
                    </DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
                    <form className="flex flex-col gap-4" ref={formRef}>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="header">Id</Label>
                            <Badge variant="outline" className="text-muted-foreground px-1.5">
                                {item.userId}
                            </Badge>
                            <input type="hidden" name="userId" value={item.userId} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="header">Name</Label>
                            <Input id="header" name="name" defaultValue={item.name} required />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" defaultValue={item.email} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="customerId">Customer Id</Label>
                            <Input id="customerId" name="customerId" defaultValue={item.customerId} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" name="phone" defaultValue={item.phone} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" name="address" defaultValue={item.address} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="taxExempt">Tax exempt</Label>
                                <Checkbox id="taxExempt" name="taxExempt" defaultChecked={item.taxExempt} />
                            </div>
                        </div>
                    </form>
                </div>
                <DrawerFooter>
                    <Button onClick={handleUpdate} >Submit</Button>
                    <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
