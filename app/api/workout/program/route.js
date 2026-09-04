// app/api/workout/program/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import WorkoutProgram from "@/models/WorkoutProgram";
import WorkoutRequest from "@/models/WorkoutRequest";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import fs from "fs";
import path from "path";

// ===== POST: ثبت برنامه تمرینی =====
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "coach") {
      return NextResponse.json(
        { success: false, message: "دسترسی غیرمجاز" },
        { status: 403 },
      );
    }

    await connectDB();

    // بررسی نوع داده (فرم داده یا JSON)
    const contentType = request.headers.get("content-type") || "";

    let body;
    let file;

    if (contentType.includes("multipart/form-data")) {
      // ===== حالت آپلود فایل =====
      const formData = await request.formData();
      body = {
        requestId: formData.get("requestId"),
        title: formData.get("title"),
        notes: formData.get("notes"),
        programType: "upload",
        pdfFile: formData.get("pdfFile"),
      };
      file = body.pdfFile;
    } else {
      // ===== حالت JSON (دستی) =====
      body = await request.json();
      body.programType = "manual";
    }

    const { requestId, title, content, notes, programType, pdfFile } = body;

    if (!requestId) {
      return NextResponse.json(
        { success: false, message: "شناسه درخواست الزامی است" },
        { status: 400 },
      );
    }

    // بررسی وجود درخواست
    const workoutRequest = await WorkoutRequest.findById(requestId);
    if (!workoutRequest) {
      return NextResponse.json(
        { success: false, message: "درخواست یافت نشد" },
        { status: 404 },
      );
    }

    let pdfUrl = "";
    let pdfFileName = "";

    // ===== اگر فایل آپلود شده =====
    if (file && programType === "upload") {
      // بررسی نوع فایل
      if (file.type !== "application/pdf") {
        return NextResponse.json(
          { success: false, message: "فایل باید PDF باشد" },
          { status: 400 },
        );
      }

      // بررسی حجم (حداکثر ۵ مگابایت)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, message: "حجم فایل نباید بیشتر از ۵ مگابایت باشد" },
          { status: 400 },
        );
      }

      // ایجاد نام فایل
      const timestamp = Date.now();
      const fileName = `program_${requestId}_${timestamp}.pdf`;
      const uploadDir = path.join(process.cwd(), "public/uploads/programs");

      // ایجاد پوشه اگر وجود ندارد
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // ذخیره فایل
      const filePath = path.join(uploadDir, fileName);
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(filePath, buffer);

      pdfUrl = `/uploads/programs/${fileName}`;
      pdfFileName = file.name || "برنامه-تمرینی.pdf";
    }

    // ===== ساخت یا به‌روزرسانی برنامه =====
    let program;
    if (workoutRequest.program) {
      // به‌روزرسانی برنامه موجود
      const updateData = {
        title: title || "برنامه تمرینی",
        notes: notes || "",
        coach: session.user.id,
        programType: programType,
      };

      if (programType === "manual" && content) {
        updateData.content = content;
        updateData.pdfUrl = "";
        updateData.pdfFileName = "";
      } else if (programType === "upload" && pdfUrl) {
        updateData.content = {};
        updateData.pdfUrl = pdfUrl;
        updateData.pdfFileName = pdfFileName;
      }

      program = await WorkoutProgram.findByIdAndUpdate(
        workoutRequest.program,
        { $set: updateData },
        { new: true },
      );
    } else {
      // ایجاد برنامه جدید
      const createData = {
        request: requestId,
        coach: session.user.id,
        title: title || "برنامه تمرینی",
        notes: notes || "",
        programType: programType,
      };

      if (programType === "manual" && content) {
        createData.content = content;
      } else if (programType === "upload" && pdfUrl) {
        createData.pdfUrl = pdfUrl;
        createData.pdfFileName = pdfFileName;
      }

      program = await WorkoutProgram.create(createData);
    }

    // به‌روزرسانی درخواست
    await WorkoutRequest.findByIdAndUpdate(requestId, {
      $set: {
        program: program._id,
        status: "completed",
        coach: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: program,
      message:
        programType === "upload"
          ? "برنامه با موفقیت آپلود شد"
          : "برنامه با موفقیت ثبت شد",
    });
  } catch (error) {
    console.error("❌ خطا:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در ثبت برنامه",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
