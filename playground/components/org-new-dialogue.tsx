"use client"
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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



export function OrgNewDialogue() {
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
                            <Label htmlFor="target">Owner</Label>
                            <Input id="accountId" name="accountId" defaultValue="" />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="limit">Is a customer id</Label>
                            <Input id="isCustomerId" defaultValue="" />
                        </div>
                    </div>
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