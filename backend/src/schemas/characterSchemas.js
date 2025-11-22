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

export const createCharacterSchema = z.object({
    name: z.string(),
    japanese_name: z.string().optional(),
    df_id: z.number().nullable().optional(),
    debut: z.string().optional(),
    affiliations: z.string().optional(),
    occupation: z.string().optional(),
    origin: z.string().optional(),
    residence: z.string().optional(),
    alias: z.string().optional(),
    epithet: z.string().optional(),
    status: z.string().optional(),
    age: z.number().optional(),
    birthday: z.string().optional(),
    blood_type: z.string().optional(),
    bounty: z.string().optional(),
    url: z.string().optional(),
});

// for PUT requests
export const updateCharacterSchema = characterQuerySchema.partial();
