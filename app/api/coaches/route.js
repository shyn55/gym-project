// src/app/api/coaches/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Coach from "@/models/Coach";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import bcrypt from "bcryptjs";
// ===== GET: دریافت لیست مربیان =====
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }
  try {
    await connectDB();
    const coaches = await Coach.find({})
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: coaches,
    });
  } catch (error) {
    console.error("خطا در دریافت مربیان:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت مربیان",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

// ===== POST: افزودن مربی جدید =====
export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await request.json();

    // اگر رمز عبور وارد شده، آن را هش کن
    let hashedPassword = null;
    if (body.password) {
      hashedPassword = await bcrypt.hash(body.password, 10);
    }

    const newCoach = await Coach.create({
      ...body,
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        success: true,
        data: newCoach,
        message: "مربی با موفقیت اضافه شد",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("خطا در افزودن مربی:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در افزودن مربی",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
