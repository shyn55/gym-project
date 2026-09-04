// src/models/Branch.js
import mongoose from "mongoose";

const BranchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "نام شعبه الزامی است"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "آدرس شعبه الزامی است"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "شماره تماس الزامی است"],
      trim: true,
    },
    phone2: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
    },
    hours: {
      type: String,
      default: "۸:۰۰ - ۲۳:۰۰",
    },
    fridayHours: {
      type: String,
      default: "تعطیل",
    },
    holidayHours: {
      type: String,
      default: "۱۹:۰۰ - ۲۳:۰۰",
    },
    image: {
      type: String,
      default: "/images/branches/default.jpg",
    },
    mapLink: {
      type: String,
      default: "",
    },
    facilities: {
      type: [String],
      default: ["تجهیزات مدرن", "سونا و جکوزی", "بخش هوازی"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Branch = mongoose.models.Branch || mongoose.model("Branch", BranchSchema);

export default Branch;