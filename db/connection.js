const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables from .env file

const connectDB = async () => {
  try {
    const dbURI = process.env.DB_URI;

    if (!dbURI) {
      throw new Error("DB_URI environment variable is missing");
    }

    await mongoose.connect(dbURI);

    console.log("Connected to MongoDB");

    // Handling connection retries
    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB connection lost. Reconnecting...");
      setTimeout(() => {
        connectDB();
      }, 5000); // Retry after 5 seconds
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err.message);
      process.exit(1); // Exit the process if the connection fails
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1); // Exit with a failure code
  }
};

module.exports = connectDB;
