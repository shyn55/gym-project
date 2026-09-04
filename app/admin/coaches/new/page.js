// src/app/admin/coaches/new/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  FaArrowRight, 
  FaUser, 
  FaSave, 
  FaUpload,
  FaEnvelope,
  FaLock,
  FaShieldAlt
} from "react-icons/fa";
import styles from "../../admin.module.css";

export default function NewCoachPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    bio: "",
    experience: "",
    image: "",
    socialLinks: {
      instagram: "",
      telegram: "",
      whatsapp: "",
    },
    isActive: true,
    // ===== فیلدهای جدید =====
    email: "",
    password: "",
    hasPanelAccess: false,
  });

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("social.")) {
      const socialKey = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialKey]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/coaches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/admin/coaches");
      } else {
        setError(data.message || "خطا در افزودن مربی");
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
        <h1 className={styles.pageTitle}>🏋️ افزودن مربی جدید</h1>
        <Link href="/admin/coaches" className={styles.btnSecondary}>
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
            عکس مربی
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
                borderRadius: "50%",
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

        {/* ===== اطلاعات پایه ===== */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            نام مربی <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
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
              transition: "border 0.3s ease",
            }}
            placeholder="مثال: علی رضایی"
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            تخصص <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="specialty"
            value={formData.specialty}
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
              transition: "border 0.3s ease",
            }}
            placeholder="مثال: بدنسازی حرفه‌ای"
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            سابقه
          </label>
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              fontSize: "15px",
              fontFamily: "inherit",
              outline: "none",
              transition: "border 0.3s ease",
            }}
            placeholder="مثال: ۱۰ سال سابقه"
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            بیوگرافی
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              fontSize: "15px",
              fontFamily: "inherit",
              outline: "none",
              transition: "border 0.3s ease",
              resize: "vertical",
            }}
            placeholder="توضیحات درباره مربی..."
          />
        </div>

        {/* ===== فیلدهای ورود به پنل مربی ===== */}
        <div
          style={{
            marginBottom: "24px",
            borderTop: "2px dashed #eee",
            paddingTop: "24px",
          }}
        >
          <h4
            style={{
              marginBottom: "16px",
              color: "#440099",
              fontSize: "16px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FaShieldAlt />
            🔐 اطلاعات ورود به پنل مربی
          </h4>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom: "6px",
                color: "#333",
              }}
            >
              <FaEnvelope style={{ marginLeft: "6px" }} />
              ایمیل (برای ورود به پنل)
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                fontSize: "15px",
                fontFamily: "inherit",
                outline: "none",
                transition: "border 0.3s ease",
              }}
            />
            <p
              style={{
                fontSize: "12px",
                color: "#999",
                marginTop: "4px",
              }}
            >
              اگر می‌خواهید مربی به پنل دسترسی داشته باشد، ایمیل و رمز را وارد
              کنید.
            </p>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom: "6px",
                color: "#333",
              }}
            >
              <FaLock style={{ marginLeft: "6px" }} />
              رمز عبور (برای ورود به پنل)
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="حداقل ۶ کاراکتر"
              minLength="6"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                fontSize: "15px",
                fontFamily: "inherit",
                outline: "none",
                transition: "border 0.3s ease",
              }}
            />
          </div>

          <div style={{ marginBottom: "8px" }}>
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
                name="hasPanelAccess"
                checked={formData.hasPanelAccess}
                onChange={handleChange}
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: "#440099",
                }}
              />
              <span style={{ fontWeight: "500", color: "#333" }}>
                دسترسی به پنل مربی
              </span>
            </label>
          </div>
        </div>

        {/* ===== شبکه‌های اجتماعی ===== */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "12px",
              color: "#333",
            }}
          >
            شبکه‌های اجتماعی
          </label>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              type="text"
              name="social.instagram"
              value={formData.socialLinks.instagram}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px 16px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                fontSize: "14px",
                fontFamily: "inherit",
                outline: "none",
              }}
              placeholder="اینستاگرام: https://instagram.com/..."
            />
            <input
              type="text"
              name="social.telegram"
              value={formData.socialLinks.telegram}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px 16px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                fontSize: "14px",
                fontFamily: "inherit",
                outline: "none",
              }}
              placeholder="تلگرام: https://t.me/..."
            />
            <input
              type="text"
              name="social.whatsapp"
              value={formData.socialLinks.whatsapp}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px 16px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                fontSize: "14px",
                fontFamily: "inherit",
                outline: "none",
              }}
              placeholder="واتساپ: https://wa.me/..."
            />
          </div>
        </div>

        {/* ===== وضعیت فعال ===== */}
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

        {/* ===== دکمه ثبت ===== */}
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
          {loading ? "در حال ثبت..." : "افزودن مربی"}
        </button>
      </form>
    </>
  );
}