const { z } = require("zod");

const emailSchema = z.string().trim().email().transform((value) => value.toLowerCase());

const createMessageSchema = z.object({
    fullName: z.string().trim().min(2).max(120),
    email: emailSchema,
    phone: z.string().trim().max(30).optional(),
    projectType: z.string().trim().max(120).optional(),
    subject: z.string().trim().max(160).optional(),
    message: z.string().trim().min(10).max(5000),
}).strict();

const updateMessageSchema = z.object({
    status: z.enum(["new", "read", "replied", "archived"]),
}).strict();

const messagesQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().max(120).optional(),
    status: z.enum(["new", "read", "replied", "archived"]).optional(),
    sort: z.enum(["createdAt", "-createdAt", "fullName", "-fullName"]).default("-createdAt"),
}).strict();

module.exports = { createMessageSchema, messagesQuerySchema, updateMessageSchema };