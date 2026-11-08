// Module: Validates credentials, password rules, OTP actions, and password reset payloads.
const { z } = require("zod");

const emailSchema = z.string().trim().email().transform((value) => value.toLowerCase());
const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password must be at most 72 characters.")
    .refine((value) => Buffer.byteLength(value, "utf8") <= 72, {
        message: "Password must be at most 72 bytes.",
    });

const registerSchema = z.object({
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
    email: emailSchema,
    phone: z.string().trim().min(7).max(20),
    password: passwordSchema,
});

const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1),
});

const verifyOtpSchema = z.object({
    email: emailSchema,
    otp: z.string().regex(/^\d{6}$/, "OTP must be a 6-digit code."),
    purpose: z.enum(["email_verification", "forgot_password"]).default("email_verification"),
});

const emailOnlySchema = z.object({
    email: emailSchema,
    purpose: z.enum(["email_verification", "forgot_password"]).default("email_verification"),
});

const resetPasswordSchema = z.object({
    token: z.string().min(32).max(256),
    password: passwordSchema,
    confirmPassword: z.string(),
}).refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});

module.exports = {
    emailOnlySchema,
    loginSchema,
    registerSchema,
    resetPasswordSchema,
    verifyOtpSchema,
};