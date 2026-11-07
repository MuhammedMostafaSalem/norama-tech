const ms = require("ms");
const tokenService = require("../services/token.service");
const env = require("../config/env");

const MAX_REFRESH_SESSIONS = 5;

function toPublicUser(user) {
    return {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        slug: user.slug,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
    };
}

async function sendToken(user, statusCode, res, options = {}) {
    let refreshToken = options.refreshToken;

    if (!refreshToken) {
        refreshToken = tokenService.createRefreshToken(user._id);
        user.refreshTokens = user.refreshTokens || [];
        user.refreshTokens.push(tokenService.hashRefreshToken(refreshToken));
        user.refreshTokens = user.refreshTokens.slice(-MAX_REFRESH_SESSIONS);
        await user.save();
    }

    res.cookie(
        env.refreshTokenCookieName,
        refreshToken,
        tokenService.getRefreshCookieOptions(),
    );

    return res.status(statusCode).json({
        success: true,
        message: options.message || "Authentication successful.",
        data: {
            user: toPublicUser(user),
            accessToken: user.generateJWTToken(),
            sessionExpiresAt: Date.now() + (ms(env.jwtExpiresInToken) || 15 * 60 * 1000),
        },
    });
}

sendToken.toPublicUser = toPublicUser;

module.exports = sendToken;