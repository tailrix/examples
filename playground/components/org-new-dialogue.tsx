"use client"
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { createOrg } from "@/app/actions/orgs";
import { fetchUsers } from "@/app/actions/users"; // Import the real fetchUsers

// Define the expected user structure, matching what fetchUsers returns
interface UserDisplay {
    id: string;
    name: string;
}

export function OrgNewDialogue() {
    const [isCustomerIdChecked, setIsCustomerIdChecked] = React.useState(false);
    const [users, setUsers] = React.useState<UserDisplay[]>([]); // Use UserDisplay type
    const [selectedAccountId, setSelectedAccountId] = React.useState<string | undefined>(undefined);

    React.useEffect(() => {
        if (!isCustomerIdChecked) {
            fetchUsers().then(setUsers);
        } else {
            // Clear users or selected user when switching to manual input for accountId
            setUsers([]);
            setSelectedAccountId(undefined);
        }
    }, [isCustomerIdChecked]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">Add an organization</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form action={createOrg}>
                    <DialogHeader>
                        <DialogTitle>Add an organization</DialogTitle>
                        <DialogDescription>
                            Add an organization to the system. Click save when you are done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="accountId">Owner</Label>
                            {isCustomerIdChecked ? (
                                <Input id="accountId" name="accountId" defaultValue="" />
                            ) : (
                                <Select name="accountId" onValueChange={setSelectedAccountId} value={selectedAccountId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a user" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((user) => (
                                            <SelectItem key={user.id} value={user.id}>
                                                {user.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="isCustomerId">Is a customer id</Label>
                            <Checkbox id="isCustomerId" checked={isCustomerIdChecked} onCheckedChange={(checkedState) => {
                                const newCheckedState = Boolean(checkedState);
                                setIsCustomerIdChecked(newCheckedState);
                                if (newCheckedState) {
                                    // Clear user selection if switching to manual input
                                    setSelectedAccountId(undefined);
                                }
                            }} />
                        </div>
                    </div>
                    {/* This hidden input ensures isCustomerId is always submitted for the form */}
                    <input type="hidden" name="isCustomerId" value={String(isCustomerIdChecked)} />
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue=""
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">Email</Label>
                            <Input
                                id="description"
                                name="description"
                                defaultValue=""
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="customerId" className="text-right">CustomerID</Label>
                            <Input
                                id="customerId"
                                name="customerId"
                                defaultValue=""
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>)
}