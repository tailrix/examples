import { DataTable, schema } from "./data-table"
import { z } from "zod"
import { apikey, fetchFeatures } from "@/lib/utils"
import { FeatureWithSource } from "tailrix"

interface FeatureTableProps {
    accountId: string
    orgId: string
    isCustomerId: boolean
}

const OverviewTable = async ({ accountId, orgId, isCustomerId }: FeatureTableProps) => {
    let featureData: FeatureWithSource[] = []

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

    return (<DataTable
        data={featureTableData}
    >
    </DataTable>)
}


export default OverviewTable