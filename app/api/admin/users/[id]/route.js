// src/app/api/admin/users/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// ===== PUT: به‌روزرسانی کاربر =====
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.isAdmin) {
      return NextResponse.json(
        { success: false, message: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();

    // جلوگیری از تغییر نقش خودش
    if (id === session.user.id) {
      return NextResponse.json(
        { success: false, message: "نمی‌توانید نقش خودتان را تغییر دهید" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "کاربر یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: "کاربر با موفقیت به‌روزرسانی شد",
    });
  } catch (error) {
    console.error("خطا در به‌روزرسانی کاربر:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در به‌روزرسانی کاربر",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// ===== DELETE: حذف کاربر =====
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.isAdmin) {
      return NextResponse.json(
        { success: false, message: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    await connectDB();
    const { id } = await params;

    // جلوگیری از حذف خودش
    if (id === session.user.id) {
      return NextResponse.json(
        { success: false, message: "نمی‌توانید خودتان را حذف کنید" },
        { status: 400 }
      );
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json(
        { success: false, message: "کاربر یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "کاربر با موفقیت حذف شد",
    });
  } catch (error) {
    console.error("خطا در حذف کاربر:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در حذف کاربر",
        error: error.message,
      },
      { status: 500 }
    );
  }
}