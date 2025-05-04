import { DataTable, schema } from "./data-table"
import { z } from "zod"
import { fetchFeatures, fetchUsers } from "@/lib/utils"
import { FeatureWithSource } from "tailrix"
import { getApiKey } from "@/app/actions/apikey"

interface FeatureTableProps {
    accountId: string
    orgId: string
    isCustomerId: boolean
}

const OverviewTable = async ({ accountId, orgId, isCustomerId }: FeatureTableProps) => {
    let featureData: FeatureWithSource[] = []

    const apikey = await getApiKey();
    if (accountId !== "" || orgId != "") {
        featureData = await fetchFeatures(accountId, orgId, isCustomerId, apikey)
        if (!featureData) {
            return <div>Error fetching data</div>
        }
    }

    const featureTableData = featureData.map<z.infer<typeof schema>>((feature, index) => ({
        id: index,
        featureId: feature.id,
        customId: feature.customId,
        name: feature.name,
        type: feature.valueType,
        value: feature.value,
        usage: "",
        unit: feature.unit,
        from: feature.source
    }))

    const users = await fetchUsers(apikey)
    if (!users) {
        return <div>Error fetching users</div>
    }

    const userTableData = users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
    }))

    return (<DataTable
        key={accountId + orgId}
        data={featureTableData}
        users={userTableData}
        currentUserId={accountId}
    >
    </DataTable>)
}


export default OverviewTable