// src/app/api/public/pricing/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Pricing from "@/models/Pricing";

// ===== GET: دریافت لیست قیمت‌ها (عمومی) =====
export async function GET() {
  try {
    await connectDB();
    const pricing = await Pricing.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: pricing,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت قیمت‌ها",
        error: error.message,
      },
      { status: 500 }
    );
  }
}