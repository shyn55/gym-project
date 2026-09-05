// src/app/api/pricing/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Pricing from "@/models/Pricing";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// ===== GET: دریافت یک پلن =====
export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;
    const pricing = await Pricing.findById(id).lean();

    if (!pricing) {
      return NextResponse.json(
        { success: false, message: "پلن یافت نشد" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: pricing });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "خطا در دریافت پلن" },
      { status: 500 },
    );
  }
}

// ===== PUT: ویرایش پلن =====
export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const updatedPricing = await Pricing.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true },
    );

    if (!updatedPricing) {
      return NextResponse.json(
        { success: false, message: "پلن یافت نشد" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedPricing,
      message: "پلن با موفقیت ویرایش شد",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "خطا در ویرایش پلن" },
      { status: 500 },
    );
  }
}

// ===== DELETE: حذف پلن =====
export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;

    const deletedPricing = await Pricing.findByIdAndDelete(id);

    if (!deletedPricing) {
      return NextResponse.json(
        { success: false, message: "پلن یافت نشد" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "پلن با موفقیت حذف شد",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "خطا در حذف پلن" },
      { status: 500 },
    );
  }
}
