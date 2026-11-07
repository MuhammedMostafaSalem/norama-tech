require("dotenv").config();

module.exports = {
    port: Number(process.env.PORT) || 5000,
    nodeEnv: process.env.NODE_ENV || "development",
    clientUrl: process.env.FRONTEND_URL || "http://localhost:3000",
    jwtSecretToken: process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET,
    jwtExpiresInToken: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    jwtRefreshSecret:
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET,
    jwtRefreshExpiresIn:
        process.env.JWT_REFRESH_EXPIRES_IN || process.env.JWT_EXPIRES_IN || "7d",
    refreshTokenCookieName: process.env.REFRESH_TOKEN_COOKIE_NAME || "refreshToken",
};
