const { createHash, randomBytes } = require("node:crypto");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../middlewares/catchAsync");
const otpService = require("../services/otp.service");
const tokenService = require("../services/token.service");
const sendEmail = require("../utils/sendEmail");
const sendToken = require("../utils/sendToken");
const env = require("../config/env");
const verifyEmailTemplate = require("../templates/verifyEmailTemplate");

const signup = catchAsync(async (req, res) => {
    const { firstName, lastName, email, phone, password } = req.validatedBody;
    const existingUser = await User.findOne({
        $or: [{ email }, { phone }],
    });

    if (existingUser) {
        throw new ApiError(
            "An account with this email or phone already exists.",
            StatusCodes.CONFLICT,
        );
    }

    const newUser = new User({ firstName, lastName, email, phone, password });
    const otp = await newUser.generateOtp("email_verification");
    await newUser.save();

    try {
        await sendEmail({
            email: newUser.email,
            subject: "Verify your Norama Tech email",
            message: `Your verification code is ${otp}. It expires in 10 minutes.`,
            html: verifyEmailTemplate(`${newUser.firstName} ${newUser.lastName}`, otp),
        });
    } catch (error) {
        await User.deleteOne({ _id: newUser._id, isVerified: false });
        throw new ApiError("Unable to send the verification email.", StatusCodes.BAD_GATEWAY);
    }

    return res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Account created. Check your email for the verification code.",
    });
});

const verifyAccountOtp = catchAsync(async (req, res) => {
    const { email, otp, purpose } = req.validatedBody;
    const user = await otpService.verifyOtp(email, otp, purpose);

    if (purpose === "email_verification") {
        return sendToken(user, StatusCodes.OK, res, {
            message: "Email verified successfully.",
        });
    }

    const resetToken = randomBytes(32).toString("hex");
    user.resetPasswordToken = createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    return res.status(StatusCodes.OK).json({
        success: true,
        message: "Verification successful. Use the reset token to set a new password.",
        data: { resetToken },
    });
});

const resendAccountOtp = catchAsync(async (req, res) => {
    const { email, purpose } = req.validatedBody;
    await otpService.resendOtp(email, purpose);

    return res.status(StatusCodes.OK).json({
        success: true,
        message: "If the account can receive a code, one has been sent.",
    });
});

const login = catchAsync(async (req, res) => {
    const { email, password } = req.validatedBody;
    const user = await User.findOne({ email }).select("+password +refreshTokens");

    if (!user || !(await user.comparePassword(password))) {
        throw new ApiError("Invalid email or password.", StatusCodes.UNAUTHORIZED);
    }

    if (!user.isActive) {
        throw new ApiError("This account is inactive.", StatusCodes.FORBIDDEN);
    }

    if (!user.isVerified) {
        throw new ApiError("Verify your email before signing in.", StatusCodes.FORBIDDEN);
    }

    return sendToken(user, StatusCodes.OK, res, { message: "Signed in successfully." });
});

const refreshToken = catchAsync(async (req, res) => {
    const refreshToken =
        req.cookies?.[env.refreshTokenCookieName] || req.body?.refreshToken;

    if (!refreshToken) {
        throw new ApiError("Please sign in again.", StatusCodes.UNAUTHORIZED);
    }

    const { user, refreshToken: rotatedToken } =
        await tokenService.rotateRefreshToken(refreshToken);

    return sendToken(user, StatusCodes.OK, res, {
        refreshToken: rotatedToken,
        message: "Session refreshed successfully.",
    });
});

const forgotPassword = catchAsync(async (req, res) => {
    await otpService.resendOtp(req.validatedBody.email, "forgot_password");

    return res.status(StatusCodes.OK).json({
        success: true,
        message: "If the account can receive a code, one has been sent.",
    });
});

const resetPassword = catchAsync(async (req, res) => {
    const { token, password } = req.validatedBody;
    const hashedToken = createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: new Date() },
    }).select("+resetPasswordToken +resetPasswordExpires +refreshTokens");

    if (!user) {
        throw new ApiError("Password reset token is invalid or expired.", StatusCodes.BAD_REQUEST);
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.otp = undefined;
    user.otpExpires = undefined;
    user.otpResendTimeout = undefined;
    user.otpAttempts = 0;
    user.otpPurpose = undefined;
    user.refreshTokens = [];
    await user.save();

    return res.status(StatusCodes.OK).json({
        success: true,
        message: "Password has been reset. Sign in with your new password.",
    });
});

const logout = catchAsync(async (req, res) => {
    const refreshToken =
        req.cookies?.[env.refreshTokenCookieName] || req.body?.refreshToken;

    await tokenService.revokeRefreshToken(refreshToken);
    res.clearCookie(
        env.refreshTokenCookieName,
        tokenService.getClearRefreshCookieOptions(),
    );

    return res.status(StatusCodes.OK).json({
        success: true,
        message: "Signed out successfully.",
    });
});

const currentUser = catchAsync(async (req, res) => {
    const user = req.user;

    return res.status(StatusCodes.OK).json({
        success: true,
        data: {
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                slug: user.slug,
                email: user.email,
                phone: user.phone,
                role: user.role,
                isVerified: user.isVerified,
                createdAt: user.createdAt,
            },
        },
    });
});

module.exports = {
    currentUser,
    forgotPassword,
    login,
    logout,
    refreshToken,
    refresh: refreshToken,
    register: signup,
    resendAccountOtp,
    resendOtp: resendAccountOtp,
    resetPassword,
    signup,
    verifyAccountOtp,
    verifyOtp: verifyAccountOtp,
};
