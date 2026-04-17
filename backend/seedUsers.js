import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

// Simple user schema for seeding
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  status: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, default: null },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, default: null }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Demo users data
    const demoUsers = [
      {
        name: "Admin User",
        email: "admin@example.com",
        password: "admin123",
        role: "admin",
        status: "active"
      },
      {
        name: "Manager User",
        email: "manager@example.com",
        password: "manager123",
        role: "manager",
        status: "active"
      },
      {
        name: "Regular User",
        email: "user@example.com",
        password: "user123",
        role: "user",
        status: "active"
      },
      {
        name: "John Doe",
        email: "john@example.com",
        password: "john123",
        role: "user",
        status: "active"
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "jane123",
        role: "user",
        status: "inactive"
      }
    ];

    // Delete existing demo users
    for (const user of demoUsers) {
      await User.deleteOne({ email: user.email });
      console.log(`🗑️ Removed existing: ${user.email}`);
    }

    // Hash passwords and create users
    for (const user of demoUsers) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      
      await User.create({
        ...user,
        password: hashedPassword
      });
      console.log(`✅ Created: ${user.email} (${user.role})`);
    }

    console.log("\n🎉 Demo users created successfully!");
    console.log("\n📋 Login Credentials:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("👑 Admin:    admin@example.com / admin123");
    console.log("📊 Manager:  manager@example.com / manager123");
    console.log("👤 User:     user@example.com / user123");
    console.log("👤 John:     john@example.com / john123");
    console.log("⚠️ Jane:     jane@example.com / jane123 (inactive)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    await mongoose.disconnect();
    process.exit();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

seedUsers();