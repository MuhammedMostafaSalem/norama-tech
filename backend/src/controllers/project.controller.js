// Module: Handles project reads and admin CRUD, including uploaded image lifecycle.
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const Project = require("../models/project.model");
const Category = require("../models/category.model");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../middlewares/catchAsync");
const deleteFile = require("../utils/deleteFile");
const {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
} = require("../utils/crudFactory");

const projectFields = [
    "name",
    "slug",
    "category",
    "type",
    "image",
    "imageAlt",
    "gallery",
    "summary",
    "overview",
    "challenge",
    "approach",
    "features",
    "technologies",
    "status",
].join(" ");

const categorySummary = { path: "category", select: "name slug isActive" };

function uploadPath(file) {
    return `/uploads/${file.filename}`;
}

function uploadedFiles(files = {}) {
    return Object.values(files).flat();
}

// Remove newly uploaded files when validation or database persistence fails.
async function cleanupUploadedFiles(files) {
    await Promise.allSettled(uploadedFiles(files).map((file) => deleteFile(uploadPath(file))));
}

// Projects can only reference categories that are currently available to visitors.
async function requireActiveCategory(categoryId) {
    const category = await Category.findOne({ _id: categoryId, isActive: true }).select("_id");

    if (!category) {
        throw new ApiError("An active category is required.", StatusCodes.BAD_REQUEST);
    }
}

// Validate the category and attach uploaded file paths before creating the record.
exports.createProject = createOne(Project, {
    modelName: "project",
    beforeCreate: async ({ req, data }) => {
        const image = req.files?.image?.[0];

        if (!image) {
            throw new ApiError("A project cover image is required.", StatusCodes.BAD_REQUEST);
        }

        await requireActiveCategory(data.category);
        data.image = uploadPath(image);
        data.gallery = (req.files?.gallery || []).map(uploadPath);
    },
    onError: ({ req }) => cleanupUploadedFiles(req.files),
});

exports.getProjects = getAll(Project, {
    modelName: "projects",
    searchFields: ["name", "slug", "type", "summary", "overview", "features", "technologies"],
    defaultLimit: 12,
    defaultSort: "-createdAt",
    filterFactory: () => ({ status: "published" }),
    select: projectFields,
    populate: categorySummary,
});

exports.getAllProjectsByAdmin = getAll(Project, {
    modelName: "projects",
    searchFields: ["name", "slug", "type", "summary", "overview", "features", "technologies"],
    defaultLimit: 12,
    defaultSort: "-createdAt",
    select: projectFields,
    populate: categorySummary,
});

// Public detail reads accept an ID or slug and hide drafts and inactive categories.
exports.getProject = catchAsync(async (req, res) => {
    const identifier = req.params.id;
    const filter = mongoose.isValidObjectId(identifier)
        ? { _id: identifier, status: "published" }
        : { slug: identifier, status: "published" };
    const project = await Project.findOne(filter).select(projectFields).populate({
        ...categorySummary,
        match: { isActive: true },
    });

    if (!project || !project.category) {
        throw new ApiError("Project not found.", StatusCodes.NOT_FOUND);
    }

    return res.status(StatusCodes.OK).json({ success: true, data: { project } });
});

exports.getProjectByAdmin = getOne(Project, {
    modelName: "project",
    select: projectFields,
    populate: categorySummary,
});

// Replace uploaded images only after a successful update, then remove superseded files.
exports.updateProject = updateOne(Project, {
    modelName: "project",
    allowedFields: projectFields.split(" ").concat("clearGallery"),
    beforeUpdate: async ({ req, document, data }) => {
        const image = req.files?.image?.[0];
        const gallery = req.files?.gallery || [];

        if (data.category) {
            await requireActiveCategory(data.category);
        }

        if (Object.keys(data).length === 0 && !image && gallery.length === 0) {
            throw new ApiError("Provide project fields or image files to update.", StatusCodes.BAD_REQUEST);
        }

        req.projectFilesToDelete = [];

        if (image) {
            req.projectFilesToDelete.push(document.image);
            data.image = uploadPath(image);
        }

        if (gallery.length > 0) {
            req.projectFilesToDelete.push(...(document.gallery || []));
            data.gallery = gallery.map(uploadPath);
        } else if (data.clearGallery === true) {
            req.projectFilesToDelete.push(...(document.gallery || []));
            data.gallery = [];
        }

        delete data.clearGallery;
    },
    afterUpdate: async ({ req }) => {
        await Promise.allSettled((req.projectFilesToDelete || []).map(deleteFile));
    },
    onError: ({ req }) => cleanupUploadedFiles(req.files),
});

// Delete the project record and its local cover and gallery files.
exports.deleteProject = deleteOne(Project, {
    modelName: "project",
    afterDelete: async ({ document }) => {
        await Promise.allSettled([
            deleteFile(document.image),
            ...(document.gallery || []).map(deleteFile),
        ]);
    },
});
