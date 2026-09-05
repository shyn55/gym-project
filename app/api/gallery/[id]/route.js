// src/app/api/gallery/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Gallery from "@/models/Gallery";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// ===== GET: دریافت یک تصویر =====
export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;
    const image = await Gallery.findById(id).lean();

    if (!image) {
      return NextResponse.json(
        { success: false, message: "تصویر یافت نشد" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: image });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "خطا در دریافت تصویر" },
      { status: 500 },
    );
  }
}

// ===== PUT: ویرایش تصویر =====
export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const updatedImage = await Gallery.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true },
    );

    if (!updatedImage) {
      return NextResponse.json(
        { success: false, message: "تصویر یافت نشد" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedImage,
      message: "تصویر با موفقیت ویرایش شد",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "خطا در ویرایش تصویر" },
      { status: 500 },
    );
  }
}

// ===== DELETE: حذف تصویر =====
export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;

    const deletedImage = await Gallery.findByIdAndDelete(id);

    if (!deletedImage) {
      return NextResponse.json(
        { success: false, message: "تصویر یافت نشد" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "تصویر با موفقیت حذف شد",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "خطا در حذف تصویر" },
      { status: 500 },
    );
  }
}
