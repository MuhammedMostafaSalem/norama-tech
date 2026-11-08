// Module: Defines one editable content document per website page.
const mongoose = require("mongoose");

const websiteContentSchema = new mongoose.Schema(
    {
        page: {
            type: String,
            enum: ["home", "about", "services", "contact"],
            required: true,
            unique: true,
            index: true,
        },
        content: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        isPublished: {
            type: Boolean,
            default: true,
            index: true,
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            select: false,
        },
    },
    { timestamps: true, minimize: false },
);

module.exports = mongoose.model("WebsiteContent", websiteContentSchema);