const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
            index: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        title: {
            type: String,
            trim: true,
            maxlength: 120,
            default: "",
        },
        comment: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
            maxlength: 2000,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
            index: true,
        },
    },
    { timestamps: true },
);

reviewSchema.index({ user: 1, project: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);