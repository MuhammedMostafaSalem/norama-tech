const express = require("express");
const path = require("path");

function configureStaticFiles(app) {
    app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
}

module.exports = configureStaticFiles;
