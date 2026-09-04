// src/app/api/branches/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Branch from "@/models/Branch";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// ===== GET: دریافت یک شعبه =====
export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;
    const branch = await Branch.findById(id).lean();

    if (!branch) {
      return NextResponse.json(
        { success: false, message: "شعبه یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: branch });
  } catch (error) {
    console.error("خطا در دریافت شعبه:", error);
    return NextResponse.json(
      { success: false, message: "خطا در دریافت شعبه" },
      { status: 500 }
    );
  }
}

// ===== PUT: ویرایش شعبه =====
export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const updatedBranch = await Branch.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedBranch) {
      return NextResponse.json(
        { success: false, message: "شعبه یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedBranch,
      message: "شعبه با موفقیت ویرایش شد",
    });
  } catch (error) {
    console.error("خطا در ویرایش شعبه:", error);
    return NextResponse.json(
      { success: false, message: "خطا در ویرایش شعبه" },
      { status: 500 }
    );
  }
}

// ===== DELETE: حذف شعبه =====
export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;

    const deletedBranch = await Branch.findByIdAndDelete(id);

    if (!deletedBranch) {
      return NextResponse.json(
        { success: false, message: "شعبه یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "شعبه با موفقیت حذف شد",
    });
  } catch (error) {
    console.error("خطا در حذف شعبه:", error);
    return NextResponse.json(
      { success: false, message: "خطا در حذف شعبه" },
      { status: 500 }
    );
  }
}