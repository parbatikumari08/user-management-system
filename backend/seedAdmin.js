import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/user.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const adminExists = await User.findOne({ email: "admin@example.com" });
    
    if (adminExists) {
      console.log("⚠️ Admin already exists!");
      console.log("📧 Email: admin@example.com");
      console.log("🔑 Password: admin123");
      process.exit();
    }

    // Create admin user (password will be auto-hashed by your model)
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123", 
      role: "admin",
      status: "active",
      createdBy: null,
      updatedBy: null
    });

    console.log("✅ Admin created successfully!");
    console.log("📧 Email: admin@example.com");
    console.log("🔑 Password: admin123");
    console.log("🆔 User ID:", admin._id);
    
    process.exit();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

seedAdmin();