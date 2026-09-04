// app/api/coach/profile/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Coach from "@/models/Coach"; // یا models/coaches.js
import jwt from "jsonwebtoken";

// ===== GET: دریافت اطلاعات مربی با توکن =====
export async function GET(request) {
  try {
    // دریافت توکن از هدر Authorization
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "توکن معتبر نیست" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // بررسی و دیکود کردن توکن
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "توکن منقضی یا نامعتبر است" },
        { status: 401 }
      );
    }

    // اتصال به دیتابیس
    await connectDB();

    // پیدا کردن مربی با ID
    const coach = await Coach.findById(decoded.id)
      .select("-password") // رمز عبور را بر نمی‌گرداند
      .lean();

    if (!coach) {
      return NextResponse.json(
        { success: false, message: "مربی یافت نشد" },
        { status: 404 }
      );
    }

    // بررسی دسترسی به پنل
    if (!coach.hasPanelAccess) {
      return NextResponse.json(
        { success: false, message: "شما دسترسی به این بخش را ندارید" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: coach,
    });
  } catch (error) {
    console.error("❌ خطا در دریافت اطلاعات مربی:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت اطلاعات مربی",
        error: error.message,
      },
      { status: 500 }
    );
  }
}