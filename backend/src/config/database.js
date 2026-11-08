// Module: Connects Mongoose to the configured MongoDB database.
const mongoose = require("mongoose");
const mongooseSequence = require("mongoose-sequence");
require("colors");

const autoIncrementPlugin = mongooseSequence(mongoose);

function connectDatabase() {
  return mongoose
    .connect(process.env.DB_URI)
    .then((conn) => {
      console.log(
        `Database Connected : ${conn.connection.host}`.cyan.underline,
      );
      return conn;
    })
    .catch((err) => {
      console.error(`Database Error: ${err}`.red);
      throw err;
    });
}

module.exports = { autoIncrementPlugin, connectDatabase };
