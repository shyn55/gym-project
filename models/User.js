// src/models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "نام کامل الزامی است"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "ایمیل الزامی است"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "رمز عبور الزامی است"],
    },
    phone: {
      type: String,
      default: "",
    },
    // اطلاعات عضویت
    membership: {
      plan: {
        type: String,
        enum: ["پایه", "برنز", "نقره‌ای", "طلایی", "none"],
        default: "none",
      },
      startDate: {
        type: Date,
        default: null,
      },
      endDate: {
        type: Date,
        default: null,
      },
      totalSessions: {
        type: Number,
        default: 0,
      },
      usedSessions: {
        type: Number,
        default: 0,
      },
      isActive: {
        type: Boolean,
        default: false,
      },
    },
    // اطلاعات شخصی
    gender: {
      type: String,
      enum: ["مرد", "زن", ""],
      default: "",
    },
    birthDate: {
      type: Date,
      default: null,
    },
    weight: {
      type: Number,
      default: null,
    },
    height: {
      type: Number,
      default: null,
    },
    // تنظیمات
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;