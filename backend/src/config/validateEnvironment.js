// Module: Rejects unsafe or incomplete environment settings before production startup.
const env = require("./env");

function validateEnvironment() {
    if (env.nodeEnv !== "production") {
        return;
    }

    const requiredVariables = [
        "DB_URI",
        "JWT_ACCESS_SECRET",
        "JWT_REFRESH_SECRET",
    ];
    const missingVariables = requiredVariables.filter((name) => !process.env[name]);

    if (missingVariables.length > 0) {
        throw new Error(`Missing production environment variables: ${missingVariables.join(", ")}`);
    }

    if (process.env.JWT_ACCESS_SECRET.length < 32 || process.env.JWT_REFRESH_SECRET.length < 32) {
        throw new Error("Production JWT secrets must be at least 32 characters long.");
    }

    if (process.env.JWT_ACCESS_SECRET === process.env.JWT_REFRESH_SECRET) {
        throw new Error("Production access and refresh JWT secrets must be different.");
    }

    if (!process.env.CORS_ORIGINS && !process.env.FRONTEND_URL) {
        throw new Error("Set CORS_ORIGINS or FRONTEND_URL in production.");
    }

    if (env.allowedOrigins.includes("*")) {
        throw new Error("Wildcard CORS origins are not allowed in production.");
    }
}

module.exports = validateEnvironment;