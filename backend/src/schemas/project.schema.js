// Module: Validates project fields, image-related form values, and project queries.
const { z } = require("zod");

const objectIdSchema = z.string().regex(/^[\da-f]{24}$/i, "Invalid category ID.");
const stringListSchema = z.preprocess((value) => {
    if (typeof value !== "string") {
        return value;
    }

    const trimmed = value.trim();

    if (!trimmed) {
        return [];
    }

    try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
            return parsed;
        }
    } catch {}

    return trimmed.split(",");
}, z.array(z.string().trim().min(1).max(120)).max(30));

const createProjectSchema = z.object({
    name: z.string().trim().min(1).max(160),
    slug: z.string().trim().min(1).max(180).optional(),
    category: objectIdSchema,
    type: z.string().trim().max(80).optional(),
    imageAlt: z.string().trim().max(240).optional(),
    summary: z.string().trim().max(500).optional(),
    overview: z.string().trim().max(3000).optional(),
    challenge: z.string().trim().max(3000).optional(),
    approach: z.string().trim().max(3000).optional(),
    features: stringListSchema.optional(),
    technologies: stringListSchema.optional(),
    status: z.enum(["draft", "published"]).optional(),
}).strict();

const updateProjectSchema = z.object({
    name: z.string().trim().min(1).max(160).optional(),
    slug: z.string().trim().min(1).max(180).optional(),
    category: objectIdSchema.optional(),
    type: z.string().trim().max(80).optional(),
    imageAlt: z.string().trim().max(240).optional(),
    summary: z.string().trim().max(500).optional(),
    overview: z.string().trim().max(3000).optional(),
    challenge: z.string().trim().max(3000).optional(),
    approach: z.string().trim().max(3000).optional(),
    features: stringListSchema.optional(),
    technologies: stringListSchema.optional(),
    status: z.enum(["draft", "published"]).optional(),
    clearGallery: z.enum(["true", "false"]).transform((value) => value === "true").optional(),
}).strict();

const projectQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().max(120).optional(),
    category: objectIdSchema.optional(),
    sort: z.enum(["createdAt", "-createdAt", "name", "-name"]).default("-createdAt"),
}).strict();

const adminProjectQuerySchema = projectQuerySchema.extend({
    status: z.enum(["draft", "published"]).optional(),
});

module.exports = {
    adminProjectQuerySchema,
    createProjectSchema,
    projectQuerySchema,
    updateProjectSchema,
};