import { z } from "zod";

export const featureSchema = z.object({
    id: z.number(),
    featureId: z.string(),
    customId: z.string(),
    name: z.string(),
    type: z.string(),
    value: z.string(),
    unit: z.string(),
    usage: z.string(),
    from: z.string(),
})