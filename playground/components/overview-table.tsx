import { FeatureSubscriptionTable } from "@/components/feature-sub-table"
import { z } from "zod"
import { fetchFeatures, fetchUsers } from "@/lib/utils"
import { FeatureWithSource, ResponseError } from "tailrix"
import { getApiKey } from "@/app/actions/apikey"
import { redirect } from 'next/navigation';
import { featureSchema } from "@/components/feature-schema"

interface FeatureTableProps {
    accountId: string
    orgId: string
    isCustomerId: boolean
}

const fetchUserList = async (apikey: string) => {
    try {
        const users = await fetchUsers(apikey)
        return users
    } catch (err: unknown) {
        if (err instanceof ResponseError && err.response.status == 401) {
            redirect("/login?error=unauthorized")
        }
        throw new Error("Error fetching users: " + (err instanceof Error ? err.message : "Unknown error"));
    }
}

const OverviewTable = async ({ accountId, orgId, isCustomerId }: FeatureTableProps) => {
    let featureData: FeatureWithSource[] = []

    const apikey = await getApiKey();
    if (accountId !== "") {
        featureData = await fetchFeatures(accountId, orgId, isCustomerId, apikey)
        if (!featureData) {
            return <div>Error fetching data</div>
        }
    }

    const featureTableData = featureData.map<z.infer<typeof featureSchema>>((feature, index) => ({
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

    const users = await fetchUserList(apikey)
    const userTableData = users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        organizationIds: user.organizationIds,
        organizationNames: user.organizationNames,
    }))

    return (<FeatureSubscriptionTable
        key={accountId + orgId}
        features={featureTableData}
        users={userTableData}
        currentUserId={accountId}
        currentOrgId={orgId}
    />)
}

export default OverviewTable