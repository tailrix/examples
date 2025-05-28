'use server'

import { getApiKey } from "@/app/actions/apikey";
import { Account, listAccounts } from "tailrix"; // Assuming listAccounts is the correct function

interface UserDisplay {
    id: string;
    name: string;
}

/**
 * Fetches a list of users (accounts) from Tailrix.
 * @returns A promise that resolves to an array of user objects, each with id and name.
 */
export async function fetchUsers(): Promise<UserDisplay[]> {
    try {
        const apikey = await getApiKey();
        if (!apikey) {
            // console.error("API key not found in fetchUsers.");
            throw new Error("API key not found.");
        }

        // Assuming listAccounts takes an API key and returns a promise of Account[]
        const accounts: Account[] = await listAccounts(apikey); 

        if (!accounts) {
            // console.log("No accounts returned from listAccounts.");
            return [];
        }

        // Map Tailrix Account objects to UserDisplay format
        return accounts.map(account => {
            if (!account.id || !account.name) {
                // console.warn("Account found with missing id or name:", account);
                // Skip this account or handle as per requirements
                return null; 
            }
            return {
                id: account.id, // Account.id should be the correct identifier for accountId
                name: account.name,
            };
        }).filter(Boolean) as UserDisplay[]; // Filter out any nulls from mapping
    } catch (error) {
        console.error("Failed to fetch users:", error);
        // In a real app, you might want to throw the error to be caught by a global error handler
        // or return a specific error object. For now, returning an empty array.
        return []; 
    }
}
