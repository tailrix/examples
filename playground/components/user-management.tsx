import { fetchUsers, fetchOrganizations } from "@/lib/utils"
import { getApiKey } from "@/app/actions/apikey"
import { z } from "zod";
import { UserAndOrgTable } from "@/components/user-org-table";
import { userSchema } from "@/components/user-schema";
import { orgSchema } from "@/components/org-schema";

export const dynamic = "force-dynamic"
export const revalidate = 0

interface UserManagementTableProps {
    tab?: string;
}

const UserManagementTable = async ({ tab }: UserManagementTableProps) => {
    const apikey = await getApiKey();
    const users = await fetchUsers(apikey)
    if (!users) {
        return <div>Error fetching users</div>
    }

    const orgs = await fetchOrganizations(apikey)
    if (!orgs) {
        return <div>Error fetching organizations</div>
    }

    const userTableData = users.map<z.infer<typeof userSchema>>((user, index) => ({
        id: index,
        userId: user.id,
        customerId: user.customerId,
        name: user.name,
        email: user.email,
        phone: user.metaData.phone || "",
        address: user.metaData.address || "",
        taxExempt: user.metaData.taxExempt || false
    }))

    const orgTableData = orgs.map<z.infer<typeof orgSchema>>((org, index) => ({
        id: index,
        orgId: org.id,
        name: org.name,
        description: org.description || ""
    }))

    return (<UserAndOrgTable
        users={userTableData}
        orgs={orgTableData}
        tab={tab}
    ></UserAndOrgTable>)
}

export default UserManagementTable
