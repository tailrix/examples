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
// (which is Account[], Account should have id, name, and customerId)
interface UserDisplay {
    id: string;
    name: string;
    customerId?: string | null; // Assuming customerId can be optional or null
}

export function OrgNewDialogue() {
    const [isCustomerIdChecked, setIsCustomerIdChecked] = React.useState(false);
    const [users, setUsers] = React.useState<UserDisplay[]>([]); // Use UserDisplay type
    const [selectedAccountId, setSelectedAccountId] = React.useState<string | undefined>(undefined);

    // Fetch users on component mount
    React.useEffect(() => {
        fetchUsers().then((fetchedUsers) => {
            // Ensure fetchedUsers conform to UserDisplay, especially if customerId might be missing
            // from the Account type or is not always present.
            // For this task, we assume Account[] from fetchUsers directly maps to UserDisplay[]
            // where customerId might be undefined.
            setUsers(fetchedUsers as UserDisplay[]);
        });
    }, []); // Empty dependency array means this runs once on mount

    // Filter users based on isCustomerIdChecked
    const usersForDropdown = isCustomerIdChecked
        ? users.filter(user => user.customerId) // Only users with a customerId
        : users; // All users

    // When isCustomerIdChecked changes, we need to potentially update selectedAccountId
    // if the current selectedAccountId (which could be an id or a customerId)
    // is no longer valid for the new mode.
    // For example, if switching from "by id" to "by customerId", and the selected user
    // doesn't have a customerId, the selection should be cleared.
    // The existing onCheckedChange for the Checkbox already clears selectedAccountId when
    // isCustomerIdChecked becomes true, which helps.
    // If switching from "by customerId" to "by id", the selected value (a customerId) might not
    // match any user.id.
    React.useEffect(() => {
        if (selectedAccountId) {
            const currentSelectionStillValid = usersForDropdown.some(user =>
                isCustomerIdChecked ? user.customerId === selectedAccountId : user.id === selectedAccountId
            );
            if (!currentSelectionStillValid) {
                setSelectedAccountId(undefined); // Clear selection if no longer valid
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCustomerIdChecked, usersForDropdown]); // usersForDropdown dependency is important here

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
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="accountId">Owner</Label>
                            <Select name="accountId" onValueChange={setSelectedAccountId} value={selectedAccountId} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a user" />
                                </SelectTrigger>
                                <SelectContent>
                                    {usersForDropdown.map((user) => (
                                        <SelectItem
                                            key={user.id} // Key should be stable and unique, user.id is good
                                            value={isCustomerIdChecked && user.customerId ? user.customerId : user.id}
                                        >
                                            {user.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="isCustomerId">Customer id</Label>
                            <Checkbox
                                id="isCustomerId"
                                checked={isCustomerIdChecked}
                                onCheckedChange={(checkedState) => {
                                    const newCheckedState = Boolean(checkedState);
                                    setIsCustomerIdChecked(newCheckedState);
                                    // When checkbox state changes, the selected value might become invalid.
                                    // Clearing it ensures user has to re-select.
                                    // The useEffect above will also help reconcile this.
                                    setSelectedAccountId(undefined);
                                }}
                                required
                            />
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
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">Email</Label>
                            <Input
                                id="description"
                                name="description"
                                defaultValue=""
                                className="col-span-3"
                                required
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