// src/models/Pricing.js
import mongoose from "mongoose";

const PricingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "عنوان پلن الزامی است"],
    },
    subtitle: {
      type: String,
      default: "",
    },
    price: {
      type: String,
      required: [true, "قیمت الزامی است"],
    },
    period: {
      type: String,
      default: "ماهانه",
    },
    features: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: "/images/pricing/default.jpg",
    },
    badge: {
      type: String,
      default: "",
    },
    buttonText: {
      type: String,
      default: "ثبت نام",
    },
    color: {
      type: String,
      default: "#440099",
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

const Pricing = mongoose.models.Pricing || mongoose.model("Pricing", PricingSchema);

export default Pricing;