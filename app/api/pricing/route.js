// src/app/api/pricing/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Pricing from "@/models/Pricing";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// ===== GET: دریافت لیست قیمت‌ها =====
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    await connectDB();
    const pricing = await Pricing.find({})
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

// ===== POST: افزودن پلن جدید =====
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await request.json();

    if (!body.title || !body.price) {
      return NextResponse.json(
        {
          success: false,
          message: "عنوان و قیمت پلن الزامی است",
        },
        { status: 400 }
      );
    }

    const newPricing = await Pricing.create(body);

    return NextResponse.json(
      {
        success: true,
        data: newPricing,
        message: "پلن با موفقیت اضافه شد",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "خطا در افزودن پلن",
        error: error.message,
      },
      { status: 500 }
    );
  }
}