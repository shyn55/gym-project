// app/api/workout/request/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import WorkoutRequest from "@/models/WorkoutRequest";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import WorkoutProgram from "@/models/WorkoutProgram";
// ===== POST: ثبت درخواست برنامه تمرینی =====
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "لطفاً وارد شوید" },
        { status: 401 },
      );
    }

    await connectDB();
    const body = await request.json();

    // محاسبه BMI
    const heightInMeters = body.height / 100;
    const bmi = body.weight / (heightInMeters * heightInMeters);
    const bmiRounded = Math.round(bmi * 10) / 10;

    let bmiCategory = "نرمال";
    if (bmiRounded < 18.5) bmiCategory = "کم‌وزن";
    else if (bmiRounded < 25) bmiCategory = "نرمال";
    else if (bmiRounded < 30) bmiCategory = "اضافه‌وزن";
    else bmiCategory = "چاق";

    const newRequest = await WorkoutRequest.create({
      user: session.user.id,
      fullName: body.fullName || session.user.name,
      age: body.age,
      gender: body.gender,
      height: body.height,
      weight: body.weight,
      bmi: bmiRounded,
      bmiCategory: bmiCategory,
      frontImage: body.frontImage || "",
      backImage: body.backImage || "",
      sideImage: body.sideImage || "",
      goal: body.goal,
      description: body.description || "",
      status: "pending",
    });

    return NextResponse.json({
      success: true,
      data: newRequest,
      message: "درخواست شما با موفقیت ثبت شد",
    });
  } catch (error) {
    console.error("❌ خطا در ثبت درخواست:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در ثبت درخواست",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

// app/api/workout/request/route.js - بخش GET

// ===== GET: دریافت درخواست‌ها =====
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "لطفاً وارد شوید" },
        { status: 401 },
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const coachId = searchParams.get("coachId");

    let query = {};

    if (coachId) {
      // مربی می‌خواهد همه درخواست‌های pending را ببیند
      // و همچنین درخواست‌هایی که خودش به آنها برنامه داده
      query = {
        $or: [
          { coach: coachId }, // درخواست‌های خودش
          { status: "pending", coach: null }, // درخواست‌های بدون مربی
        ],
      };
    } else {
      // کاربر عادی: فقط درخواست‌های خودش
      query.user = session.user.id;
    }

    const requests = await WorkoutRequest.find(query)
      .populate("user", "name email phone")
      .populate("coach", "name specialty")
      .sort({ createdAt: -1 })
      .lean();

    // ===== دریافت برنامه‌ها به صورت جداگانه =====
    const requestsWithProgram = await Promise.all(
      requests.map(async (req) => {
        if (req.program) {
          try {
            const WorkoutProgram = (await import("@/models/WorkoutProgram"))
              .default;
            const program = await WorkoutProgram.findById(req.program)
              .populate("coach", "name")
              .lean();
            return { ...req, program };
          } catch (err) {
            return { ...req, program: null };
          }
        }
        return req;
      }),
    );

    return NextResponse.json({
      success: true,
      data: requestsWithProgram,
    });
  } catch (error) {
    console.error("❌ خطا در دریافت درخواست‌ها:", error);
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
