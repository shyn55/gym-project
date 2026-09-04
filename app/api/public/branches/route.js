// src/app/api/public/branches/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Branch from "@/models/Branch";

// ===== GET: دریافت لیست شعبه‌های فعال =====
export async function GET() {
  try {
    await connectDB();
    const branches = await Branch.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: branches,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت شعبه‌ها",
        error: error.message,
      },
      { status: 500 }
    );
  }
}