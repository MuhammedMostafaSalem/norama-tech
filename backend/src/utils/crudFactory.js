const { StatusCodes } = require("http-status-codes");
const catchAsync = require("../middlewares/catchAsync");
const ApiError = require("./ApiError");
const ApiFeatures = require("./ApiFeatures");

function getRequestData(req) {
    return req.validatedBody || req.body || {};
}

function serialize(document, serializer) {
    return serializer ? serializer(document) : document;
}

exports.createOne = (
    Model,
    {
        modelName = "document",
        beforeCreate = null,
        afterCreate = null,
        onError = null,
        serializer = null,
    } = {},
) => catchAsync(async (req, res) => {
    const data = getRequestData(req);
    let document;

    try {
        if (beforeCreate) {
            await beforeCreate({ req, Model, data });
        }

        document = await Model.create(data);
    } catch (error) {
        if (onError) {
            await onError({ req, Model, data, error });
        }

        throw error;
    }

    if (afterCreate) {
        await afterCreate({ req, document, Model });
    }

    return res.status(StatusCodes.CREATED).json({
        success: true,
        message: `${modelName} created successfully.`,
        data: serialize(document, serializer),
    });
});

exports.getAll = (
    Model,
    {
        modelName = "documents",
        searchFields = [],
        populate = null,
        defaultLimit = 10,
        defaultSort = "-createdAt",
        filterFactory = null,
        select = null,
        serializer = null,
    } = {},
) => catchAsync(async (req, res) => {
    const queryString = req.validatedQuery || req.query;
    const initialFilter = filterFactory ? filterFactory(req) : {};
    const features = new ApiFeatures(Model, queryString, initialFilter)
        .search(searchFields)
        .filter()
        .sort(defaultSort)
        .select(select)
        .loadMore(defaultLimit)
        .populate(populate);

    await features.buildMeta();
    const documents = await features.query;

    return res.status(StatusCodes.OK).json({
        success: true,
        data: {
            [modelName]: serializer
                ? documents.map((document) => serializer(document))
                : documents,
        },
        meta: features.meta,
    });
});

exports.getOne = (
    Model,
    { modelName = "document", populate = null, select = null, serializer = null } = {},
) => catchAsync(async (req, res) => {
    const mongoose = require("mongoose");
    const identifier = req.params.id;
    const isId = mongoose.isValidObjectId(identifier);
    let query = isId
        ? Model.findOne({ $or: [{ _id: identifier }, { slug: identifier }] })
        : Model.findOne({ slug: identifier });

    if (populate) {
        query = query.populate(populate);
    }

    if (select) {
        query = query.select(select);
    }

    const document = await query;

    if (!document) {
        throw new ApiError(`${modelName} not found.`, StatusCodes.NOT_FOUND);
    }

    return res.status(StatusCodes.OK).json({
        success: true,
        data: { [modelName]: serialize(document, serializer) },
    });
});

exports.updateOne = (
    Model,
    {
        modelName = "document",
        idFromRequest = (req) => req.params.id,
        allowedFields = null,
        beforeUpdate = null,
        afterUpdate = null,
        onError = null,
        serializer = null,
    } = {},
) => catchAsync(async (req, res) => {
    const document = await Model.findById(idFromRequest(req));

    if (!document) {
        throw new ApiError(`${modelName} not found.`, StatusCodes.NOT_FOUND);
    }

    const data = getRequestData(req);
    const fields = allowedFields || Object.keys(data);

    try {
        if (beforeUpdate) {
            await beforeUpdate({ req, document, Model, data });
        }

        for (const field of fields) {
            if (Object.hasOwn(data, field)) {
                document.set(field, data[field]);
            }
        }

        await document.save();
    } catch (error) {
        if (onError) {
            await onError({ req, document, Model, data, error });
        }

        throw error;
    }

    if (afterUpdate) {
        await afterUpdate({ req, document, Model });
    }

    return res.status(StatusCodes.OK).json({
        success: true,
        message: `${modelName} updated successfully.`,
        data: { [modelName]: serialize(document, serializer) },
    });
});

exports.deleteOne = (
    Model,
    { modelName = "document", beforeDelete = null, afterDelete = null } = {},
) => catchAsync(async (req, res) => {
    const document = await Model.findById(req.params.id);

    if (!document) {
        throw new ApiError(`${modelName} not found.`, StatusCodes.NOT_FOUND);
    }

    if (beforeDelete) {
        await beforeDelete({ req, document, Model });
    }

    await document.deleteOne();

    if (afterDelete) {
        await afterDelete({ req, document, Model });
    }

    return res.status(StatusCodes.OK).json({
        success: true,
        message: `${modelName} deleted successfully.`,
        data: null,
    });
});