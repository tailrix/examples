'use server'

import { getApiKey } from "@/app/actions/apikey";
import { fetchUsers as fetchUsersFromUtils } from '@/lib/utils';
import { Account, AccountInfo, createAccount, deleteAccount, updateAccount } from "tailrix";

/**
 * Server action to fetch a list of users (accounts) from Tailrix
 * by wrapping the utility function from lib/utils.ts.
 * @returns A promise that resolves to an array of Account objects.
 */
export async function fetchUsers(): Promise<Account[]> {
    try {
        const apikey = await getApiKey();
        if (!apikey) {
            console.error("API key not found for fetchUsers action");
            return [];
        }

        const accounts: Account[] = await fetchUsersFromUtils(apikey);
        return accounts;

    } catch (error) {
        console.error("Error in fetchUsers server action:", error);
        return [];
    }
}

/**
 * Server action to create a new user (account) in Tailrix.
 * @param formData The form data containing user details (name, email, customerId).
 * @throws Error if the user creation fails.
 */
export async function createUser(formData: FormData) {
    const name = (formData.get("name") ?? "").toString().trim();
    const email = (formData.get("email") ?? "").toString().trim();
    const customerId = (formData.get("customerId") ?? "").toString().trim();
    const address = (formData.get("address") ?? "").toString().trim();
    const phone = (formData.get("phone") ?? "").toString().trim();
    const taxExempt = formData.get("taxExempt") === "on";

    const apikey = await getApiKey();
    if (!apikey) {
        console.error("API key not found for createUser action");
        throw new Error("API key not available. Cannot create user.");
    }

    // Validate required fields
    if (!name) {
        throw new Error("User name is required.");
    }
    if (!email) {
        throw new Error("User email is required.");
    }

    const accountInfo: AccountInfo = {
        name,
        email,
        customerId,
        description: "", // Default description as per original function
        metaData: {
            address: address,
            phone: phone,
            taxExempt: taxExempt,
        },
    };

    const account: Account = await createAccount(accountInfo, apikey);
    if (!account) {
        throw new Error("Failed to create user via Tailrix SDK");
    }
}

/**
 * Server action to delete a user (account) in Tailrix.
 * @param userId The ID of the user to delete.
 * @throws Error if the user deletion fails or API key is not found.
 */
export async function deleteUser(userId: string) {
    if (!userId) {
        throw new Error("User ID is required for deletion.");
    }

    const apikey = await getApiKey();
    if (!apikey) {
        console.error("API key not found for deleteUser action");
        throw new Error("API key not available. Cannot delete user.");
    }

    try {
        await deleteAccount([userId], false, apikey);
    } catch (error) {
        console.error(`Error deleting user ${userId} via Tailrix SDK:`, error);
        throw new Error(`Failed to delete user ${userId}.`);
    }
}

export async function updateUser(formData: FormData) {
    const userId = (formData.get("userId") ?? "").toString().trim();
    const name = (formData.get("name") ?? "").toString().trim();
    const email = (formData.get("email") ?? "").toString().trim();
    const customerId = (formData.get("customerId") ?? "").toString().trim();
    const address = (formData.get("address") ?? "").toString().trim();
    const phone = (formData.get("phone") ?? "").toString().trim();
    const taxExempt = formData.get("taxExempt") === "on";

    const apikey = await getApiKey();
    if (!apikey) {
        console.error("API key not found for updateUser action");
        throw new Error("API key not available. Cannot update user.");
    }

    // Validate required fields
    if (!userId) {
        throw new Error("User ID is required for update.");
    }
    if (!name) {
        throw new Error("User name is required.");
    }
    if (!email) {
        throw new Error("User email is required.");
    }

    const accountInfo: AccountInfo = {
        name,
        email,
        customerId,
        description: "",
        metaData: {
            address: address,
            phone: phone,
            taxExempt: taxExempt,
        },
    };

    try {
        await updateAccount(userId, accountInfo, false, apikey);
    } catch (error) {
        console.error(`Error updating user ${userId} via Tailrix SDK:`, error);
        throw new Error(`Failed to update user ${userId}.`);
    }
}