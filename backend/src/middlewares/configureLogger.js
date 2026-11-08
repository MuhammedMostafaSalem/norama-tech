// Module: Adds request logging with a production-safe log format.
const morgan = require("morgan");
const env = require("../config/env");

function configureLogger(app) {
    if (env.nodeEnv === "development") {
        app.use(morgan("dev"));
    }
}

module.exports = configureLogger;
