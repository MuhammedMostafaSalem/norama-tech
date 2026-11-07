const express = require("express");
const categoryController = require("../controllers/category.controller");
const { authorizeRoles, isAuthenticatedUser } = require("../middlewares/auth");
const validateRequest = require("../middlewares/validateRequest");
const {
    createCategorySchema,
    listCategoriesQuerySchema,
    updateCategorySchema,
} = require("../schemas/category.schema");

const router = express.Router();
const authorizeAdmin = authorizeRoles("admin");

router.get(
    "/",
    validateRequest(listCategoriesQuerySchema, "query"),
    categoryController.getCategories,
);
router.get("/:id", categoryController.getCategory);

router.use(isAuthenticatedUser, authorizeAdmin);

router.post(
    "/",
    validateRequest(createCategorySchema),
    categoryController.createCategory,
);
router.patch(
    "/:id",
    validateRequest(updateCategorySchema),
    categoryController.updateCategory,
);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;