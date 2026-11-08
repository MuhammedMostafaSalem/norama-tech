// Module: Defines category fields, slug generation, and the related-project virtual.
const mongoose = require("mongoose");
const { createSlug } = require("../utils/identity");

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            maxlength: 100,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: "",
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

categorySchema.virtual("projects", {
    ref: "Project",
    localField: "_id",
    foreignField: "category",
});

categorySchema.pre("validate", function () {
    if (this.isModified("name") && !this.isModified("slug")) {
        this.slug = createSlug(this.name) || `category-${this._id}`;
    }
});

module.exports = mongoose.model("Category", categorySchema);