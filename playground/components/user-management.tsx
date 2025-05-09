import { fetchUsers } from "@/lib/utils"
import { getApiKey } from "@/app/actions/apikey"
import { z } from "zod";
import { schema, UserTable } from "./user-table";

const UserManagementTable = async () => {

    const apikey = await getApiKey();
    const users = await fetchUsers(apikey)
    if (!users) {
        return <div>Error fetching users</div>
    }
    const userTableData = users.map<z.infer<typeof schema>>((user, index) => ({
        id: index,
        userId: user.id,
        customerId: user.customerId,
        name: user.name,
        email: user.email,
    }))

    return (<UserTable
        key={apikey}

        users={userTableData}
    ></UserTable>)
}


export default UserManagementTable