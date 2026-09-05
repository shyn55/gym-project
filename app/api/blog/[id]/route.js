// src/app/api/blog/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Article from "@/models/Article";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// ===== GET: دریافت یک مقاله =====
export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;
    const article = await Article.findById(id).lean();

    if (!article) {
      return NextResponse.json(
        { success: false, message: "مقاله یافت نشد" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "خطا در دریافت مقاله" },
      { status: 500 },
    );
  }
}

// ===== PUT: ویرایش مقاله =====
export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true },
    );

    if (!updatedArticle) {
      return NextResponse.json(
        { success: false, message: "مقاله یافت نشد" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedArticle,
      message: "مقاله با موفقیت ویرایش شد",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "خطا در ویرایش مقاله" },
      { status: 500 },
    );
  }
}

// ===== DELETE: حذف مقاله =====
export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;

    const deletedArticle = await Article.findByIdAndDelete(id);

    if (!deletedArticle) {
      return NextResponse.json(
        { success: false, message: "مقاله یافت نشد" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "مقاله با موفقیت حذف شد",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "خطا در حذف مقاله" },
      { status: 500 },
    );
  }
}
