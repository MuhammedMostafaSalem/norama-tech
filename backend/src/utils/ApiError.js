const { StatusCodes } = require("http-status-codes");

class ApiError extends Error {
    constructor(message, statusCode = StatusCodes.INTERNAL_SERVER_ERROR) {
        super(message);

        this.name = "ApiError";
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ApiError;