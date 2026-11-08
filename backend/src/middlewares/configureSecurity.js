// Module: Applies proxy settings, security headers, CORS, rate limits, and response compression.
const compression = require("compression");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");
const env = require("../config/env");

function configureSecurity(app) {
    if (env.trustedProxyHops > 0) {
        app.set("trust proxy", env.trustedProxyHops);
    }

    app.disable("x-powered-by");
    app.use(
        helmet({
            crossOriginResourcePolicy: { policy: "cross-origin" },
            hsts: env.nodeEnv === "production"
                ? { maxAge: 15552000, includeSubDomains: true }
                : false,
        }),
    );
    app.use(cors({
        origin(origin, callback) {
            if (!origin || env.allowedOrigins.includes(origin.replace(/\/$/, ""))) {
                return callback(null, true);
            }

            return callback(null, false);
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Language", "X-Locale"],
        maxAge: 600,
    }));
    app.use(
        "/api",
        rateLimit({
            windowMs: 15 * 60 * 1000,
            limit: 100,
            standardHeaders: "draft-8",
            legacyHeaders: false,
            handler(req, res, next, options) {
                return res.status(options.statusCode).json({
                    success: false,
                    statusCode: options.statusCode,
                    message: req.t("Too many requests. Please try again later."),
                });
            },
        }),
    );
    app.use(hpp());
    app.use(compression());
}

module.exports = configureSecurity;
