import z from "zod"

export const dfQuerySchema = z.object({
    query: z.object({
        name: z.string().optional(),
        type: z.enum(["Paramecia", "Logia", "Zoan", "Ancient Zoan", "Mythical Zoan"]).optional(),
        current_owner: z.string().optional(),
        previous_owner: z.string().optional(),
        status: z.string().optional(),
        order: z.enum(["asc", "desc"]).optional(),
        sort: z.string().optional(),
        page: z
            .string()
            .transform((val) => parseInt(val))
            .refine((num) => num > 0, { message: "page must be a positive number" })
            .optional()
            .default(1),
        limit: z
            .string()
            .transform((val) => parseInt(val))
            .refine((num) => num > 0, { message: "page must be a positive number" })
            .optional()
            .default(10),
    }),
});

// for POST requests
export const createDevilFruitSchema = z.object({
    body: z.object({
        name: z.string(),
        japanese_name: z.string().optional(),
        english_name: z.string().optional(),
        meaning: z.string().optional(),
        fruit_debut: z.string().optional(),
        usage_debut: z.string().optional(),
        type: z.string().optional(),
        previous_owner: z.string().optional(),
        current_owner: z.string().optional(),
        status: z.string().optional(),
        url: z.string().optional(),
    })
});

// for PUT requests
export const updateDfSchema = dfQuerySchema.partial();