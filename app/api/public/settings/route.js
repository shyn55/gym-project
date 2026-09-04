// src/app/api/public/settings/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Settings from "@/models/Settings";

// ===== GET: دریافت تنظیمات عمومی =====
export async function GET() {
  try {
    await connectDB();
    let settings = await Settings.findOne();

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