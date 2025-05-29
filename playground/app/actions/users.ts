'use server'

import { getApiKey } from "@/app/actions/apikey";
import { fetchUsers as fetchUsersFromUtils } from '@/lib/utils';
import { Account, AccountInfo, createAccount } from "tailrix";

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
        // It might be better to throw an error here if API key is essential for creation
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
    // console.log("User created successfully:", account); // Optional: for server-side logging
    // Note: The function does not explicitly return the created account object.
    // Depending on usage, returning 'account' might be beneficial.
}