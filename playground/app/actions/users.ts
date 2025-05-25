'use server'

import { Account, AccountInfo, createAccount } from "tailrix"
import { getApiKey } from "@/app/actions/apikey";

export async function createUser(formData: FormData) {
    const name = (formData.get("name") ?? "").toString().trim();
    const email = (formData.get("email") ?? "").toString().trim();
    const customerId = (formData.get("customerId") ?? "").toString().trim();

    const apikey = await getApiKey();

    const accountInfo: AccountInfo = {
        name,
        email,
        customerId,
        description: "",
        metaData: {
            address: "",
            phone: "",
            taxExempt: false,
        },
    };

    const account: Account = await createAccount(accountInfo, apikey);
    if (!account) {
        throw new Error("Failed to create user");
    }
}

