// app/api/auth/coach-login/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Coach from "@/models/Coach";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    const coach = await Coach.findOne({ email, hasPanelAccess: true });
    if (!coach) {
      return NextResponse.json(
        { success: false, message: "ایمیل یا رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, coach.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "ایمیل یا رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: coach._id, role: "coach" },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      success: true,
      token,
      coach: {
        id: coach._id,
        name: coach.name,
        email: coach.email,
        specialty: coach.specialty,
      },
    });
  } catch (error) {
    console.error("خطا در ورود مربی:", error);
    return NextResponse.json(
      { success: false, message: "خطا در ورود" },
      { status: 500 }
    );
  }
}