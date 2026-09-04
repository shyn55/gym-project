// models/Coach.js
import mongoose from "mongoose";

const CoachSchema = new mongoose.Schema(
  {
    // ... فیلدهای قبلی ...
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      select: false,
    },
    hasPanelAccess: {
      type: Boolean,
      default: false,
    },
    // ... بقیه فیلدها ...
  },
  { timestamps: true }
);

export default mongoose.models.Coach || mongoose.model("Coach", CoachSchema);