// src/app/api/branches/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Branch from "@/models/Branch";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// ===== GET: دریافت لیست شعبه‌ها =====
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    await connectDB();
    const branches = await Branch.find({})
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: branches,
    });
  } catch (error) {
    console.error("خطا در دریافت شعبه‌ها:", error);
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

// ===== POST: افزودن شعبه جدید =====
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await request.json();

    if (!body.name || !body.address || !body.phone) {
      return NextResponse.json(
        {
          success: false,
          message: "نام، آدرس و شماره تماس شعبه الزامی است",
        },
        { status: 400 }
      );
    }

    const newBranch = await Branch.create(body);

    return NextResponse.json(
      {
        success: true,
        data: newBranch,
        message: "شعبه با موفقیت اضافه شد",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("خطا در افزودن شعبه:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در افزودن شعبه",
        error: error.message,
      },
      { status: 500 }
    );
  }
}