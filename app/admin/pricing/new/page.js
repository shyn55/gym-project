// src/app/admin/pricing/new/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaArrowRight, FaSave, FaPlus, FaTimes, FaUpload, FaUser } from "react-icons/fa";
import styles from "../../admin.module.css";

export default function NewPricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    price: "",
    period: "ماهانه",
    features: [],
    image: "",
    badge: "",
    buttonText: "ثبت نام",
    color: "#440099",
    isActive: true,
    order: 0,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // تبدیل عکس به base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("حجم عکس نباید بیشتر از ۲ مگابایت باشد");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target.result;
      setFormData((prev) => ({ ...prev, image: base64String }));
      setImagePreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput("");
    }
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFeature();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/pricing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/admin/pricing");
      } else {
        setError(data.message || "خطا در افزودن پلن");
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
        <h1 className={styles.pageTitle}>💰 افزودن پلن جدید</h1>
        <Link href="/admin/pricing" className={styles.btnSecondary}>
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
          maxWidth: "700px",
        }}
      >
        {/* ===== آپلود عکس ===== */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "8px",
              color: "#333",
            }}
          >
            تصویر پلن
          </label>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "12px",
                overflow: "hidden",
                background: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px dashed #ddd",
              }}
            >
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="پیش‌نمایش"
                  width={100}
                  height={100}
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <FaUser style={{ fontSize: "40px", color: "#ccc" }} />
              )}
            </div>

            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 20px",
                background: "#f0f0f0",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "600",
                color: "#555",
                transition: "all 0.3s ease",
                border: "1px dashed #ccc",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#e0e0e0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#f0f0f0";
              }}
            >
              <FaUpload />
              انتخاب عکس از دستگاه
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </label>
          </div>

          <p style={{ fontSize: "12px", color: "#999", marginTop: "8px" }}>
            حداکثر حجم: ۲ مگابایت | فرمت‌های مجاز: JPG, PNG, GIF
          </p>
        </div>

        {/* ===== سایر فیلدها ===== */}
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
            عنوان پلن <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
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
            placeholder="مثال: طلایی"
          />
        </div>

        {/* زیرعنوان */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            زیرعنوان
          </label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
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
            placeholder="مثال: مناسب برای حرفه‌ای‌ها"
          />
        </div>

        {/* قیمت */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            قیمت <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="price"
            value={formData.price}
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
            placeholder="مثال: ۸,۵۰۰,۰۰۰"
          />
        </div>

        {/* دوره */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            دوره
          </label>
          <select
            name="period"
            value={formData.period}
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
          >
            <option value="ماهانه">ماهانه</option>
            <option value="سالانه">سالانه</option>
            <option value="هفتگی">هفتگی</option>
            <option value="جلسه‌ای">جلسه‌ای</option>
          </select>
        </div>

        {/* ویژگی‌ها */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            ویژگی‌ها
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
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
              placeholder="مثال: هر روز"
            />
            <button
              type="button"
              onClick={addFeature}
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
              <FaPlus />
            </button>
          </div>

          {formData.features.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginTop: "12px",
              }}
            >
              {formData.features.map((feature, index) => (
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
                  ✅ {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#ff6b6b",
                      padding: "0 4px",
                      fontSize: "14px",
                    }}
                  >
                    <FaTimes />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* نشان ویژه */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            نشان ویژه
          </label>
          <input
            type="text"
            name="badge"
            value={formData.badge}
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
            placeholder="مثال: محبوب، لوکس، پیشنهاد ویژه"
          />
        </div>

        {/* رنگ */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            رنگ تم
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              style={{
                width: "50px",
                height: "50px",
                padding: "0",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            />
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              style={{
                flex: 1,
                padding: "12px 16px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                fontSize: "15px",
                fontFamily: "inherit",
                outline: "none",
              }}
              placeholder="#440099"
            />
          </div>
        </div>

        {/* متن دکمه */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            متن دکمه
          </label>
          <input
            type="text"
            name="buttonText"
            value={formData.buttonText}
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
            placeholder="ثبت نام"
          />
        </div>

        {/* وضعیت فعال */}
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
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              style={{ width: "18px", height: "18px", accentColor: "#440099" }}
            />
            <span style={{ fontWeight: "500", color: "#333" }}>فعال</span>
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
          {loading ? "در حال ثبت..." : "افزودن پلن"}
        </button>
      </form>
    </>
  );
}