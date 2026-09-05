// app/api/workout/request/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import WorkoutRequest from "@/models/WorkoutRequest";
import WorkoutProgram from "@/models/WorkoutProgram";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// ===== GET: دریافت یک درخواست با شناسه =====
export async function GET(request, { params }) {
  try {
    console.log("🔍 1. شروع دریافت درخواست");

    const session = await getServerSession(authOptions);
    console.log("🔍 2. سشن:", session?.user?.email || "خالی");

    if (!session) {
      return NextResponse.json(
        { success: false, message: "لطفاً وارد شوید" },
        { status: 401 },
      );
    }

    console.log("🔍 3. اتصال به دیتابیس...");
    await connectDB();
    console.log("🔍 4. اتصال برقرار شد");

    const { id } = await params;
    console.log("🔍 5. شناسه درخواست:", id);

    // ===== دریافت درخواست با populate =====
    console.log("🔍 6. جستجوی درخواست...");
    const workoutRequest = await WorkoutRequest.findById(id)
      .populate("user", "name email phone")
      .populate("coach", "name specialty email")
      .lean();

    console.log("🔍 7. نتیجه جستجو:", workoutRequest ? "پیدا شد" : "پیدا نشد");

    if (!workoutRequest) {
      return NextResponse.json(
        { success: false, message: "درخواست یافت نشد" },
        { status: 404 },
      );
    }

    // ===== دریافت برنامه =====
    let program = null;
    if (workoutRequest.program) {
      try {
        console.log("🔍 8. جستجوی برنامه...");
        program = await WorkoutProgram.findById(workoutRequest.program)
          .populate("coach", "name specialty")
          .lean();
        console.log("🔍 9. برنامه:", program ? "پیدا شد" : "پیدا نشد");
      } catch (err) {
        console.log("⚠️ خطا در دریافت برنامه:", err.message);
      }
    }

    // ===== ترکیب داده‌ها =====
    const result = {
      ...workoutRequest,
      program: program || null,
    };

    // ===== بررسی دسترسی =====
    const isUser = workoutRequest.user?._id?.toString() === session.user.id;
    const isAdmin = session.user.isAdmin === true;
    const isCoach = session.user.role === "coach";

    console.log(
      "🔍 10. دسترسی: کاربر:",
      isUser,
      "مربی:",
      isCoach,
      "ادمین:",
      isAdmin,
    );

    // مربی‌ها، ادمین‌ها و خود کاربر می‌توانند ببینند
    if (!isUser && !isCoach && !isAdmin) {
      return NextResponse.json(
        { success: false, message: "شما دسترسی به این درخواست را ندارید" },
        { status: 403 },
      );
    }

    console.log("✅ 11. درخواست با موفقیت دریافت شد");
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("❌ خطا در دریافت درخواست:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت درخواست",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

// ===== PUT: به‌روزرسانی درخواست =====
export async function PUT(request, { params }) {
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
    const body = await request.json();

    const workoutRequest = await WorkoutRequest.findById(id);
    if (!workoutRequest) {
      return NextResponse.json(
        { success: false, message: "درخواست یافت نشد" },
        { status: 404 },
      );
    }

    const isCoach = session.user.role === "coach";
    const isAdmin = session.user.isAdmin === true;

    if (!isCoach && !isAdmin) {
      return NextResponse.json(
        { success: false, message: "شما دسترسی به این درخواست را ندارید" },
        { status: 403 },
      );
    }

    const updated = await WorkoutRequest.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true },
    )
      .populate("user", "name email")
      .populate("coach", "name specialty");

    return NextResponse.json({
      success: true,
      data: updated,
      message: "درخواست با موفقیت به‌روزرسانی شد",
    });
  } catch (error) {
    console.error("❌ خطا در به‌روزرسانی درخواست:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در به‌روزرسانی درخواست",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

// ===== DELETE: حذف درخواست =====
export async function DELETE(request, { params }) {
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

    const workoutRequest = await WorkoutRequest.findById(id);
    if (!workoutRequest) {
      return NextResponse.json(
        { success: false, message: "درخواست یافت نشد" },
        { status: 404 },
      );
    }

    if (!session.user.isAdmin) {
      return NextResponse.json(
        { success: false, message: "شما دسترسی حذف این درخواست را ندارید" },
        { status: 403 },
      );
    }

    await WorkoutRequest.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "درخواست با موفقیت حذف شد",
    });
  } catch (error) {
    console.error("❌ خطا در حذف درخواست:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در حذف درخواست",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
