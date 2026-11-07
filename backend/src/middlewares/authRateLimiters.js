const { rateLimit } = require("express-rate-limit");

const commonOptions = {
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { success: false, message: "Too many requests. Please try again later." },
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