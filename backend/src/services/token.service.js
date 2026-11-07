const { createHash, randomUUID } = require("node:crypto");
const jwt = require("jsonwebtoken");
const ms = require("ms");
const { StatusCodes } = require("http-status-codes");
const env = require("../config/env");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");

function hashRefreshToken(token) {
    return createHash("sha256").update(token).digest("hex");
}

function createRefreshToken(userId) {
    return jwt.sign(
        { id: String(userId), tokenType: "refresh", jti: randomUUID() },
        env.jwtRefreshSecret,
        { expiresIn: env.jwtRefreshExpiresIn },
    );
}

function verifyRefreshToken(token) {
    const payload = jwt.verify(token, env.jwtRefreshSecret);

    if (payload.tokenType !== "refresh" || !payload.id || !payload.jti) {
        throw new ApiError("Invalid refresh token.", StatusCodes.UNAUTHORIZED);
    }

    return payload;
}

async function rotateRefreshToken(token) {
    const payload = verifyRefreshToken(token);
    const currentHash = hashRefreshToken(token);
    const user = await User.findOne({
        _id: payload.id,
        refreshTokens: currentHash,
        isActive: true,
        isVerified: true,
    });

    if (!user) {
        throw new ApiError("Refresh token is invalid or revoked.", StatusCodes.UNAUTHORIZED);
    }

    const nextRefreshToken = createRefreshToken(user._id);
    const result = await User.updateOne(
        { _id: user._id, refreshTokens: currentHash },
        { $set: { "refreshTokens.$": hashRefreshToken(nextRefreshToken) } },
    );

    if (!result.modifiedCount) {
        throw new ApiError("Refresh token is invalid or revoked.", StatusCodes.UNAUTHORIZED);
    }

    return { user, refreshToken: nextRefreshToken };
}

async function revokeRefreshToken(token) {
    if (!token) {
        return;
    }

    const tokenHash = hashRefreshToken(token);
    await User.updateOne(
        { refreshTokens: tokenHash },
        { $pull: { refreshTokens: tokenHash } },
    );
}

function getRefreshCookieOptions() {
    return {
        httpOnly: true,
        secure: env.nodeEnv === "production",
        sameSite: "strict",
        path: "/api/auth",
        maxAge: ms(env.jwtRefreshExpiresIn) || 7 * 24 * 60 * 60 * 1000,
    };
}

function getClearRefreshCookieOptions() {
    const { maxAge, ...options } = getRefreshCookieOptions();
    return options;
}

module.exports = {
    createRefreshToken,
    getClearRefreshCookieOptions,
    getRefreshCookieOptions,
    hashRefreshToken,
    revokeRefreshToken,
    rotateRefreshToken,
    verifyRefreshToken,
};