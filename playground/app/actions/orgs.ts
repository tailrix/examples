'use server'

import {
    createOrganization,
    Organization,
    OrganizationMetaData,
    deleteOrganization,
    updateOrganization,
    addMembersToOrganization,
    removeMembersFromOrganization
} from "tailrix"
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
        await deleteOrganization(orgId, false, apikey);
    } catch (error) {
        console.error(`Error deleting organization ${orgId} via Tailrix SDK:`, error);
        throw new Error(`Failed to delete organization ${orgId}.`);
    }
}

export async function updateOrg(formData: FormData) {
    const orgId = (formData.get("orgId") ?? "").toString().trim();
    const name = (formData.get("name") ?? "").toString().trim();
    const description = (formData.get("description") ?? "").toString().trim();
    const customerId = (formData.get("customerId") ?? "").toString().trim();
    const apikey = await getApiKey();

    if (!apikey) {
        console.error("API key not found for updateOrg action");
        throw new Error("API key not available. Cannot update organization.");
    }

    if (!orgId) {
        throw new Error("Organization ID is required.");
    }
    if (!name) {
        throw new Error("Organization name is required.");
    }
    if (!description) {
        throw new Error("Organization description is required.");
    }

    const organizationMetaData: OrganizationMetaData = {
        name,
        description,
        customerId
    }

    try {
        await updateOrganization(orgId, organizationMetaData, false, apikey);
    } catch (error) {
        console.error(`Error updating organization ${orgId} via Tailrix SDK:`, error);
        throw new Error(`Failed to update organization ${orgId}.`);
    }
}

export async function addMemberToOrg(orgId: string, userId: string) {
    if (!orgId || !userId) {
        throw new Error("Organization ID and User ID are required to add a member.");
    }

    const apikey = await getApiKey();
    if (!apikey) {
        console.error("API key not found for addMemberToOrg action");
        throw new Error("API key not available. Cannot add member to organization.");
    }

    try {
        await addMembersToOrganization(orgId, [userId], false, apikey);
    } catch (error) {
        console.error(`Error adding user ${userId} to organization ${orgId} via Tailrix SDK:`, error);
        throw new Error(`Failed to add user ${userId} to organization ${orgId}.`);
    }
}

export async function removeMemberFromOrg(orgId: string, userId: string) {
    if (!orgId || !userId) {
        throw new Error("Organization ID and User ID are required to remove a member.");
    }

    const apikey = await getApiKey();
    if (!apikey) {
        console.error("API key not found for removeMemberFromOrg action");
        throw new Error("API key not available. Cannot remove member from organization.");
    }

    try {
        await removeMembersFromOrganization(orgId, [userId], false, apikey);
    } catch (error) {
        console.error(`Error removing user ${userId} from organization ${orgId} via Tailrix SDK:`, error);
        throw new Error(`Failed to remove user ${userId} from organization ${orgId}.`);
    }
}