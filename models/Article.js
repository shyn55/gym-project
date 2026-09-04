// src/models/Article.js
import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "عنوان مقاله الزامی است"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "اسلاگ مقاله الزامی است"],
      unique: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, "محتوا الزامی است"],
    },
    excerpt: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "/images/blog/default.jpg",
    },
    author: {
      type: String,
      default: "مدیر سایت",
    },
    category: {
      type: String,
      default: "عمومی",
    },
    tags: {
      type: [String],
      default: [],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Article = mongoose.models.Article || mongoose.model("Article", ArticleSchema);

export default Article;