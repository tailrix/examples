import { z } from "zod"

export const userSchema = z.object({
    id: z.number(),
    userId: z.string(),
    customerId: z.string(),
    name: z.string(),
    email: z.string()
})
