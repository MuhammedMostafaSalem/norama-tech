// Module: Defines project data, publication state, and automatic slug generation.
const mongoose = require("mongoose");
const { createSlug } = require("../utils/identity");

const projectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 160,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
            index: true,
        },
        type: {
            type: String,
            trim: true,
            maxlength: 80,
            default: "",
        },
        image: {
            type: String,
            required: true,
        },
        imageAlt: {
            type: String,
            trim: true,
            maxlength: 240,
            default: "",
        },
        gallery: {
            type: [String],
            default: [],
        },
        summary: {
            type: String,
            trim: true,
            maxlength: 500,
            default: "",
        },
        overview: {
            type: String,
            trim: true,
            maxlength: 3000,
            default: "",
        },
        challenge: {
            type: String,
            trim: true,
            maxlength: 3000,
            default: "",
        },
        approach: {
            type: String,
            trim: true,
            maxlength: 3000,
            default: "",
        },
        features: {
            type: [{ type: String, trim: true, maxlength: 120 }],
            default: [],
        },
        technologies: {
            type: [{ type: String, trim: true, maxlength: 120 }],
            default: [],
        },
        status: {
            type: String,
            enum: ["draft", "published"],
            default: "draft",
            index: true,
        },
    },
    { timestamps: true },
);

projectSchema.pre("validate", function () {
    if (this.isModified("name") && !this.isModified("slug")) {
        this.slug = createSlug(this.name) || `project-${this._id}`;
    }
});

module.exports = mongoose.model("Project", projectSchema);