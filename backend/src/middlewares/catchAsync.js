// Module: Forwards rejected async route handlers to Express error middleware.
function catchAsync(asyncFunction) {
    return function (req, res, next) {
        Promise.resolve()
            .then(() => asyncFunction(req, res, next))
            .catch(next);
    };
}

module.exports = catchAsync;