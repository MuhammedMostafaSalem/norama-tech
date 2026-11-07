const { StatusCodes } = require("http-status-codes");
const Category = require("../models/category.model");
const Project = require("../models/project.model");
const ApiError = require("../utils/ApiError");
const { createSlug } = require("../utils/identity");
const {
    createOne,
    deleteOne,
    getAll,
    getOne,
    updateOne,
} = require("../utils/crudFactory");

const categoryFields = "name slug description isActive createdAt updatedAt";
const projectSummary = { path: "projects", select: "name slug status" };

exports.createCategory = createOne(Category, {
    modelName: "category",
});

exports.getCategories = getAll(Category, {
    modelName: "categories",
    searchFields: ["name", "slug", "description"],
    defaultLimit: 10,
    defaultSort: "name",
    select: categoryFields,
    populate: projectSummary,
});

exports.getCategory = getOne(Category, {
    modelName: "category",
    select: categoryFields,
    populate: projectSummary,
});

exports.updateCategory = updateOne(Category, {
    modelName: "category",
    allowedFields: ["name", "description", "isActive"],
    beforeUpdate: ({ document, data }) => {
        if (data.name && data.name !== document.name) {
            document.slug = createSlug(data.name) || `category-${document._id}`;
        }
    },
});

exports.deleteCategory = deleteOne(Category, {
    modelName: "category",
    beforeDelete: async ({ document }) => {
        const hasProjects = await Project.exists({ category: document._id });

        if (hasProjects) {
            throw new ApiError(
                "Cannot delete a category while projects are assigned to it.",
                StatusCodes.CONFLICT,
            );
        }
    },
});