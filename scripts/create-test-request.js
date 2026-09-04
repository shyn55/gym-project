// scripts/create-test-request.js
const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/empiregym";

async function createTestRequest() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ اتصال به دیتابیس برقرار شد");

    // تعریف مدل‌ها
    const UserSchema = new mongoose.Schema({
      name: String,
      email: String,
    });
    const User = mongoose.models.User || mongoose.model("User", UserSchema);

    const WorkoutRequestSchema = new mongoose.Schema({
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      fullName: String,
      age: Number,
      gender: String,
      height: Number,
      weight: Number,
      goal: String,
      status: { type: String, default: "pending" },
    });
    const WorkoutRequest = mongoose.models.WorkoutRequest || 
      mongoose.model("WorkoutRequest", WorkoutRequestSchema);

    // پیدا کردن یک کاربر
    const user = await User.findOne({});
    if (!user) {
      console.log("❌ هیچ کاربری در دیتابیس پیدا نشد");
      console.log("💡 لطفاً ابتدا یک کاربر ثبت‌نام کنید");
      process.exit(0);
    }

    console.log(`👤 کاربر پیدا شد: ${user.name} (${user.email})`);

    // ایجاد درخواست تست
    const testRequest = await WorkoutRequest.create({
      user: user._id,
      fullName: user.name || "کاربر تست",
      age: 25,
      gender: "مرد",
      height: 175,
      weight: 70,
      goal: "تناسب اندام",
      status: "pending",
    });

    console.log("✅ درخواست تست ایجاد شد:");
    console.log(`🆔 شناسه: ${testRequest._id}`);
    console.log(`👤 کاربر: ${testRequest.fullName}`);
    console.log(`📋 وضعیت: ${testRequest.status}`);
    console.log("\n🔗 لینک مشاهده:");
    console.log(`http://localhost:3000/coach-dashboard/requests/${testRequest._id}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ خطا:", error);
    process.exit(1);
  }
}

createTestRequest();