// app/api/exercises/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Exercise from "@/models/Exercise";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import fs from "fs";
import path from "path";

// ===== POST: افزودن حرکت جدید (با پشتیبانی از فیلم) =====
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

    const contentType = request.headers.get("content-type") || "";
    console.log("📝 Content-Type:", contentType);

    let body = {};
    let videoFile = null;

    if (contentType.includes("multipart/form-data")) {
      try {
        const formData = await request.formData();
        const fields = {};

        for (const [key, value] of formData.entries()) {
          console.log(
            `📁 فیلد: ${key} = ${typeof value === "object" ? "File" : value}`,
          );

          if (key === "videoFile") {
            videoFile = value;
          } else if (key === "muscles") {
            try {
              fields[key] = JSON.parse(value);
            } catch {
              fields[key] = value;
            }
          } else if (key === "isActive") {
            fields[key] = value === "true";
          } else {
            fields[key] = value;
          }
        }

        body = fields;

        // ===== ذخیره فیلم =====
        if (videoFile && videoFile.size > 0) {
          console.log(
            `🎬 فیلم دریافت شد: ${videoFile.name}, سایز: ${videoFile.size} bytes, نوع: ${videoFile.type}`,
          );

          // بررسی حجم (حداکثر ۲۰ مگابایت)
          if (videoFile.size > 20 * 1024 * 1024) {
            return NextResponse.json(
              {
                success: false,
                message: "حجم فیلم نباید بیشتر از ۲۰ مگابایت باشد",
              },
              { status: 400 },
            );
          }

          // بررسی نوع فایل
          const allowedTypes = [
            "video/mp4",
            "video/webm",
            "video/ogg",
            "video/quicktime",
          ];
          if (!allowedTypes.includes(videoFile.type)) {
            return NextResponse.json(
              {
                success: false,
                message:
                  "فرمت فیلم پشتیبانی نمی‌شود. فرمت‌های مجاز: MP4, WebM, OGG, MOV",
              },
              { status: 400 },
            );
          }

          // ایجاد نام فایل
          const timestamp = Date.now();
          const ext = path.extname(videoFile.name) || ".mp4";
          const fileName = `exercise_${timestamp}_${Math.random().toString(36).slice(2, 8)}${ext}`;
          const uploadDir = path.join(
            process.cwd(),
            "public/uploads/exercises/videos",
          );

          // ایجاد پوشه اگر وجود ندارد
          if (!fs.existsSync(uploadDir)) {
            console.log("📁 ایجاد پوشه:", uploadDir);
            fs.mkdirSync(uploadDir, { recursive: true });
          }

          const filePath = path.join(uploadDir, fileName);
          console.log("💾 ذخیره فیلم در:", filePath);

          const buffer = Buffer.from(await videoFile.arrayBuffer());
          fs.writeFileSync(filePath, buffer);

          body.videoFile = `/uploads/exercises/videos/${fileName}`;
          console.log("✅ فیلم ذخیره شد:", body.videoFile);
        }
      } catch (formError) {
        console.error("❌ خطا در پردازش فرم:", formError);
        return NextResponse.json(
          {
            success: false,
            message: "خطا در پردازش فایل: " + formError.message,
          },
          { status: 400 },
        );
      }
    } else {
      // ===== حالت JSON =====
      body = await request.json();
    }

    // اعتبارسنجی
    if (!body.name || !body.category) {
      return NextResponse.json(
        { success: false, message: "نام و دسته‌بندی حرکت الزامی است" },
        { status: 400 },
      );
    }

    // اگر muscles به صورت رشته است، آن را به آرایه تبدیل کن
    if (typeof body.muscles === "string") {
      body.muscles = body.muscles
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean);
    }

    const exercise = await Exercise.create({
      ...body,
      createdBy: session.user.id,
    });

    return NextResponse.json({
      success: true,
      data: exercise,
      message: "حرکت با موفقیت اضافه شد",
    });
  } catch (error) {
    console.error("❌ خطا در افزودن حرکت:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در افزودن حرکت: " + error.message,
        error: error.message,
      },
      { status: 500 },
    );
  }
}

// ===== GET: دریافت لیست حرکات =====
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const exercises = await Exercise.find(query)
      .sort({ order: 1, name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: exercises,
    });
  } catch (error) {
    console.error("❌ خطا در دریافت حرکات:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت حرکات",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
