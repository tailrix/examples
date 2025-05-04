import { clsx, type ClassValue } from "clsx"
import { Account, FeatureWithSource, getFeatures, ListAccounts } from "tailrix";
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
  const users = await ListAccounts(0, 100, "", apikey)
  return users.items
}

