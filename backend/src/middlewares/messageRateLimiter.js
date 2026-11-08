// Module: Limits public contact form submissions by client IP.
const { rateLimit } = require("express-rate-limit");

const messageRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler(req, res, next, options) {
        return res.status(options.statusCode).json({
            success: false,
            statusCode: options.statusCode,
            message: req.t("Too many messages were submitted. Please try again later."),
        });
    },
});

module.exports = messageRateLimiter;