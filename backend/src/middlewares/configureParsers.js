// Module: Parses bounded JSON and form bodies and reads request cookies.
const express = require("express");
const cookieParser = require("cookie-parser");

function configureParsers(app) {
    app.use(express.json({ limit: "1mb", strict: true }));
    app.use(express.urlencoded({
        extended: false,
        limit: "1mb",
        parameterLimit: 100,
    }));
    app.use(cookieParser());
}

module.exports = configureParsers;
