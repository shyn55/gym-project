// app/api/exercises/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Exercise from "@/models/Exercise";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// ===== GET: دریافت یک حرکت =====
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "لطفاً وارد شوید" },
        { status: 401 },
      );
    }

    await connectDB();
    const { id } = await params;

    const exercise = await Exercise.findById(id).lean();

    if (!exercise) {
      return NextResponse.json(
        { success: false, message: "حرکت یافت نشد" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: exercise,
    });
  } catch (error) {
    console.error("❌ خطا در دریافت حرکت:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت حرکت",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

// ===== PUT: ویرایش حرکت =====
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "coach") {
      return NextResponse.json(
        { success: false, message: "دسترسی غیرمجاز" },
        { status: 403 },
      );
    }

    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const exercise = await Exercise.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!exercise) {
      return NextResponse.json(
        { success: false, message: "حرکت یافت نشد" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: exercise,
      message: "حرکت با موفقیت ویرایش شد",
    });
  } catch (error) {
    console.error("❌ خطا در ویرایش حرکت:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در ویرایش حرکت",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

// ===== DELETE: حذف حرکت =====
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "coach") {
      return NextResponse.json(
        { success: false, message: "دسترسی غیرمجاز" },
        { status: 403 },
      );
    }

    await connectDB();
    const { id } = await params;

    const exercise = await Exercise.findByIdAndDelete(id);

    if (!exercise) {
      return NextResponse.json(
        { success: false, message: "حرکت یافت نشد" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "حرکت با موفقیت حذف شد",
    });
  } catch (error) {
    console.error("❌ خطا در حذف حرکت:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در حذف حرکت",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
