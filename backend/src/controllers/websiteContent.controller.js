const { StatusCodes } = require("http-status-codes");
const WebsiteContent = require("../models/websiteContent.model");
const ApiError = require("../utils/ApiError");
const {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
} = require("../utils/crudFactory");
const { pageContentSchemas } = require("../schemas/websiteContent.schema");

exports.createWebsiteContent = createOne(WebsiteContent, {
    modelName: "websiteContent",
    beforeCreate: ({ req, data }) => {
        data.updatedBy = req.user._id;
    },
});

exports.getAllWebsiteContent = getAll(WebsiteContent, {
    modelName: "pages",
    searchFields: ["page"],
    defaultLimit: 10,
    defaultSort: "page",
    filterFactory: (req) => req.validatedQuery.pageType
        ? { page: req.validatedQuery.pageType }
        : {},
    select: "page isPublished updatedAt",
});

exports.getWebsiteContent = getOne(WebsiteContent, {
    modelName: "websiteContent",
    select: "page content isPublished updatedAt",
});

exports.getPublishedPage = async (req, res, next) => {
    const pageSchema = pageContentSchemas[req.params.page];

    if (!pageSchema) {
        return next(new ApiError("Website page not found.", StatusCodes.NOT_FOUND));
    }

    try {
        const page = await WebsiteContent.findOne({
            page: req.params.page,
            isPublished: true,
        }).select("page content updatedAt");

        if (!page) {
            throw new ApiError("Website page not found.", StatusCodes.NOT_FOUND);
        }

        return res.status(StatusCodes.OK).json({
            success: true,
            data: {
                page: page.page,
                content: page.content,
                updatedAt: page.updatedAt,
            },
        });
    } catch (error) {
        return next(error);
    }
};

exports.updateWebsiteContent = updateOne(WebsiteContent, {
    modelName: "websiteContent",
    allowedFields: ["content", "isPublished"],
    beforeUpdate: ({ req, document, data }) => {
        if (data.content !== undefined) {
            const schema = pageContentSchemas[document.page];
            const result = schema.safeParse(data.content);

            if (!result.success) {
                throw result.error;
            }

            data.content = result.data;
        }

        document.updatedBy = req.user._id;
    },
});

exports.deleteWebsiteContent = deleteOne(WebsiteContent, {
    modelName: "websiteContent",
});