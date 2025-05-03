import { clsx, type ClassValue } from "clsx"
import { FeatureWithSource, getFeatures } from "tailrix";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const apikey = process.env.TAILRIX_API_KEY || ''

export const fetchFeatures = async (accountId: string, orgId: string, isCustomerId: boolean, apikey: string): Promise<Array<FeatureWithSource>> => {
  return await getFeatures(accountId || '',
    orgId || '',
    isCustomerId,
    apikey
  )
}
