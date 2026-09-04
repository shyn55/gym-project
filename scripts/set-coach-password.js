// scripts/set-coach-password.js
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/empiregym";

async function setCoachPassword() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ اتصال به دیتابیس برقرار شد");

    // تعریف مدل Coach
    const CoachSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      hasPanelAccess: Boolean,
    });
    const Coach = mongoose.models.Coach || mongoose.model("Coach", CoachSchema);

    // ایمیل مربی مورد نظر
    const email = "shayan@gmail.com";
    const plainPassword = "123456";

    // هش کردن رمز
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // به‌روزرسانی مربی
    const result = await Coach.updateOne(
      { email: email },
      { 
        $set: { 
          password: hashedPassword,
          hasPanelAccess: true 
        } 
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`✅ رمز عبور برای ${email} تنظیم شد`);
      console.log(`🔑 رمز عبور: ${plainPassword}`);
    } else if (result.matchedCount > 0) {
      console.log(`⚠️ مربی پیدا شد اما رمز قبلاً تنظیم شده بود`);
    } else {
      console.log(`❌ مربی با ایمیل ${email} پیدا نشد`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ خطا:", error);
    process.exit(1);
  }
}

setCoachPassword();