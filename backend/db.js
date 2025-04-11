const mongoose = require("mongoose");
require("dotenv").config(); // Ensure env vars load

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;
 
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
};

module.exports = connectDB;
