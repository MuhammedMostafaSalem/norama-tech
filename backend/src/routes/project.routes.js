// Module: Mounts public project reads and protected admin upload and CRUD endpoints.
const express = require("express");
const projectController = require("../controllers/project.controller");
const { authorizeRoles, isAuthenticatedUser } = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const validateRequest = require("../middlewares/validateRequest");
const deleteFile = require("../utils/deleteFile");
const verifyImageSignature = require("../utils/verifyImageSignature");
const ApiError = require("../utils/ApiError");
const { StatusCodes } = require("http-status-codes");
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

    return async function (req, res, next) {
        const files = Object.values(req.files || {}).flat();
        const cleanupFiles = () => Promise.allSettled(
            files.map((file) => deleteFile(`/uploads/${file.filename}`)),
        );

        // Check the file signature in addition to the client-supplied MIME type.
        try {
            for (const file of files) {
                if (!(await verifyImageSignature(file))) {
                    throw new ApiError("Uploaded file content does not match its type.", StatusCodes.BAD_REQUEST);
                }
            }
        } catch (error) {
            await cleanupFiles();
            return next(error);
        }

        validate(req, res, (error) => {
            if (!error) {
                return next();
            }

            cleanupFiles().finally(() => next(error));
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
