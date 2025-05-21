import { Account, AccountInfo, createAccount } from "tailrix"

export async function createUser(formData: FormData) {
    const name = (formData.get("name") ?? "").toString().trim();
    const email = (formData.get("email") ?? "").toString().trim();
    const customerId = (formData.get("customerId") ?? "").toString().trim();

    const apikey = process.env.TAILRIX_API_KEY || "";

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
    // Redirect to the list page
    //revalidatePath("/users");
}

