// Module: Defines persisted contact message and notification status fields.
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 120,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            maxlength: 254,
            index: true,
        },
        phone: {
            type: String,
            trim: true,
            maxlength: 30,
            default: "",
        },
        projectType: {
            type: String,
            trim: true,
            maxlength: 120,
            default: "",
        },
        subject: {
            type: String,
            required: true,
            trim: true,
            maxlength: 160,
        },
        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: 5000,
        },
        status: {
            type: String,
            enum: ["new", "read", "replied", "archived"],
            default: "new",
            index: true,
        },
        notificationStatus: {
            type: String,
            enum: ["pending", "sent", "failed"],
            default: "pending",
        },
    },
    { timestamps: true },
);

messageSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);