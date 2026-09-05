// app/api/workout/request/[id]/assign/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import WorkoutRequest from "@/models/WorkoutRequest";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// ===== PUT: اختصاص مربی به درخواست =====
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "coach") {
      return NextResponse.json(
        { success: false, message: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    await connectDB();
    const { id } = await params;
    const { coachId } = await request.json();

    const updated = await WorkoutRequest.findByIdAndUpdate(
      id,
      {
        $set: {
          coach: coachId,
          status: "in_progress",
        },
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "درخواست یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: "مربی با موفقیت اختصاص داده شد",
    });
  } catch (error) {
    console.error("❌ خطا:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در اختصاص مربی",
        error: error.message,
      },
      { status: 500 }
    );
  }
}