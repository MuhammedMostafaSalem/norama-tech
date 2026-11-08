// Module: Validates profile edits, password changes, and admin user filters.
const { z } = require("zod");

const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password must be at most 72 characters.")
    .refine((value) => Buffer.byteLength(value, "utf8") <= 72, {
        message: "Password must be at most 72 bytes.",
    });

const updateUserSchema = z.object({
    firstName: z.string().trim().min(1).max(80).optional(),
    lastName: z.string().trim().min(1).max(80).optional(),
    phone: z.string().trim().min(7).max(20).optional(),
}).strict().refine((value) => Object.keys(value).length > 0, {
    message: "Provide at least one profile field to update.",
});

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
}).refine((value) => value.newPassword === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});

const updateUserByAdminSchema = z.object({
    role: z.enum(["admin", "user"]).optional(),
    isActive: z.boolean().optional(),
}).strict().refine((value) => Object.keys(value).length > 0, {
    message: "Provide a role or account status to update.",
});

const listUsersQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().max(120).optional(),
    role: z.enum(["admin", "user"]).optional(),
    isActive: z.enum(["true", "false"]).transform((value) => value === "true").optional(),
    sort: z.enum([
        "createdAt",
        "-createdAt",
        "firstName",
        "-firstName",
        "email",
        "-email",
    ]).default("-createdAt"),
});

module.exports = {
    changePasswordSchema,
    listUsersQuerySchema,
    updateUserByAdminSchema,
    updateUserSchema,
};