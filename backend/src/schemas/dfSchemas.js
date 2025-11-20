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

// for PUT requests
export const updateDfSchema = dfQuerySchema.partial();