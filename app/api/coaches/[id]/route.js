// src/app/api/coaches/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Coach from "@/models/Coach";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// ===== GET: دریافت یک مربی =====
export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }
  try {
    await connectDB();
    const { id } = await params;

    const coach = await Coach.findById(id).lean();

    if (!coach) {
      return NextResponse.json(
        {
          success: false,
          message: "مربی یافت نشد",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: coach,
    });
  } catch (error) {
    console.error("خطا در دریافت مربی:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت مربی",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

// ===== PUT: ویرایش مربی =====
export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const updatedCoach = await Coach.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true },
    );

    if (!updatedCoach) {
      return NextResponse.json(
        {
          success: false,
          message: "مربی یافت نشد",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedCoach,
      message: "مربی با موفقیت ویرایش شد",
    });
  } catch (error) {
    console.error("خطا در ویرایش مربی:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در ویرایش مربی",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

// ===== DELETE: حذف مربی =====
export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }
  try {
    await connectDB();
    const { id } = await params;

    const deletedCoach = await Coach.findByIdAndDelete(id);

    if (!deletedCoach) {
      return NextResponse.json(
        {
          success: false,
          message: "مربی یافت نشد",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "مربی با موفقیت حذف شد",
    });
  } catch (error) {
    console.error("خطا در حذف مربی:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در حذف مربی",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
