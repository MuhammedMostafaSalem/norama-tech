// Module: Mounts public published-page reads and admin content management routes.
const express = require("express");
const websiteContentController = require("../controllers/websiteContent.controller");
const { authorizeRoles, isAuthenticatedUser } = require("../middlewares/auth");
const validateRequest = require("../middlewares/validateRequest");
const {
    createWebsiteContentSchema,
    updateWebsiteContentSchema,
    websiteContentQuerySchema,
} = require("../schemas/websiteContent.schema");

const router = express.Router();
const authorizeAdmin = authorizeRoles("admin");

router.get("/pages/:page", websiteContentController.getPublishedPage);
router.get(
    "/admin",
    isAuthenticatedUser,
    authorizeAdmin,
    validateRequest(websiteContentQuerySchema, "query"),
    websiteContentController.getAllWebsiteContent,
);
router.get(
    "/admin/:id",
    isAuthenticatedUser,
    authorizeAdmin,
    websiteContentController.getWebsiteContent,
);
router.post(
    "/",
    isAuthenticatedUser,
    authorizeAdmin,
    validateRequest(createWebsiteContentSchema),
    websiteContentController.createWebsiteContent,
);
router.patch(
    "/:id",
    isAuthenticatedUser,
    authorizeAdmin,
    validateRequest(updateWebsiteContentSchema),
    websiteContentController.updateWebsiteContent,
);
router.delete(
    "/:id",
    isAuthenticatedUser,
    authorizeAdmin,
    websiteContentController.deleteWebsiteContent,
);

module.exports = router;