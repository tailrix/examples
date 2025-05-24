import { fetchUsers } from "@/lib/utils"
import { getApiKey } from "@/app/actions/apikey"
import { z } from "zod";
import { userSchema } from "./user-tabcontent";
import { UserAndOrgTable } from "./user-org-table";

const UserManagementTable = async () => {
    const apikey = await getApiKey();
    const users = await fetchUsers(apikey)
    if (!users) {
        return <div>Error fetching users</div>
    }
    const userTableData = users.map<z.infer<typeof userSchema>>((user, index) => ({
        id: index,
        userId: user.id,
        customerId: user.customerId,
        name: user.name,
        email: user.email,
    }))

    return (<UserAndOrgTable
        key={apikey}
        users={userTableData}
        orgs={[]}
    ></UserAndOrgTable>)
}

export default UserManagementTable