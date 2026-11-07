const { z } = require("zod");

const createCategorySchema = z.object({
    name: z.string().trim().min(1).max(100),
    description: z.string().trim().max(1000).optional(),
    isActive: z.boolean().optional(),
}).strict();

const updateCategorySchema = z.object({
    name: z.string().trim().min(1).max(100).optional(),
    description: z.string().trim().max(1000).optional(),
    isActive: z.boolean().optional(),
}).strict().refine((value) => Object.keys(value).length > 0, {
    message: "Provide at least one category field to update.",
});

const listCategoriesQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().max(120).optional(),
    isActive: z.enum(["true", "false"]).transform((value) => value === "true").optional(),
    sort: z.enum(["createdAt", "-createdAt", "name", "-name"]).default("name"),
}).strict();

module.exports = {
    createCategorySchema,
    listCategoriesQuerySchema,
    updateCategorySchema,
};