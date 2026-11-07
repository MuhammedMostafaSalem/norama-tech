const http = require("http");
require("colors");

const env = require("./src/config/env");
const app = require("./app");
const { connectDatabase: connectDB } = require("./src/config/database");

const server = http.createServer(app);
const PORT = env.port || 5000;

process.on("unhandledRejection", (error) => {
    console.error(`Unhandled Rejection: ${error.message}`.red.bold);

    server.close(() => process.exit(1));
});

process.on("uncaughtException", (error) => {
    console.error(`Uncaught Exception: ${error}`.red.bold);
    process.exit(1);
});

process.on("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down gracefully...".yellow.bold);

    server.close(() => {
        console.log("Server closed.".yellow.bold);
        process.exit(0);
    });
});

connectDB();

server.listen(PORT, () => {
    console.log(`Norama Tech API is running on: http://localhost:${PORT}`.green);
});
