// Module: Mounts public review reads, signed-in user actions, and admin moderation routes.
const express = require("express");
const reviewController = require("../controllers/review.controller");
const { authorizeRoles, isAuthenticatedUser } = require("../middlewares/auth");
const validateRequest = require("../middlewares/validateRequest");
const {
    adminReviewsQuerySchema,
    createReviewSchema,
    publicReviewsQuerySchema,
    moderateReviewSchema,
    updateReviewSchema,
} = require("../schemas/review.schema");

const router = express.Router();
const authorizeAdmin = authorizeRoles("admin");

router.get(
    "/",
    validateRequest(publicReviewsQuerySchema, "query"),
    reviewController.getReviews,
);
router.get(
    "/admin",
    isAuthenticatedUser,
    authorizeAdmin,
    validateRequest(adminReviewsQuerySchema, "query"),
    reviewController.getAllReviewsByAdmin,
);
router.get(
    "/me",
    isAuthenticatedUser,
    validateRequest(publicReviewsQuerySchema, "query"),
    reviewController.getMyReviews,
);
router.get(
    "/admin/:id",
    isAuthenticatedUser,
    authorizeAdmin,
    reviewController.getReviewByAdmin,
);
router.post(
    "/",
    isAuthenticatedUser,
    validateRequest(createReviewSchema),
    reviewController.createReview,
);
router.patch(
    "/:id/status",
    isAuthenticatedUser,
    authorizeAdmin,
    validateRequest(moderateReviewSchema),
    reviewController.moderateReview,
);
router.patch(
    "/:id",
    isAuthenticatedUser,
    reviewController.authorizeReviewOwnerOrAdmin,
    validateRequest(updateReviewSchema),
    reviewController.updateReview,
);
router.delete(
    "/:id",
    isAuthenticatedUser,
    reviewController.authorizeReviewOwnerOrAdmin,
    reviewController.deleteReview,
);
router.get("/:id", reviewController.getReview);

module.exports = router;