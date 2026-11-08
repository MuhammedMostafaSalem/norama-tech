// Module: Defines account security fields and password, OTP, slug, and access-token behavior.
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomInt } = require("node:crypto");
const env = require("../config/env");
const { createSlug } = require("../utils/identity");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
        otp: {
            type: String,
            select: false,
        },
        otpExpires: {
            type: Date,
            select: false,
        },
        otpResendTimeout: {
            type: Date,
            select: false,
        },
        otpAttempts: {
            type: Number,
            default: 0,
            select: false,
        },
        resetPasswordToken: {
            type: String,
            select: false,
        },
        resetPasswordExpires: {
            type: Date,
            select: false,
        },
        refreshTokens: {
            type: [String],
            default: [],
            select: false,
        },
        otpPurpose: {
            type: String,
            enum: ["email_verification", "forgot_password"],
            select: false,
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },
    },
    { timestamps: true },
);

userSchema.pre("validate", function () {
    if (this.isModified("firstName") || this.isModified("lastName")) {
        const nameSlug = createSlug(`${this.firstName || ""} ${this.lastName || ""}`);
        this.slug = `${nameSlug}-${this._id}`;
    }
});

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateOtp = async function (purpose) {
    const otp = randomInt(100000, 1000000).toString();
    const salt = await bcrypt.genSalt(10);
    this.otp = await bcrypt.hash(otp, salt);
    this.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    this.otpResendTimeout = new Date(Date.now() + 60 * 1000);
    this.otpPurpose = purpose;

    return otp;
};

userSchema.methods.compareOtp = function (candidateOtp) {
    return bcrypt.compare(candidateOtp, this.otp);
};

userSchema.methods.generateJWTToken = function () {
    return jwt.sign({ id: this._id, tokenType: "access" }, env.jwtAccessSecret, {
        expiresIn: env.jwtAccessExpiresIn,
    });
};

module.exports = mongoose.model("User", userSchema);
