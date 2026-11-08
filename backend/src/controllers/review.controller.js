// Module: Handles review submission, ownership checks, public reads, and admin moderation.
const { StatusCodes } = require("http-status-codes");
const Review = require("../models/review.model");
const Project = require("../models/project.model");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../middlewares/catchAsync");
const { createOne, deleteOne, getAll, getOne, updateOne } = require("../utils/crudFactory");

const reviewFields = "project user rating title comment status createdAt updatedAt";
const reviewPopulate = [
    { path: "user", select: "firstName lastName" },
    { path: "project", select: "name slug image" },
];

async function ensurePublishedProject(projectId) {
    const project = await Project.exists({ _id: projectId, status: "published" });

    if (!project) {
        throw new ApiError("Reviews can only be submitted for published projects.", StatusCodes.BAD_REQUEST);
    }
}

// Create a pending review for the signed-in user and a published project.
exports.createReview = createOne(Review, {
    modelName: "review",
    beforeCreate: async ({ req, data }) => {
        await ensurePublishedProject(data.project);
        data.user = req.user._id;
        data.status = "pending";
    },
    afterCreate: async ({ document }) => {
        await document.populate(reviewPopulate);
    },
});

exports.getReviews = getAll(Review, {
    modelName: "reviews",
    searchFields: ["title", "comment"],
    defaultLimit: 10,
    defaultSort: "-createdAt",
    filterFactory: () => ({ status: "approved" }),
    select: reviewFields,
    populate: reviewPopulate,
});

exports.getMyReviews = getAll(Review, {
    modelName: "reviews",
    searchFields: ["title", "comment"],
    defaultLimit: 10,
    defaultSort: "-createdAt",
    filterFactory: (req) => ({ user: req.user._id }),
    select: reviewFields,
    populate: reviewPopulate,
});

exports.getAllReviewsByAdmin = getAll(Review, {
    modelName: "reviews",
    searchFields: ["title", "comment"],
    defaultLimit: 10,
    defaultSort: "-createdAt",
    select: reviewFields,
    populate: reviewPopulate,
});

exports.getReview = catchAsync(async (req, res) => {
    const review = await Review.findOne({
        _id: req.params.id,
        status: "approved",
    })
        .select(reviewFields)
        .populate(reviewPopulate);

    if (!review) {
        throw new ApiError("Review not found.", StatusCodes.NOT_FOUND);
    }

    return res.status(StatusCodes.OK).json({ success: true, data: { review } });
});

exports.getReviewByAdmin = getOne(Review, {
    modelName: "review",
    select: reviewFields,
    populate: reviewPopulate,
});

exports.authorizeReviewOwnerOrAdmin = async (req, res, next) => {
    const review = await Review.findById(req.params.id).select("user");

    if (!review) {
        return next(new ApiError("Review not found.", StatusCodes.NOT_FOUND));
    }

    if (
        req.user.role !== "admin" &&
        review.user.toString() !== req.user._id.toString()
    ) {
        return next(new ApiError("You can only manage your own reviews.", StatusCodes.FORBIDDEN));
    }

    req.review = review;
    next();
};

exports.updateReview = updateOne(Review, {
    modelName: "review",
    allowedFields: ["project", "rating", "title", "comment"],
    beforeUpdate: async ({ req, document, data }) => {
        if (req.user.role !== "admin") {
            if (document.user.toString() !== req.user._id.toString()) {
                throw new ApiError("You can only update your own reviews.", StatusCodes.FORBIDDEN);
            }

            document.status = "pending";
        }

        if (data.project) {
            await ensurePublishedProject(data.project);
        }
    },
    afterUpdate: async ({ document }) => {
        await document.populate(reviewPopulate);
    },
});

// Allow admins to approve or reject a review through the moderation endpoint.
exports.moderateReview = updateOne(Review, {
    modelName: "review",
    allowedFields: ["status"],
    serializer: (review) => review,
});

exports.deleteReview = deleteOne(Review, {
    modelName: "review",
    beforeDelete: ({ req, document }) => {
        if (
            req.user.role !== "admin" &&
            document.user.toString() !== req.user._id.toString()
        ) {
            throw new ApiError("You can only delete your own reviews.", StatusCodes.FORBIDDEN);
        }
    },
});
