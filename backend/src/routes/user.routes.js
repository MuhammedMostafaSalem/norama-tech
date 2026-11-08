// Module: Mounts authenticated profile routes and admin-only user management routes.
const express = require("express");
const userController = require("../controllers/user.controller");
const { authorizeRoles, isAuthenticatedUser } = require("../middlewares/auth");
const validateRequest = require("../middlewares/validateRequest");
const {
    changePasswordSchema,
    listUsersQuerySchema,
    updateUserByAdminSchema,
    updateUserSchema,
} = require("../schemas/user.schema");

const router = express.Router();
const authorizeAdmin = authorizeRoles("admin");

router.use(isAuthenticatedUser);

router.get(
    "/me",
    userController.getCurrentUser
);
router.patch(
    "/me",
    validateRequest(updateUserSchema),
    userController.updateUser
);
router.patch(
    "/me/password",
    validateRequest(changePasswordSchema),
    userController.changePassword
);

router.get(
    "/",
    authorizeAdmin,
    validateRequest(listUsersQuerySchema,
        "query"), userController.getAllUsersByAdmin
);
router.patch(
    "/:id/role",
    authorizeAdmin,
    validateRequest(updateUserByAdminSchema),
    userController.updateUserByAdmin
);
router.delete(
    "/:id",
    authorizeAdmin,
    userController.deleteUser
);
router.get(
    "/:id",
    authorizeAdmin,
    userController.getUser
);
router.patch(
    "/:id",
    userController.authorizeOwnProfile,
    validateRequest(updateUserSchema),
    userController.updateUser,
);

module.exports = router;