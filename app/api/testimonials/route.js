// src/app/api/testimonials/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Testimonial from "@/models/Testimonial";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// ===== GET: دریافت لیست نظرات =====
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    await connectDB();
    const testimonials = await Testimonial.find({})
      .sort({ createdAt: -1 })
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
      { status: 500 },
    );
  }
}

// ===== POST: افزودن نظر جدید =====
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await request.json();

    if (!body.name || !body.comment) {
      return NextResponse.json(
        {
          success: false,
          message: "نام و نظر کاربر الزامی است",
        },
        { status: 400 },
      );
    }

    const newTestimonial = await Testimonial.create(body);

    return NextResponse.json(
      {
        success: true,
        data: newTestimonial,
        message: "نظر با موفقیت اضافه شد",
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "خطا در افزودن نظر",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
