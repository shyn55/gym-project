// src/app/api/gallery/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Gallery from "@/models/Gallery";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// ===== GET: دریافت لیست تصاویر =====
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    await connectDB();
    const images = await Gallery.find({})
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: images,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت تصاویر",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// ===== POST: افزودن تصویر جدید =====
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await request.json();

    if (!body.title || !body.image) {
      return NextResponse.json(
        {
          success: false,
          message: "عنوان و آدرس تصویر الزامی است",
        },
        { status: 400 }
      );
    }

    const newImage = await Gallery.create(body);

    return NextResponse.json(
      {
        success: true,
        data: newImage,
        message: "تصویر با موفقیت اضافه شد",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "خطا در افزودن تصویر",
        error: error.message,
      },
      { status: 500 }
    );
  }
}