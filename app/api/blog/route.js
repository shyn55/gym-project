// src/app/api/blog/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Article from "@/models/Article";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// ===== GET: دریافت لیست مقالات =====
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    await connectDB();
    const articles = await Article.find({})
      .sort({ createdAt: -1 })
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

// ===== POST: افزودن مقاله جدید =====
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await request.json();

    if (!body.title || !body.content || !body.slug) {
      return NextResponse.json(
        {
          success: false,
          message: "عنوان، محتوا و اسلاگ الزامی است",
        },
        { status: 400 }
      );
    }

    const newArticle = await Article.create(body);

    return NextResponse.json(
      {
        success: true,
        data: newArticle,
        message: "مقاله با موفقیت اضافه شد",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "خطا در افزودن مقاله",
        error: error.message,
      },
      { status: 500 }
    );
  }
}