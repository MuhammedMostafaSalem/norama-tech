// Module: Validates review submission, edits, moderation, and review list queries.
const { z } = require("zod");

const objectIdSchema = z.string().regex(/^[\da-f]{24}$/i, "Invalid ID.");

const createReviewSchema = z.object({
    project: objectIdSchema,
    rating: z.coerce.number().int().min(1).max(5),
    title: z.string().trim().max(120).optional(),
    comment: z.string().trim().min(10).max(2000),
}).strict();

const updateReviewSchema = z.object({
    project: objectIdSchema.optional(),
    rating: z.coerce.number().int().min(1).max(5).optional(),
    title: z.string().trim().max(120).optional(),
    comment: z.string().trim().min(10).max(2000).optional(),
}).strict().refine((value) => Object.keys(value).length > 0, {
    message: "Provide at least one review field to update.",
});

const moderateReviewSchema = z.object({
    status: z.enum(["approved", "rejected"]),
}).strict();

const publicReviewsQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().max(120).optional(),
    project: objectIdSchema.optional(),
    rating: z.coerce.number().int().min(1).max(5).optional(),
    sort: z.enum(["createdAt", "-createdAt", "rating", "-rating"]).default("-createdAt"),
}).strict();

const adminReviewsQuerySchema = publicReviewsQuerySchema.extend({
    status: z.enum(["pending", "approved", "rejected"]).optional(),
    user: objectIdSchema.optional(),
});

module.exports = {
    adminReviewsQuerySchema,
    createReviewSchema,
    moderateReviewSchema,
    publicReviewsQuerySchema,
    updateReviewSchema,
};