const express = require("express");
const cookieParser = require("cookie-parser");

function configureParsers(app) {
    app.use(express.json({ limit: "10kb" }));
    app.use(express.urlencoded({ extended: true, limit: "10kb" }));
    app.use(cookieParser());
}

module.exports = configureParsers;
