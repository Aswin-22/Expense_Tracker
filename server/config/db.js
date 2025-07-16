const mongoose = require("mongoose");

mongoose.set("strictQuery", true);

async function connectDb() {
  return mongoose.connect(process.env.MONGO_URI);
}

module.exports = { connectDb };
