// src/scripts/seed-admin.js
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const path = require("path");

// بارگذاری محیطی
require("dotenv").config({ path: path.resolve(__dirname, "../../.env.local") });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/empiregym";
async function seedSuperAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ اتصال به دیتابیس برقرار شد");

    // مدل User رو تعریف کن (چون در اسکریپت standalone هست)
    const UserSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      phone: String,
      isAdmin: Boolean,
      isActive: Boolean,
    });
    const User = mongoose.models.User || mongoose.model("User", UserSchema);

    const existingAdmin = await User.findOne({ isAdmin: true });
    if (existingAdmin) {
      console.log("✅ سوپرادمین قبلاً وجود دارد.");
      console.log(`📧 ایمیل: ${existingAdmin.email}`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("SuperAdmin@123", 10);

    const admin = await User.create({
      name: "مدیر ارشد",
      email: "admin@empiregym.ir",
      password: hashedPassword,
      phone: "۰۹۱۲۳۴۵۶۷۸۹",
      isAdmin: true,
      isActive: true,
    });

    console.log("✅ سوپرادمین با موفقیت ساخته شد!");
    console.log(`📧 ایمیل: ${admin.email}`);
    console.log(`🔑 رمز عبور: SuperAdmin@123`);
    console.log(`🆔 ID: ${admin._id}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ خطا در ساخت سوپرادمین:", error);
    process.exit(1);
  }
}

seedSuperAdmin();