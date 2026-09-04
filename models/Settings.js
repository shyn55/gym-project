// src/models/Settings.js
import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: "باشگاه امپراطور",
    },
    siteDescription: {
      type: String,
      default: "بهترین باشگاه ورزشی",
    },
    logo: {
      type: String,
      default: "/images/logo.png",
    },
    favicon: {
      type: String,
      default: "/images/favicon.ico",
    },
    phone: {
      type: String,
      default: "۰۲۶-۳۳۵۲۱۹۲۲",
    },
    phone2: {
      type: String,
      default: "۰۹۱۰-۰۰۵۸۵۷۰",
    },
    email: {
      type: String,
      default: "info@empiregym.ir",
    },
    address: {
      type: String,
      default: "کرج، مهرشهر، فاز ۴، بلوار رزه بان، خیابان ۴۱۰ غربی",
    },
    workingHours: {
      type: String,
      default: "شنبه تا پنجشنبه: ۸:۰۰ - ۲۳:۰۰",
    },
    fridayHours: {
      type: String,
      default: "جمعه: تعطیل",
    },
    holidayHours: {
      type: String,
      default: "ایام تعطیلات رسمی: ۱۹:۰۰ - ۲۳:۰۰",
    },
    socialMedia: {
      instagram: { type: String, default: "" },
      telegram: { type: String, default: "" },
      whatsapp: { type: String, default: "" },
      youtube: { type: String, default: "" },
    },
    metaKeywords: {
      type: String,
      default: "باشگاه ورزشی، تناسب اندام، بدنسازی",
    },
    metaDescription: {
      type: String,
      default: "بهترین باشگاه ورزشی با تجهیزات مدرن و مربیان حرفه‌ای",
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);

export default Settings;