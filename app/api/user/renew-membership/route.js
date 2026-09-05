// app/api/user/renew-membership/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// ===== POST: تمدید عضویت کاربر =====
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
    const { plan = "برنز", duration = 30 } = body; // پیش‌فرض: برنز و ۳۰ روز

    // پیدا کردن کاربر
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "کاربر یافت نشد" },
        { status: 404 },
      );
    }

    // محاسبه تاریخ جدید
    const now = new Date();
    const newEndDate = new Date(now);
    newEndDate.setDate(newEndDate.getDate() + duration);

    // تنظیمات پلن‌ها
    const planSettings = {
      پایه: { totalSessions: 12, price: "۱,۱۰۰,۰۰۰" },
      برنز: { totalSessions: 30, price: "۱,۵۰۰,۰۰۰" },
      نقره‌ای: { totalSessions: 60, price: "۸,۱۰۰,۰۰۰" },
      طلایی: { totalSessions: 999, price: "۸,۵۰۰,۰۰۰" },
    };

    const selectedPlan = planSettings[plan] || planSettings.برنز;

    // به‌روزرسانی عضویت
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        $set: {
          "membership.plan": plan,
          "membership.startDate": now,
          "membership.endDate": newEndDate,
          "membership.totalSessions": selectedPlan.totalSessions,
          "membership.usedSessions": 0, // ریست کردن جلسات استفاده شده
          "membership.isActive": true,
        },
      },
      { new: true, runValidators: true },
    ).select("-password");

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: `عضویت شما با موفقیت تمدید شد! (${duration} روز)`,
    });
  } catch (error) {
    console.error("❌ خطا در تمدید عضویت:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در تمدید عضویت",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
