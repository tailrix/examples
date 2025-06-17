import { z } from "zod";

export const subSchema = z.object({
    id: z.number(),
    subId: z.string(),
    name: z.string(),
    subType: z.string()
})
