// src/app/api/admin/users/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// ===== GET: دریافت لیست کاربران (فقط برای ادمین) =====
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.isAdmin) {
      return NextResponse.json(
        { success: false, message: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    await connectDB();
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("خطا در دریافت کاربران:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت کاربران",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// ===== POST: افزودن کاربر جدید (فقط ادمین) =====
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.isAdmin) {
      return NextResponse.json(
        { success: false, message: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    await connectDB();
    const body = await request.json();
    const { name, email, password, phone, isAdmin = false } = body;

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
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone: phone || "",
      isAdmin,
      isActive: true,
    });

    const userResponse = newUser.toObject();
    delete userResponse.password;

    return NextResponse.json({
      success: true,
      data: userResponse,
      message: "کاربر با موفقیت اضافه شد",
    });
  } catch (error) {
    console.error("خطا در افزودن کاربر:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در افزودن کاربر",
        error: error.message,
      },
      { status: 500 }
    );
  }
}