// src/models/Testimonial.js
import mongoose from "mongoose";

const TestimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "نام کاربر الزامی است"],
      trim: true,
    },
    comment: {
      type: String,
      required: [true, "نظر کاربر الزامی است"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    image: {
      type: String,
      default: "/images/testimonials/default.jpg",
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    position: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Testimonial = mongoose.models.Testimonial || mongoose.model("Testimonial", TestimonialSchema);

export default Testimonial;