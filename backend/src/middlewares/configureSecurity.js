const compression = require("compression");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");
const env = require("../config/env");

function configureSecurity(app) {
    app.disable("x-powered-by");
    app.use(
        helmet({
            crossOriginResourcePolicy: { policy: "cross-origin" },
        }),
    );
    app.use(cors({
        origin: env.clientUrl,
        credentials: true
    }));
    app.use(
        "/api",
        rateLimit({
            windowMs: 15 * 60 * 1000,
            limit: 100,
            standardHeaders: "draft-8",
            legacyHeaders: false,
        }),
    );
    app.use(hpp());
    app.use(compression());
}

module.exports = configureSecurity;
