// src/models/Gallery.js
import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "عنوان تصویر الزامی است"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "آدرس تصویر الزامی است"],
    },
    category: {
      type: String,
      default: "عمومی",
      enum: ["عمومی", "تمرینات", "رویدادها", "باشگاه", "مربیان", "سایر"],
    },
    description: {
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
  },
  {
    timestamps: true,
  }
);

const Gallery = mongoose.models.Gallery || mongoose.model("Gallery", GallerySchema);

export default Gallery;