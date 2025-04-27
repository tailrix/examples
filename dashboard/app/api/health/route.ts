import { NextRequest } from "next/server";

export async function GET(_req: NextRequest) {
    return new Response("OK", {
        status: 200,
        headers: {
            "Content-Type": "text/plain",
        },
    });
}