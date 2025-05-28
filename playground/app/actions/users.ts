'use server'

import { getApiKey } from "@/app/actions/apikey";
import { fetchUsers as fetchUsersFromUtils } from '@/lib/utils';
import { Account } from "tailrix";

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
        
        // Call the utility function
        const accounts: Account[] = await fetchUsersFromUtils(apikey);
        
        // The Account type from tailrix should have .id and .name.
        // If any additional mapping or filtering (like checking for null id/name)
        // was desired, it could be done here. For now, directly returning accounts.
        // Example of previous filtering (if needed):
        // return accounts.map(account => {
        //     if (!account.id || !account.name) {
        //         console.warn("Account found with missing id or name in action wrapper:", account);
        //         return null; 
        //     }
        //     return account;
        // }).filter(Boolean) as Account[];
        return accounts;

    } catch (error) {
        console.error("Error in fetchUsers server action:", error);
        return [];
    }
}
