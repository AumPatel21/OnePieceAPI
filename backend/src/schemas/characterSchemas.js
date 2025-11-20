import z from "zod";

export const characterQuerySchema = z.object({
    query: z.object({
        name: z.string().optional(),
        affiliation: z.string().optional(),
        occupation: z.string().optional(),
        devil_fruit: z.string().optional(),
        status: z.string().optional(),
        sort: z.string().optional(),
        order: z.enum(["asc", "desc"]).optional(),
        bounty_gte: z
            .string()
            .transform((val) => parseInt(val))
            .refine((num) => !isNaN(num), { message: "bounty_gte must be a number" })
            .optional(),
        bounty_lte: z
            .string()
            .transform((val) => parseInt(val))
            .refine((num) => !isNaN(num), { message: "bounty_lte must be a number" })
            .optional(),
        page: z
            .string()
            .transform((val) => parseInt(val))
            .refine((num) => num > 0, { message: "page must be a positive number" })
            .optional()
            .default(1),
        limit: z
            .string()
            .transform((val) => parseInt(val))
            .refine((num) => num > 0, { message: "limit must be a positive number" })
            .optional()
            .default(10),
    }),
});

// for PUT requests
export const updateCharacterSchema = characterQuerySchema.partial();
