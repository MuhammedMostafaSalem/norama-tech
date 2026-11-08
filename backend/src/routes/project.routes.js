const express = require("express");
const projectController = require("../controllers/project.controller");
const { authorizeRoles, isAuthenticatedUser } = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const validateRequest = require("../middlewares/validateRequest");
const deleteFile = require("../utils/deleteFile");
const {
    adminProjectQuerySchema,
    createProjectSchema,
    projectQuerySchema,
    updateProjectSchema,
} = require("../schemas/project.schema");

const router = express.Router();
const authorizeAdmin = authorizeRoles("admin");

function validateUploadedBody(schema) {
    const validate = validateRequest(schema);

    return function (req, res, next) {
        validate(req, res, (error) => {
            if (!error) {
                return next();
            }

            const files = Object.values(req.files || {}).flat();
            Promise.allSettled(
                files.map((file) => deleteFile(`/uploads/${file.filename}`)),
            ).finally(() => next(error));
        });
    };
}

router.get(
    "/",
    validateRequest(projectQuerySchema, "query"),
    projectController.getProjects,
);
router.get(
    "/admin",
    isAuthenticatedUser,
    authorizeAdmin,
    validateRequest(adminProjectQuerySchema, "query"),
    projectController.getAllProjectsByAdmin,
);
router.get(
    "/admin/:id",
    isAuthenticatedUser,
    authorizeAdmin,
    projectController.getProjectByAdmin,
);
router.post(
    "/",
    isAuthenticatedUser,
    authorizeAdmin,
    upload.projectImages,
    validateUploadedBody(createProjectSchema),
    projectController.createProject,
);
router.patch(
    "/:id",
    isAuthenticatedUser,
    authorizeAdmin,
    upload.projectImages,
    validateUploadedBody(updateProjectSchema),
    projectController.updateProject,
);
router.delete(
    "/:id",
    isAuthenticatedUser,
    authorizeAdmin,
    projectController.deleteProject,
);
router.get(
    "/:id",
    projectController.getProject,
);

module.exports = router;