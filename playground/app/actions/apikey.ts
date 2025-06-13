"use server";                                // marks **every** export as a Server Action

import { decrypt, encrypt } from "@/lib/crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function saveApiKey(formData: FormData) {
  const apiKey = formData.get("apikey") as string | null;
  if (!apiKey) {
    redirect("/login?error=missing");
  }

  (await cookies()).set({
    name: "apikey",
    value: encrypt(apiKey),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,                 // 24 h
  });

  redirect("/");
}

export async function getApiKey(): Promise<string> {
  try {
    const enc = (await cookies()).get("apikey")?.value;
    if (!enc) {
      throw new Error("No API key corrupted");
    }
    return decrypt(enc);
  } catch {
    redirect("/login");
  }
}
