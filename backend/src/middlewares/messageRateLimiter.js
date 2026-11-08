const { rateLimit } = require("express-rate-limit");

const messageRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many messages were submitted. Please try again later.",
    },
});

module.exports = messageRateLimiter;