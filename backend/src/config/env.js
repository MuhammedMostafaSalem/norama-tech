// Module: Loads environment variables and exposes normalized application configuration.
require("dotenv").config();

module.exports = {
    port: Number(process.env.PORT) || 5000,
    nodeEnv: process.env.NODE_ENV || "development",
    defaultLanguage: process.env.DEFAULT_LANGUAGE === "en" ? "en" : "ar",
    clientUrl: process.env.FRONTEND_URL || "http://localhost:3000",
    allowedOrigins: (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || "http://localhost:3000")
        .split(",")
        .map((origin) => origin.trim().replace(/\/$/, ""))
        .filter(Boolean),
    trustedProxyHops: Math.max(0, Number.parseInt(process.env.TRUST_PROXY_HOPS || "0", 10) || 0),
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    refreshTokenCookieName: process.env.REFRESH_TOKEN_COOKIE_NAME || "refreshToken",
};
