// src/app/api/settings/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Settings from "@/models/Settings";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// ===== GET: دریافت تنظیمات =====
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    await connectDB();
    let settings = await Settings.findOne();

    // اگر تنظیماتی وجود نداشت، یک نمونه پیش‌فرض بساز
    if (!settings) {
      settings = await Settings.create({});
    }

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت تنظیمات",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// ===== PUT: ویرایش تنظیمات =====
export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await request.json();

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create(body);
    } else {
      settings = await Settings.findByIdAndUpdate(
        settings._id,
        { $set: body },
        { new: true, runValidators: true }
      );
    }

    return NextResponse.json({
      success: true,
      data: settings,
      message: "تنظیمات با موفقیت ذخیره شد",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "خطا در ذخیره تنظیمات",
        error: error.message,
      },
      { status: 500 }
    );
  }
}