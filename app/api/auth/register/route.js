// src/app/api/auth/register/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, password, phone } = body;

    // اعتبارسنجی
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "نام، ایمیل و رمز عبور الزامی است" },
        { status: 400 }
      );
    }

    // بررسی تکراری نبودن ایمیل
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "این ایمیل قبلاً ثبت شده است" },
        { status: 400 }
      );
    }

    // هش کردن رمز عبور
    const hashedPassword = await bcrypt.hash(password, 10);

    // ایجاد کاربر جدید
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone: phone || "",
    });

    // حذف رمز عبور از پاسخ
    const userResponse = user.toObject();
    delete userResponse.password;

    return NextResponse.json({
      success: true,
      data: userResponse,
      message: "ثبت‌نام با موفقیت انجام شد",
    });
  } catch (error) {
    console.error("خطا در ثبت‌نام:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در ثبت‌نام",
        error: error.message,
      },
      { status: 500 }
    );
  }
}