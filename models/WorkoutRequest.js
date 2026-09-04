// models/WorkoutRequest.js
import mongoose from "mongoose";

const WorkoutRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coach",
      default: null,
    },
    fullName: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ["مرد", "زن"],
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    bmi: {
      type: Number,
    },
    bmiCategory: {
      type: String,
      enum: ["کم‌وزن", "نرمال", "اضافه‌وزن", "چاق"],
    },
    frontImage: {
      type: String,
      default: "",
    },
    backImage: {
      type: String,
      default: "",
    },
    sideImage: {
      type: String,
      default: "",
    },
    goal: {
      type: String,
      enum: ["افزایش وزن", "کاهش وزن", "تناسب اندام", "افزایش قدرت", "افزایش استقامت"],
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "rejected"],
      default: "pending",
    },
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkoutProgram",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ===== ثبت مدل =====
const WorkoutRequest = mongoose.models.WorkoutRequest || 
  mongoose.model("WorkoutRequest", WorkoutRequestSchema);

export default WorkoutRequest;