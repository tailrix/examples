import { clsx, type ClassValue } from "clsx"
import { Account, FeatureWithSource, getFeatures } from "tailrix";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fetchFeatures = async (accountId: string, orgId: string, isCustomerId: boolean, apikey: string): Promise<Array<FeatureWithSource>> => {
  return await getFeatures(accountId || '',
    orgId || '',
    isCustomerId,
    apikey
  )
}

export const fetchUsers = async (apikey: string): Promise<Array<Account>> => {
  // TODO: Implement this function to fetch users
  console.log("Fetching users with API key:", apikey);
  return Promise.resolve([])
}

