function catchAsync(asyncFunction) {
    return function (req, res, next) {
        Promise.resolve()
            .then(() => asyncFunction(req, res, next))
            .catch(next);
    };
}

module.exports = catchAsync;