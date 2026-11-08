// Module: Mounts public settings reads and admin-only settings CRUD routes.
const express = require("express");
const settingsController = require("../controllers/settings.controller");
const { authorizeRoles, isAuthenticatedUser } = require("../middlewares/auth");
const validateRequest = require("../middlewares/validateRequest");
const { createSettingsSchema, updateSettingsSchema } = require("../schemas/settings.schema");

const router = express.Router();
const authorizeAdmin = authorizeRoles("admin");

router.get("/", settingsController.getPublicSettings);
router.get("/admin", isAuthenticatedUser, authorizeAdmin, settingsController.getSettings);
router.post(
    "/",
    isAuthenticatedUser,
    authorizeAdmin,
    validateRequest(createSettingsSchema),
    settingsController.createSettings,
);
router.get("/:id", isAuthenticatedUser, authorizeAdmin, settingsController.getSettingsById);
router.patch(
    "/:id",
    isAuthenticatedUser,
    authorizeAdmin,
    validateRequest(updateSettingsSchema),
    settingsController.updateSettings,
);
router.delete("/:id", isAuthenticatedUser, authorizeAdmin, settingsController.deleteSettings);

module.exports = router;