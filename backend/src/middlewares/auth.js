const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const env = require("../config/env");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");

async function isAuthenticatedUser(req, res, next) {
    const authorization = req.get("authorization") || "";
    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
        throw new ApiError("Access token is required.", StatusCodes.UNAUTHORIZED);
    }

    const payload = jwt.verify(token, env.jwtSecretToken);

    if (payload.tokenType !== "access" || !payload.id) {
        throw new ApiError("Invalid access token.", StatusCodes.UNAUTHORIZED);
    }

    const user = await User.findById(payload.id);

    if (!user || !user.isActive || !user.isVerified) {
        throw new ApiError("Authentication is required.", StatusCodes.UNAUTHORIZED);
    }

    req.user = user;
    next();
}

function authorizeRoles(...roles) {
    return function (req, res, next) {
        if (!req.user) {
            return next(new ApiError("Authentication is required.", StatusCodes.UNAUTHORIZED));
        }

        if (!roles.includes(req.user.role)) {
            return next(new ApiError("You are not authorized to access this resource.", StatusCodes.FORBIDDEN));
        }

        next();
    };
}

module.exports = { authorizeRoles, isAuthenticatedUser };