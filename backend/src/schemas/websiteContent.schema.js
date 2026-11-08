// Module: Validates the different strict content shapes for each website page.
const { z } = require("zod");

const text = (max = 500) => z.string().trim().min(1).max(max);
const optionalText = (max = 500) => z.string().trim().max(max).optional();
const safeUrlSchema = z.string().trim().min(1).max(1000).refine(
    (value) =>
        (/^\/(?!\/)/.test(value) && !value.includes("\\")) ||
        /^https?:\/\//i.test(value),
    "Use a relative site path or an HTTP(S) URL.",
);
const hrefSchema = safeUrlSchema;

const actionSchema = z.object({
    label: text(100),
    href: hrefSchema,
}).strict();

const heroProofSchema = z.object({
    icon: optionalText(40),
    title: text(180),
    description: text(500),
}).strict();

const heroNoteSchema = z.object({
    label: optionalText(120),
    title: text(180),
    description: optionalText(300),
}).strict();

const heroSchema = z.object({
    eyebrow: text(120),
    title: text(240),
    highlight: optionalText(160),
    description: text(1000),
    imageUrl: safeUrlSchema.optional(),
    imageAlt: optionalText(240),
    caption: optionalText(180),
    proof: heroProofSchema.optional(),
    visualNotes: z.array(heroNoteSchema).max(4).optional(),
    primaryAction: actionSchema.optional(),
    secondaryAction: actionSchema.optional(),
}).strict();

const sectionHeadingSchema = z.object({
    eyebrow: optionalText(120),
    title: text(240),
    highlight: optionalText(160),
    description: optionalText(1000),
    action: actionSchema.optional(),
}).strict();

const contentItemSchema = z.object({
    number: optionalText(20),
    title: text(180),
    description: optionalText(1000),
    body: optionalText(2000),
    icon: optionalText(60),
    href: safeUrlSchema.optional(),
    imageUrl: safeUrlSchema.optional(),
    imageAlt: optionalText(240),
    label: optionalText(120),
    value: optionalText(500),
    deliverables: z.array(text(180)).max(20).optional(),
}).strict();

const ctaSchema = z.object({
    eyebrow: optionalText(120),
    title: text(240),
    highlight: optionalText(160),
    action: actionSchema,
}).strict();

const homeContentSchema = z.object({
    hero: heroSchema,
    capabilities: z.array(text(120)).max(12),
    servicesSection: sectionHeadingSchema.extend({
        items: z.array(contentItemSchema).max(12),
    }).strict(),
    projectsSection: sectionHeadingSchema.extend({
        disclaimer: optionalText(500),
    }).strict(),
    processSection: sectionHeadingSchema.extend({
        steps: z.array(contentItemSchema).max(12),
    }).strict(),
    cta: ctaSchema,
}).strict();

const aboutContentSchema = z.object({
    hero: heroSchema,
    storySection: sectionHeadingSchema.extend({
        visualLabel: optionalText(120),
        paragraphs: z.array(text(2000)).min(1).max(12),
        action: actionSchema.optional(),
    }).strict(),
    valuesSection: sectionHeadingSchema.extend({
        items: z.array(contentItemSchema).max(12),
    }).strict(),
    cta: ctaSchema,
}).strict();

const servicesContentSchema = z.object({
    hero: heroSchema,
    servicesSection: sectionHeadingSchema.extend({
        items: z.array(contentItemSchema).max(24),
    }).strict(),
    cta: ctaSchema,
}).strict();

const contactContentSchema = z.object({
    hero: heroSchema,
    contactSection: sectionHeadingSchema.extend({
        channels: z.array(contentItemSchema).max(12),
        form: z.object({
            title: text(200),
            description: text(1000),
            submitLabel: text(100),
            disclaimer: optionalText(500),
            fields: z.array(z.object({
                name: z.string().regex(/^[a-zA-Z][\da-zA-Z]*$/),
                label: text(160),
                type: z.enum(["text", "email", "tel", "select", "textarea"]),
                placeholder: optionalText(240),
                required: z.boolean().default(false),
                options: z.array(text(160)).max(20).optional(),
            }).strict()).max(20).optional(),
        }).strict(),
    }).strict(),
}).strict();

const pageContentSchemas = {
    home: homeContentSchema,
    about: aboutContentSchema,
    services: servicesContentSchema,
    contact: contactContentSchema,
};

const createWebsiteContentSchema = z.discriminatedUnion("page", [
    z.object({ page: z.literal("home"), content: homeContentSchema, isPublished: z.boolean().optional() }).strict(),
    z.object({ page: z.literal("about"), content: aboutContentSchema, isPublished: z.boolean().optional() }).strict(),
    z.object({ page: z.literal("services"), content: servicesContentSchema, isPublished: z.boolean().optional() }).strict(),
    z.object({ page: z.literal("contact"), content: contactContentSchema, isPublished: z.boolean().optional() }).strict(),
]);

const updateWebsiteContentSchema = z.object({
    content: z.unknown().optional(),
    isPublished: z.boolean().optional(),
}).strict().refine((value) => Object.keys(value).length > 0, {
    message: "Provide content or publication status to update.",
});

const websiteContentQuerySchema = z.object({
    pageType: z.enum(["home", "about", "services", "contact"]).optional(),
    isPublished: z.enum(["true", "false"]).transform((value) => value === "true").optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(20).default(10),
}).strict();

module.exports = {
    createWebsiteContentSchema,
    pageContentSchemas,
    updateWebsiteContentSchema,
    websiteContentQuerySchema,
};