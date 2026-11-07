require("dotenv").config();

module.exports = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.FRONTEND_URL || "http://localhost:3000",
};
