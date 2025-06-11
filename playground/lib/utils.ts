import { clsx, type ClassValue } from "clsx"
import { Account, FeatureWithSource, getFeatures, listAccounts, listOrganizations, getOrganization, Organization } from "tailrix";
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
  const users = await listAccounts(0, 100, "", apikey)
  return users.items
}

export const fetchOrganizations = async (apikey: string): Promise<Organization[]> => {
  const organizations = await listOrganizations(apikey)
  return organizations
}

export const fetchOrganization = async (orgId: string, isCustomerId: boolean, apikey: string): Promise<Organization | null> => {
  const organization = await getOrganization(orgId, isCustomerId, true, apikey)
  return organization
}
