const express = require("express");
const configureSecurity = require("./src/middlewares/configureSecurity");
const configureParsers = require("./src/middlewares/configureParsers");
const configureStaticFiles = require("./src/middlewares/configureStaticFiles");
const configureLogger = require("./src/middlewares/configureLogger");
const routes = require("./src/routes");
const errorMiddleware = require("./src/middlewares/errorMiddleware");
const notFound = require("./src/middlewares/notFound");

const app = express();

configureSecurity(app);

configureParsers(app);

configureStaticFiles(app);

configureLogger(app);

app.use("/api", routes);

app.use(notFound);

app.use(errorMiddleware);

module.exports = app;
