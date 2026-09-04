// src/app/admin/blog/new/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowRight, FaSave } from "react-icons/fa";
import styles from "../../admin.module.css";

export default function NewArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    image: "",
    author: "مدیر سایت",
    category: "عمومی",
    tags: [],
    isPublished: false,
  });

  const [tagInput, setTagInput] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (index) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const generateSlug = () => {
    if (formData.title) {
      const slug = formData.title
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase();
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/admin/blog");
      } else {
        setError(data.message || "خطا در افزودن مقاله");
      }
    } catch (err) {
      setError("مشکل در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>✍️ نوشتن مقاله جدید</h1>
        <Link href="/admin/blog" className={styles.btnSecondary}>
          <FaArrowRight /> بازگشت به لیست
        </Link>
      </div>

      {error && (
        <div
          style={{
            color: "red",
            padding: "16px",
            background: "#ffe0e0",
            borderRadius: "12px",
            marginBottom: "24px",
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: "32px",
          borderRadius: "16px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          maxWidth: "800px",
        }}
      >
        {/* عنوان */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            عنوان مقاله <span style={{ color: "red" }}>*</span>
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              onBlur={generateSlug}
              required
              style={{
                flex: 1,
                padding: "12px 16px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                fontSize: "15px",
                fontFamily: "inherit",
                outline: "none",
              }}
              placeholder="عنوان مقاله..."
            />
            <button
              type="button"
              onClick={generateSlug}
              style={{
                padding: "12px 16px",
                background: "#f0f0f0",
                border: "1px solid #ddd",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              تولید اسلاگ
            </button>
          </div>
        </div>

        {/* اسلاگ */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            اسلاگ <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              fontSize: "15px",
              fontFamily: "inherit",
              outline: "none",
            }}
            placeholder="example-article-title"
          />
          <p style={{ fontSize: "12px", color: "#999", marginTop: "4px" }}>
            اسلاگ باید یکتا (unique) باشد و فقط شامل حروف انگلیسی و خط تیره باشد
          </p>
        </div>

        {/* خلاصه */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            خلاصه مقاله
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows="2"
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              fontSize: "15px",
              fontFamily: "inherit",
              outline: "none",
              resize: "vertical",
            }}
            placeholder="خلاصه کوتاه از مقاله..."
          />
        </div>

        {/* محتوا */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            محتوای مقاله <span style={{ color: "red" }}>*</span>
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="10"
            required
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              fontSize: "15px",
              fontFamily: "inherit",
              outline: "none",
              resize: "vertical",
            }}
            placeholder="متن کامل مقاله..."
          />
        </div>

        {/* آدرس تصویر */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            آدرس تصویر شاخص
          </label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              fontSize: "15px",
              fontFamily: "inherit",
              outline: "none",
            }}
            placeholder="/images/blog/my-article.jpg"
          />
        </div>

        {/* دسته‌بندی */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            دسته‌بندی
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              fontSize: "15px",
              fontFamily: "inherit",
              outline: "none",
            }}
            placeholder="مثال: تمرینات، تغذیه، سلامت"
          />
        </div>

        {/* تگ‌ها */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            تگ‌ها
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                flex: 1,
                padding: "12px 16px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                fontSize: "15px",
                fontFamily: "inherit",
                outline: "none",
              }}
              placeholder="مثال: بدنسازی، تغذیه"
            />
            <button
              type="button"
              onClick={addTag}
              style={{
                padding: "12px 20px",
                background: "#440099",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "700",
              }}
            >
              افزودن
            </button>
          </div>

          {formData.tags.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginTop: "12px",
              }}
            >
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    background: "#f0f0f0",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#ff6b6b",
                      padding: "0 4px",
                      fontSize: "14px",
                    }}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* نویسنده */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            نویسنده
          </label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              fontSize: "15px",
              fontFamily: "inherit",
              outline: "none",
            }}
            placeholder="نام نویسنده"
          />
        </div>

        {/* وضعیت انتشار */}
        <div style={{ marginBottom: "28px" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              style={{ width: "18px", height: "18px", accentColor: "#440099" }}
            />
            <span style={{ fontWeight: "500", color: "#333" }}>
              انتشار مقاله (نمایش در سایت)
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            background: "#440099",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: "700",
            fontFamily: "inherit",
            cursor: "pointer",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <FaSave />
          {loading ? "در حال ثبت..." : "ذخیره مقاله"}
        </button>
      </form>
    </>
  );
}