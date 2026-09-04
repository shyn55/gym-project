import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { success: false, message: "فایلی انتخاب نشده است" },
        { status: 400 }
      );
    }

    // فقط تصویر
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "فقط فایل تصویری مجاز است" },
        { status: 400 }
      );
    }

    // محدودیت 5 مگابایت
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "حجم تصویر نباید بیشتر از 5 مگابایت باشد" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${randomUUID()}.${extension}`;

    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "blog"
    );

    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/blog/${fileName}`;

    return NextResponse.json({
      success: true,
      url: imageUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json(
      { success: false, message: "خطا در آپلود تصویر" },
      { status: 500 }
    );
  }
}