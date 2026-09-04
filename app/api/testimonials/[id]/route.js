// src/app/api/testimonials/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Testimonial from "@/models/Testimonial";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// ===== GET: دریافت یک نظر =====
export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;
    const testimonial = await Testimonial.findById(id).lean();

    if (!testimonial) {
      return NextResponse.json(
        { success: false, message: "نظر یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: testimonial });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "خطا در دریافت نظر" },
      { status: 500 }
    );
  }
}

// ===== PUT: ویرایش نظر =====
export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedTestimonial) {
      return NextResponse.json(
        { success: false, message: "نظر یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedTestimonial,
      message: "نظر با موفقیت ویرایش شد",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "خطا در ویرایش نظر" },
      { status: 500 }
    );
  }
}

// ===== DELETE: حذف نظر =====
export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;

    const deletedTestimonial = await Testimonial.findByIdAndDelete(id);

    if (!deletedTestimonial) {
      return NextResponse.json(
        { success: false, message: "نظر یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "نظر با موفقیت حذف شد",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "خطا در حذف نظر" },
      { status: 500 }
    );
  }
}