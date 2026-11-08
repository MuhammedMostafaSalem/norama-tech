// Module: Normalizes known errors and returns localized API error responses.
const { StatusCodes } = require("http-status-codes");
const ApiError = require("../utils/ApiError");
const env = require("../config/env");
const { translateMessage, translateValidationIssue } = require("../utils/translateMessage");

function errorMiddleware(error, req, res, next) {
    if (res.headersSent) {
        return next(error);
    }

    let statusCode = error.statusCode || error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    let message = error.message || "Internal Server Error";
    let errors;

    if (error.type === "entity.too.large") {
        statusCode = StatusCodes.REQUEST_TOO_LONG;
        message = "Request body is too large.";
    } else if (error instanceof SyntaxError && Object.hasOwn(error, "body")) {
        statusCode = StatusCodes.BAD_REQUEST;
        message = "Request contains invalid JSON.";
    }

    if (error.code === 11000) {
        statusCode = StatusCodes.CONFLICT;
        const field = Object.keys(error.keyValue || {})[0];
        message = field ? `A record with this ${field} already exists.` : "Duplicate value.";
        errors = field ? { field } : undefined;

        error = new ApiError(message, statusCode);
    }

    if (error.name === "ValidationError") {
        statusCode = StatusCodes.BAD_REQUEST;
        errors = Object.values(error.errors || {}).map((item) => item.message);
        message = errors.join(", ") || "Validation failed.";

        error = new ApiError(message, statusCode);
    }

    if (error.name === "CastError") {
        statusCode = StatusCodes.BAD_REQUEST;
        message = `Invalid ${error.path}: ${error.value}`;

        error = new ApiError(message, statusCode);
    }

    if (error.name === "ZodError") {
        statusCode = StatusCodes.BAD_REQUEST;
        errors = error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: translateValidationIssue(issue, req.language),
        }));
        message = "Request data is invalid.";

        error = new ApiError(message, statusCode);
    }

    if (error.name === "JsonWebTokenError") {
        statusCode = StatusCodes.UNAUTHORIZED;
        message = "Invalid authentication token";

        error = new ApiError(message, statusCode);
    }

    if (error.name === "TokenExpiredError") {
        statusCode = StatusCodes.UNAUTHORIZED;
        message = "Authentication token has expired";

        error = new ApiError(message, statusCode);
    }

    if (error.name === "MulterError") {
        statusCode = error.code === "LIMIT_FILE_SIZE"
            ? StatusCodes.REQUEST_TOO_LONG
            : StatusCodes.BAD_REQUEST;
        message = error.code === "LIMIT_FILE_SIZE"
            ? "Uploaded file exceeds the allowed size."
            : error.code === "LIMIT_UNEXPECTED_FILE"
                ? "Unexpected file field."
                : "Unable to process uploaded file.";
        errors = error.field ? { field: error.field, code: error.code } : { code: error.code };

        error = new ApiError(message, statusCode);
    }

    const response = {
        success: false,
        statusCode,
        message: translateMessage(
            env.nodeEnv === "production" && statusCode >= StatusCodes.INTERNAL_SERVER_ERROR
                ? "Internal Server Error"
                : message,
            req.language,
        ),
    };

    if (errors !== undefined) {
        response.errors = errors;
    }

    if (env.nodeEnv === "development") {
        response.stack = error.stack;
    }

    return res.status(statusCode).json(response);
}

module.exports = errorMiddleware;
