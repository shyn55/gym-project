// src/app/api/public/coaches/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Coach from "@/models/Coach";

// ===== GET: دریافت لیست مربیان (عمومی) =====
export async function GET() {
  try {
    await connectDB();
    const coaches = await Coach.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: coaches,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت مربیان",
        error: error.message,
      },
      { status: 500 }
    );
  }
}