"use client"

import * as React from "react"
import { z } from "zod"

import {
    updateOrg,
    deleteOrg,
    addMemberToOrg,
    removeMemberFromOrg,
} from "@/app/actions/orgs"

import { fetchUsers } from "@/app/actions/users"
import { useRouter } from "next/navigation"
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
import { UserSelect } from "@/components/user-dropdown"

import { orgSchema } from "@/components/org-schema"
import type { Account } from "tailrix"

export function OrgCellViewer({ item }: { item: z.infer<typeof orgSchema> }) {
    const isMobile = useIsMobile()
    const router = useRouter()

    const [open, setOpen] = React.useState(false)
    const [organization] = React.useState(item)
    const [members, setMembers] = React.useState<Account[]>([])
    const [allUsers, setAllUsers] = React.useState<Account[]>([])
    const [currentUserIdToRemove, setCurrentUserIdToRemove] = React.useState("")
    const [currentUserIdToAdd, setCurrentUserIdToAdd] = React.useState("")
    const formRef = React.useRef<HTMLFormElement>(null)

    const fetchMemberList = React.useCallback(async () => {
        const res = await fetch(`/api/org?orgId=${organization.orgId}`)
        if (!res.ok) throw new Error(res.statusText)
        const data = await res.json()
        setMembers(data.fullMembers ?? [])
    }, [organization.orgId])

    const fetchAllUsers = React.useCallback(async () => {
        const users = await fetchUsers()
        setAllUsers(Array.isArray(users) ? users : [])
    }, [])

    const handleAddMember = async () => {
        if (!currentUserIdToAdd) return
        try {
            await addMemberToOrg(organization.orgId, currentUserIdToAdd)
            setCurrentUserIdToAdd("")
            await fetchMemberList()
        } catch (err) {
            console.error(err)
        }
    }

    const handleRemoveMember = async () => {
        if (!currentUserIdToRemove) return
        try {
            await removeMemberFromOrg(organization.orgId, currentUserIdToRemove)
            setCurrentUserIdToRemove("")
            await fetchMemberList()            // refresh members list
        } catch (err) {
            console.error(err)
        }
    }

    const handleUpdate = async () => {
        if (!formRef.current) return
        const formData = new FormData(formRef.current)

        const validated = orgSchema.safeParse({
            id: organization.id,
            orgId: organization.orgId,
            name: formData.get("name")?.toString().trim() ?? "",
            description: formData.get("description")?.toString().trim() ?? "",
        })
        if (!validated.success) {
            alert("Validation failed")
            return
        }

        try {
            await updateOrg(formData)
            setOpen(false)
            router.refresh()
        } catch (err) {
            console.error(err)
            alert("Update failed")
        }
    }

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this organization?")) return
        try {
            await deleteOrg(organization.orgId)
            setOpen(false)
            router.refresh()
        } catch (err) {
            console.error(err)
            alert("Delete failed")
        }
    }

    React.useEffect(() => {
        if (!open) return
        fetchMemberList()
        fetchAllUsers()
    }, [open, fetchMemberList, fetchAllUsers])

    const memberOptions = members.map(u => ({ id: u.id, name: u.name, email: u.email }))
    const addableUsers = allUsers
        .filter(u => !members.some(m => m.id === u.id))
        .map(u => ({ id: u.id, name: u.name, email: u.email }))

    return (
        <Drawer open={open} onOpenChange={setOpen} direction={isMobile ? "bottom" : "right"}>
            <DrawerTrigger asChild>
                <Button variant="link" className="text-foreground w-fit px-0 text-left">
                    {organization.name}
                </Button>
            </DrawerTrigger>

            <DrawerContent>
                <DrawerHeader className="gap-1">
                    <DrawerTitle>{organization.name}</DrawerTitle>
                    <DrawerDescription>Details of the organization.</DrawerDescription>
                </DrawerHeader>

                <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
                    <form ref={formRef} className="flex flex-col gap-4">
                        {/* id */}
                        <div className="flex flex-col gap-3">
                            <Label>Id</Label>
                            <Badge variant="outline" className="text-muted-foreground px-1.5">
                                {organization.orgId}
                            </Badge>
                            <input type="hidden" name="orgId" value={organization.orgId} />
                        </div>

                        {/* name */}
                        <div className="flex flex-col gap-3">
                            <Label>Name</Label>
                            <Input id="name" name="name" defaultValue={organization.name} />
                        </div>

                        {/* description */}
                        <div className="flex flex-col gap-3">
                            <Label>Description</Label>
                            <Input
                                id="description"
                                name="description"
                                defaultValue={organization.description}
                            />
                        </div>

                        {/* members list */}
                        <Label>Members</Label>
                        <div className="inline-flex items-center h-10 whitespace-nowrap">
                            <UserSelect
                                users={memberOptions}
                                currentUserId={currentUserIdToRemove}
                                onUserSelect={setCurrentUserIdToRemove}
                            />
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="ml-3"
                                disabled={!currentUserIdToRemove}
                                onClick={handleRemoveMember}
                            >
                                Remove
                            </Button>
                        </div>

                        {/* add member */}
                        <Label>Add a member</Label>
                        <div className="inline-flex items-center h-10 whitespace-nowrap">
                            <UserSelect
                                users={addableUsers}
                                currentUserId={currentUserIdToAdd}
                                onUserSelect={setCurrentUserIdToAdd}
                            />
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                className="ml-3 shrink-0 h-10"
                                disabled={!currentUserIdToAdd}
                                onClick={handleAddMember}
                            >
                                Add
                            </Button>
                        </div>
                    </form>
                </div>

                <DrawerFooter>
                    <Button onClick={handleUpdate}>Submit</Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        Delete
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
