// Module: Converts unmatched routes into a standard API not-found error.
const { StatusCodes } = require("http-status-codes");
const ApiError = require("../utils/ApiError");

function notFound(req, res, next) {
    next(new ApiError(`Not Found - ${req.originalUrl}`, StatusCodes.NOT_FOUND));
}

module.exports = notFound;
