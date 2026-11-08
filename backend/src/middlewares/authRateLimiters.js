// Module: Applies separate request limits to signup, login, and OTP actions.
const { rateLimit } = require("express-rate-limit");

const commonOptions = {
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler(req, res, next, options) {
        return res.status(options.statusCode).json({
            success: false,
            statusCode: options.statusCode,
            message: req.t("Too many requests. Please try again later."),
        });
    },
};

const signupLimiter = rateLimit({
    ...commonOptions,
    windowMs: 60 * 60 * 1000,
    limit: 5,
});

const loginLimiter = rateLimit({
    ...commonOptions,
    windowMs: 15 * 60 * 1000,
    limit: 10,
});

const otpActionLimiter = rateLimit({
    ...commonOptions,
    windowMs: 15 * 60 * 1000,
    limit: 10,
});

module.exports = { loginLimiter, otpActionLimiter, signupLimiter };