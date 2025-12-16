// db.js
const mongoose = require("mongoose");
require("dotenv").config();

module.exports.connectToMongoDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.URL_MONGO);

    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error(" Error connecting to MongoDB:", err);
  }
};
