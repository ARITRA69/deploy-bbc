import mongoose from "mongoose";

/**
 * MongoDB database connection using Mongoose
 * Docs: https://mongoosejs.com/docs/connections.html
 */

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is required");
}

/**
 * Connect to MongoDB
 */
export async function connect_mongodb(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10, // Maximum number of connections in the pool
      minPoolSize: 2, // Minimum number of connections
      serverSelectionTimeoutMS: 5000, // Timeout for initial connection
      socketTimeoutMS: 45000, // Socket timeout
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
}

/**
 * Disconnect from MongoDB
 * Call this when shutting down the application
 */
export async function disconnect_mongodb(): Promise<void> {
  await mongoose.disconnect();
  console.log("MongoDB connection closed");
}

/**
 * Test database connection
 */
export async function test_connection(): Promise<boolean> {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connect_mongodb();
    }
    return true;
  } catch (error) {
    console.error("❌ MongoDB connection test failed:", error);
    return false;
  }
}

// Connection event listeners
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from MongoDB");
});

// Export mongoose instance for model creation
export { mongoose };
