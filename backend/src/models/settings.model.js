// Module: Defines the singleton global site settings document.
const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
    {
        siteKey: {
            type: String,
            enum: ["global"],
            default: "global",
            unique: true,
            required: true,
        },
        siteName: {
            type: String,
            trim: true,
            maxlength: 120,
            default: "Norama Tech",
        },
        defaultLanguage: {
            type: String,
            enum: ["ar", "en"],
            default: "ar",
        },
        allowRegistration: {
            type: Boolean,
            default: true,
        },
        contact: {
            email: { type: String, trim: true, lowercase: true, default: "" },
            phone: { type: String, trim: true, default: "" },
            whatsapp: { type: String, trim: true, default: "" },
            location: { type: String, trim: true, default: "" },
        },
        branding: {
            logoUrl: { type: String, trim: true, default: "" },
            faviconUrl: { type: String, trim: true, default: "" },
        },
        socialLinks: {
            type: [{
                platform: { type: String, trim: true, maxlength: 40, required: true },
                url: { type: String, trim: true, maxlength: 1000, required: true },
            }],
            default: [],
        },
        seo: {
            title: { type: String, trim: true, maxlength: 180, default: "" },
            description: { type: String, trim: true, maxlength: 500, default: "" },
            keywords: { type: [{ type: String, trim: true, maxlength: 60 }], default: [] },
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            select: false,
        },
    },
    { timestamps: true, minimize: false },
);

module.exports = mongoose.model("Settings", settingsSchema);