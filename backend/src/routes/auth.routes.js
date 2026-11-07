const express = require("express");
const authController = require("../controllers/auth.controller");
const { isAuthenticatedUser } = require("../middlewares/auth");
const {
    loginLimiter,
    otpActionLimiter,
    signupLimiter,
} = require("../middlewares/authRateLimiters");
const validateRequest = require("../middlewares/validateRequest");
const {
    emailOnlySchema,
    loginSchema,
    registerSchema,
    resetPasswordSchema,
    verifyOtpSchema,
} = require("../schemas/auth.schema");

const router = express.Router();

router.post(
    "/signup",
    signupLimiter,
    validateRequest(registerSchema),
    authController.signup
);
router.post(
    "/register",
    signupLimiter,
    validateRequest(registerSchema),
    authController.register
);
router.post(
    "/verify-otp",
    otpActionLimiter,
    validateRequest(verifyOtpSchema),
    authController.verifyAccountOtp,
);
router.post(
    "/resend-otp",
    otpActionLimiter,
    validateRequest(emailOnlySchema),
    authController.resendAccountOtp,
);
router.post(
    "/login",
    loginLimiter,
    validateRequest(loginSchema),
    authController.login
);
router.post(
    "/refresh-token",
    authController.refreshToken
);
router.post(
    "/refresh",
    authController.refresh
);
router.post(
    "/logout",
    authController.logout
);
router.post(
    "/forgot-password",
    otpActionLimiter,
    validateRequest(emailOnlySchema),
    authController.forgotPassword,
);
router.post(
    "/reset-password",
    validateRequest(resetPasswordSchema),
    authController.resetPassword,
);
router.patch(
    "/reset-password",
    validateRequest(resetPasswordSchema),
    authController.resetPassword
);
router.get(
    "/me",
    isAuthenticatedUser,
    authController.currentUser,
);

module.exports = router;