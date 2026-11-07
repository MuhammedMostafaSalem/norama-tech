const express = require("express");
const { StatusCodes } = require("http-status-codes");

const router = express.Router();

router.get("/health", (req, res) => {
    res.status(StatusCodes.OK).json({ status: "ok" });
});

module.exports = router;