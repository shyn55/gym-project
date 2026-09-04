// models/Exercise.js
import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "نام حرکت الزامی است"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "دسته‌بندی الزامی است"],
      enum: [
        "سینه",
        "پشت",
        "پا",
        "شانه",
        "بازو",
        "شکم",
        "کاردیو",
        "کششی",
        "سایر",
      ],
      default: "سایر",
    },
    description: {
      type: String,
      default: "",
    },
    instructions: {
      type: String,
      default: "",
    },
    tips: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "/images/exercises/default.jpg",
    },
    // ===== فیلدهای جدید برای فیلم =====
    videoFile: {
      type: String, // مسیر فایل ویدئو آپلود شده
      default: "",
    },
    videoUrl: {
      type: String, // لینک ویدئو از خارج (یوتیوب و...)
      default: "",
    },
    // ================================
    muscles: {
      type: [String],
      default: [],
    },
    difficulty: {
      type: String,
      enum: ["مبتدی", "متوسط", "پیشرفته"],
      default: "متوسط",
    },
    equipment: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coach",
    },
  },
  {
    timestamps: true,
  }
);

const Exercise =
  mongoose.models.Exercise || mongoose.model("Exercise", ExerciseSchema);

export default Exercise;