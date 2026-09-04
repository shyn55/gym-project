// models/WorkoutProgram.js
import mongoose from "mongoose";

const WorkoutProgramSchema = new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkoutRequest",
      required: true,
    },
    coach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coach",
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: "برنامه تمرینی",
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    pdfUrl: {
      type: String,
      default: "",
    },
    pdfFileName: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // ===== جدید: نوع برنامه =====
    programType: {
      type: String,
      enum: ["manual", "upload"], // manual = دستی, upload = آپلود PDF
      default: "manual",
    },
  },
  {
    timestamps: true,
  }
);

const WorkoutProgram = mongoose.models.WorkoutProgram ||
  mongoose.model("WorkoutProgram", WorkoutProgramSchema);

export default WorkoutProgram;