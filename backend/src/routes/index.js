// Module: Mounts all API resource routers under the main API router.
const express = require("express");
const { StatusCodes } = require("http-status-codes");

const authRoutes = require("./auth.routes");
const categoryRoutes = require("./category.routes");
const messageRoutes = require("./message.routes");
const projectRoutes = require("./project.routes");
const reviewRoutes = require("./review.routes");
const settingsRoutes = require("./settings.routes");
const userRoutes = require("./user.routes");
const websiteContentRoutes = require("./websiteContent.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/messages", messageRoutes);
router.use("/projects", projectRoutes);
router.use("/reviews", reviewRoutes);
router.use("/settings", settingsRoutes);
router.use("/users", userRoutes);
router.use("/content", websiteContentRoutes);

router.get("/health", (req, res) => {
    res.status(StatusCodes.OK).json({ status: "ok" });
});

module.exports = router;