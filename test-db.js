// test-db.js
const mongoose = require("mongoose");

async function test() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/empiregym");
    console.log("✅ اتصال به دیتابیس موفق!");
    process.exit(0);
  } catch (error) {
    console.error("❌ خطا در اتصال به دیتابیس:", error.message);
    process.exit(1);
  }
}

test();