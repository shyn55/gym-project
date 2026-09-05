// app/api/workout/program/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import WorkoutProgram from "@/models/WorkoutProgram";
import WorkoutRequest from "@/models/WorkoutRequest";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// ===== GET: دریافت یک برنامه با شناسه =====
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

    // پیدا کردن برنامه
    const program = await WorkoutProgram.findById(id)
      .populate("coach", "name specialty")
      .lean();

    if (!program) {
      return NextResponse.json(
        { success: false, message: "برنامه یافت نشد" },
        { status: 404 },
      );
    }

    // ===== بررسی دسترسی =====
    // ۱. آیا کاربر صاحب این برنامه است؟
    const workoutRequest = await WorkoutRequest.findById(
      program.request,
    ).populate("user", "name email");

    if (!workoutRequest) {
      return NextResponse.json(
        { success: false, message: "درخواست مرتبط با برنامه یافت نشد" },
        { status: 404 },
      );
    }

    const isOwner = workoutRequest.user._id.toString() === session.user.id;
    const isCoach = program.coach._id.toString() === session.user.id;
    const isAdmin = session.user.isAdmin === true;

    if (!isOwner && !isCoach && !isAdmin) {
      return NextResponse.json(
        { success: false, message: "شما دسترسی به این برنامه را ندارید" },
        { status: 403 },
      );
    }

    // ===== ترکیب اطلاعات =====
    const result = {
      ...program,
      request: workoutRequest,
    };

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("❌ خطا در دریافت برنامه:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت برنامه",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
