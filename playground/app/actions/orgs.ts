'use server'

import { createOrganization, Organization, OrganizationMetaData, deleteOrganization } from "tailrix"
import { getApiKey } from "@/app/actions/apikey";

export async function createOrg(formData: FormData) {
    const accountId = (formData.get("accountId") ?? "").toString().trim();
    const isCustomerId = (formData.get("isCustomerId") ?? "false").toString().trim().toLowerCase() === "true";
    const name = (formData.get("name") ?? "").toString().trim();
    const description = (formData.get("description") ?? "").toString().trim();
    const customerId = (formData.get("customerId") ?? "").toString().trim();
    const apikey = await getApiKey();

    if (!apikey) {
        console.error("API key not found for createOrg action");
        throw new Error("API key not available. Cannot create organization.");
    }

    // Validate required fields
    if (!accountId) {
        throw new Error("Owner (accountId) is required.");
    }
    if (!name) {
        throw new Error("Organization name is required.");
    }
    if (!description) {
        throw new Error("Organization email/description is required.");
    }

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

/**
 * Server action to delete an organization in Tailrix.
 * @param orgId The ID of the organization to delete.
 * @throws Error if the organization deletion fails or API key is not found.
 */
export async function deleteOrg(orgId: string) {
    if (!orgId) {
        throw new Error("Organization ID is required for deletion.");
    }

    const apikey = await getApiKey();
    if (!apikey) {
        console.error("API key not found for deleteOrg action");
        throw new Error("API key not available. Cannot delete organization.");
    }

    try {
        // Assuming deleteOrganization returns a boolean or throws an error on failure.
        await deleteOrganization(orgId, apikey);
        // console.log(`Organization ${orgId} deleted successfully.`); // Optional: for server-side logging
    } catch (error) {
        console.error(`Error deleting organization ${orgId} via Tailrix SDK:`, error);
        throw new Error(`Failed to delete organization ${orgId}.`);
    }
}