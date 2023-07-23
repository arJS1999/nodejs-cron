const mongoose = require("mongoose");
require('dotenv').config();

async function connectToDatabase() {
  try {
    const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/authtask";
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

module.exports = {
  connectToDatabase,
};
