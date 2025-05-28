import { z } from "zod";

export const orgSchema = z.object({
    id: z.number(),
    orgId: z.string(),
    name: z.string(),
    description: z.string(),
    customId: z.string()
})
