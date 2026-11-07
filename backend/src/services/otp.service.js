const { StatusCodes } = require("http-status-codes");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const sendEmail = require("../utils/sendEmail");
const verifyEmailTemplate = require("../templates/verifyEmailTemplate");
const forgotPasswordTemplate = require("../templates/forgotPasswordTemplate");

const MAX_ATTEMPTS = 5;
const OTP_PURPOSES = ["email_verification", "forgot_password"];

async function verifyOtp(email, otp, purpose = "email_verification") {
    if (!OTP_PURPOSES.includes(purpose)) {
        throw new ApiError("Invalid verification purpose.", StatusCodes.BAD_REQUEST);
    }

    const user = await User.findOne({
        email,
        otpPurpose: purpose,
        otpExpires: { $gt: new Date() },
    }).select("+otp +otpAttempts +otpExpires +otpPurpose +refreshTokens");

    if (!user || !user.otp) {
        throw new ApiError("Invalid or expired verification code.", StatusCodes.BAD_REQUEST);
    }

    if (!user.isActive) {
        throw new ApiError("This account is inactive.", StatusCodes.FORBIDDEN);
    }

    if (user.otpAttempts > MAX_ATTEMPTS) {
        user.isActive = false;
        user.otp = undefined;
        user.otpExpires = undefined;
        user.otpResendTimeout = undefined;
        user.otpPurpose = undefined;
        await user.save();

        throw new ApiError("Too many verification attempts.", StatusCodes.FORBIDDEN);
    }

    if (!(await user.compareOtp(otp))) {
        user.otpAttempts += 1;

        if (user.otpAttempts > MAX_ATTEMPTS) {
            user.isActive = false;
            user.otp = undefined;
            user.otpExpires = undefined;
            user.otpResendTimeout = undefined;
            user.otpPurpose = undefined;
        }

        await user.save();
        throw new ApiError(
            user.isActive ? "Invalid verification code." : "Too many verification attempts.",
            user.isActive ? StatusCodes.BAD_REQUEST : StatusCodes.FORBIDDEN,
        );
    }

    if (purpose === "email_verification") {
        if (user.isVerified) {
            throw new ApiError("Email is already verified.", StatusCodes.BAD_REQUEST);
        }

        user.isVerified = true;
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    user.otpResendTimeout = undefined;
    user.otpAttempts = 0;
    user.otpPurpose = undefined;
    await user.save();

    return user;
}

async function resendOtp(email, purpose = "email_verification") {
    if (!OTP_PURPOSES.includes(purpose)) {
        throw new ApiError("Invalid verification purpose.", StatusCodes.BAD_REQUEST);
    }

    const user = await User.findOne({ email }).select(
        "+otp +otpExpires +otpResendTimeout +otpAttempts +otpPurpose",
    );

    if (!user || !user.isActive) {
        return false;
    }

    if (purpose === "email_verification" && user.isVerified) {
        throw new ApiError("Email is already verified.", StatusCodes.BAD_REQUEST);
    }

    if (purpose === "forgot_password" && !user.isVerified) {
        return false;
    }

    if (user.otpResendTimeout && user.otpResendTimeout > new Date()) {
        throw new ApiError(
            "Please wait before requesting another code.",
            StatusCodes.TOO_MANY_REQUESTS,
        );
    }

    const otp = await user.generateOtp(purpose);
    user.otpAttempts = 0;
    await user.save();

    const username = `${user.firstName} ${user.lastName}`;
    const isPasswordReset = purpose === "forgot_password";

    await sendEmail({
        email: user.email,
        subject: isPasswordReset
            ? "Reset your Norama Tech password"
            : "Verify your Norama Tech email",
        message: isPasswordReset
            ? `Your password reset code is ${otp}. It expires in 10 minutes.`
            : `Your email verification code is ${otp}. It expires in 10 minutes.`,
        html: isPasswordReset
            ? forgotPasswordTemplate(username, otp)
            : verifyEmailTemplate(username, otp),
    });

    return true;
}

module.exports = { resendOtp, verifyOtp };