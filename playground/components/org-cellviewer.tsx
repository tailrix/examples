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
import { UserSelect } from "@/components/user-dropdown";
import { Account } from "tailrix";


export function OrgCellViewer({ item }: { item: z.infer<typeof orgSchema> }) {
    const isMobile = useIsMobile()
    const [open, setOpen] = React.useState(false);
    const formRef = React.useRef<HTMLFormElement>(null)
    const router = useRouter();
    const [organization, setOrganization] = React.useState<z.infer<typeof orgSchema>>(item);
    const [members, setMembers] = React.useState<Account[]>([]);

    const handleUpdate = async () => {
        if (!formRef.current) return
        const formData = new FormData(formRef.current)
        const validation = orgSchema.safeParse({
            id: organization.id,
            orgId: organization.orgId,
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
                await deleteOrg(organization.orgId);
                // alert("Organization deleted successfully!"); // Optional
                setOpen(false); // Close the drawer
            } catch (error) {
                console.error("Failed to delete organization:", error);
                alert("Failed to delete organization. See console for details."); // Optional
            }
        }
    };


    React.useEffect(() => {
        const fetchMemberList = async () => {
            try {
                const res = await fetch(`/api/org?orgId=${organization.orgId}`)
                if (!res.ok) {
                    throw new Error(`Error fetching organization data: ${res.statusText}`);
                }

                const data = await res.json();
                if (!data) {
                    throw new Error("Organization data not found");
                }

                console.log("Fetched organization data:", data);

                setMembers(data.fullMembers || []);
            } catch (error) {
                console.error("Failed to fetch organization data:", error);
                alert("Failed to fetch organization data. See console for details."); // Optional
            }
        };
        fetchMemberList();
    }, [organization.orgId]);

    return (
        <Drawer open={open} onOpenChange={setOpen} direction={isMobile ? "bottom" : "right"}>
            <DrawerTrigger asChild>
                <Button variant="link" className="text-foreground w-fit px-0 text-left" onClick={() => setOpen(true)}>
                    {organization.name}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="gap-1">
                    <DrawerTitle>{organization.name}</DrawerTitle>
                    <DrawerDescription>
                        Details of the organization.
                    </DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
                    <form className="flex flex-col gap-4" ref={formRef}>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="header">Id</Label>
                            <Badge variant="outline" className="text-muted-foreground px-1.5">
                                {organization.orgId}
                            </Badge>
                            <input type="hidden" name="orgId" value={organization.orgId} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="header">Name</Label>
                            <Input id="name" name="name" defaultValue={organization.name} />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" name="description" defaultValue={organization.description} />
                        </div>
                        <Label htmlFor="member list">Members</Label>
                        <div className="inline-flex items-center h-10 whitespace-nowrap">
                            <UserSelect users={[]} currentUserId={""} onUserSelect={() => { }} />
                            <Button variant="outline" className="ml-3">Remove</Button>
                        </div>
                        <Label htmlFor="add_member" >Add a member</Label>
                        <div className="inline-flex items-center h-10 whitespace-nowrap">
                            <UserSelect users={[]} currentUserId={""} onUserSelect={() => { }} />
                            <Button variant="outline" className="ml-3 shrink-0 h-10">Add</Button>
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
            </DrawerContent >
        </Drawer >
    )
}
