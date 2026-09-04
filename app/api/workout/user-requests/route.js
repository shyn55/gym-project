// app/api/workout/user-requests/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import WorkoutRequest from "@/models/WorkoutRequest";
import WorkoutProgram from "@/models/WorkoutProgram";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// ===== GET: دریافت درخواست‌های کاربر جاری =====
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "لطفاً وارد شوید" },
        { status: 401 },
      );
    }

    await connectDB();

    // دریافت تمام درخواست‌های کاربر
    const requests = await WorkoutRequest.find({ user: session.user.id })
      .populate("coach", "name specialty")
      .sort({ createdAt: -1 })
      .lean();

    // دریافت برنامه برای هر درخواست
    const requestsWithProgram = await Promise.all(
      requests.map(async (req) => {
        let program = null;
        if (req.program) {
          try {
            program = await WorkoutProgram.findById(req.program)
              .populate("coach", "name specialty")
              .lean();
          } catch (err) {
            console.log("⚠️ خطا در دریافت برنامه:", err.message);
          }
        }
        return {
          ...req,
          program: program || null,
        };
      }),
    );

    return NextResponse.json({
      success: true,
      data: requestsWithProgram,
    });
  } catch (error) {
    console.error("❌ خطا در دریافت درخواست‌های کاربر:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت درخواست‌ها",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
