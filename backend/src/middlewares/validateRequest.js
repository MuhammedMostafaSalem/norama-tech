function validateRequest(schema, source = "body") {
    return function (req, res, next) {
        const result = schema.safeParse(req[source]);

        if (!result.success) {
            return next(result.error);
        }

        if (source === "query") {
            req.validatedQuery = result.data;
        } else {
            req.validatedBody = result.data;
        }

        next();
    };
}

module.exports = validateRequest;