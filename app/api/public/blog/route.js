// src/app/api/public/blog/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Article from "@/models/Article";

// ===== GET: دریافت لیست مقالات منتشر شده =====
export async function GET() {
  try {
    await connectDB();
    const articles = await Article.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    return NextResponse.json({
      success: true,
      data: articles,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت مقالات",
        error: error.message,
      },
      { status: 500 }
    );
  }
}