'use server'

import { createOrganization, Organization, OrganizationMetaData } from "tailrix"
import { getApiKey } from "@/app/actions/apikey";

export async function createOrg(formData: FormData) {
    const accountId = (formData.get("accountId") ?? "").toString().trim();
    const isCustomerId = (formData.get("isCustomerId") ?? "false").toString().trim().toLowerCase() === "true";
    const name = (formData.get("name") ?? "").toString().trim();
    const description = (formData.get("description") ?? "").toString().trim();
    const customerId = (formData.get("customerId") ?? "").toString().trim();
    const apikey = await getApiKey();

    const organizationMetaData: OrganizationMetaData = {
        name,
        description,
        customerId
    }

    const organization: Organization = await createOrganization(accountId, organizationMetaData, isCustomerId, apikey);
    if (!organization) {
        throw new Error("Failed to create organization");

    }
}