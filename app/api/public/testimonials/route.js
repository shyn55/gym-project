// src/app/api/public/testimonials/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Testimonial from "@/models/Testimonial";

// ===== GET: دریافت نظرات تایید شده (عمومی) =====
export async function GET() {
  try {
    await connectDB();
    const testimonials = await Testimonial.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    return NextResponse.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت نظرات",
        error: error.message,
      },
      { status: 500 }
    );
  }
}