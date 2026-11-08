// Module: Validates site settings fields and safe URLs for settings updates.
const { z } = require("zod");

const safeUrl = z.string().trim().max(1000).refine(
    (value) => !value || (/^\/(?!\/)/.test(value) && !value.includes("\\")) || /^https?:\/\//i.test(value),
    "Use a relative path or HTTP(S) URL.",
);

const contactSchema = z.object({
    email: z.string().trim().email().or(z.literal("")).optional(),
    phone: z.string().trim().max(40).optional(),
    whatsapp: z.string().trim().max(40).optional(),
    location: z.string().trim().max(240).optional(),
}).strict();

const brandingSchema = z.object({
    logoUrl: safeUrl.optional(),
    faviconUrl: safeUrl.optional(),
}).strict();

const socialLinkSchema = z.object({
    platform: z.string().trim().min(1).max(40),
    url: safeUrl.refine((value) => value.length > 0, "A social URL is required."),
}).strict();

const seoSchema = z.object({
    title: z.string().trim().max(180).optional(),
    description: z.string().trim().max(500).optional(),
    keywords: z.array(z.string().trim().min(1).max(60)).max(30).optional(),
}).strict();

const settingsFields = {
    siteName: z.string().trim().min(1).max(120).optional(),
    defaultLanguage: z.enum(["ar", "en"]).optional(),
    allowRegistration: z.boolean().optional(),
    contact: contactSchema.optional(),
    branding: brandingSchema.optional(),
    socialLinks: z.array(socialLinkSchema).max(20).optional(),
    seo: seoSchema.optional(),
};

const settingsPayloadSchema = z.object(settingsFields).strict();
const createSettingsSchema = settingsPayloadSchema.refine(
    (value) => Object.keys(value).length > 0,
    { message: "Provide at least one setting to create." },
);
const updateSettingsSchema = settingsPayloadSchema.refine(
    (value) => Object.keys(value).length > 0,
    { message: "Provide at least one setting to update." },
);

module.exports = { createSettingsSchema, updateSettingsSchema };