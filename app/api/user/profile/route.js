// src/app/api/user/profile/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// ===== GET: دریافت اطلاعات کاربر =====
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "لطفاً وارد شوید" },
        { status: 401 }
      );
    }

    await connectDB();
    const user = await User.findById(session.user.id)
      .select("-password")
      .lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "کاربر یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("خطا در دریافت اطلاعات کاربر:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت اطلاعات کاربر",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// ===== PUT: به‌روزرسانی اطلاعات کاربر =====
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "لطفاً وارد شوید" },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await request.json();

    // فیلدهای قابل ویرایش
    const allowedFields = ["name", "phone", "gender", "birthDate", "weight", "height"];
    const updateData = {};
    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "کاربر یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
      message: "اطلاعات با موفقیت به‌روزرسانی شد",
    });
  } catch (error) {
    console.error("خطا در به‌روزرسانی اطلاعات کاربر:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در به‌روزرسانی اطلاعات کاربر",
        error: error.message,
      },
      { status: 500 }
    );
  }
}