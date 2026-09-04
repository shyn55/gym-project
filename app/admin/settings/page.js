// src/app/admin/settings/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaSave, FaCheckCircle } from "react-icons/fa";
import styles from "../admin.module.css";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    siteName: "",
    siteDescription: "",
    logo: "",
    favicon: "",
    phone: "",
    phone2: "",
    email: "",
    address: "",
    workingHours: "",
    fridayHours: "",
    holidayHours: "",
    socialMedia: {
      instagram: "",
      telegram: "",
      whatsapp: "",
      youtube: "",
    },
    metaKeywords: "",
    metaDescription: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setFetching(true);
        const res = await fetch("/api/settings");
        const data = await res.json();

        if (data.success) {
          setFormData(data.data);
        } else {
          setError("خطا در دریافت تنظیمات");
        }
      } catch (err) {
        setError("مشکل در ارتباط با سرور");
      } finally {
        setFetching(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("social.")) {
      const socialKey = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [socialKey]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess("تنظیمات با موفقیت ذخیره شد");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "خطا در ذخیره تنظیمات");
      }
    } catch (err) {
      setError("مشکل در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0", color: "#888" }}>
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>⚙️ تنظیمات عمومی</h1>
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

      {success && (
        <div
          style={{
            color: "#155724",
            padding: "16px",
            background: "#d4edda",
            borderRadius: "12px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <FaCheckCircle />
          {success}
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
        <h2
          style={{ fontSize: "20px", fontWeight: "700", marginBottom: "20px" }}
        >
          اطلاعات سایت
        </h2>

        {/* نام سایت */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            نام سایت
          </label>
          <input
            type="text"
            name="siteName"
            value={formData.siteName}
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
          />
        </div>

        {/* توضیحات سایت */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            توضیحات سایت
          </label>
          <input
            type="text"
            name="siteDescription"
            value={formData.siteDescription}
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
          />
        </div>

        {/* لوگو */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            آدرس لوگو
          </label>
          <input
            type="text"
            name="logo"
            value={formData.logo}
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
          />
        </div>

        {/* Favicon */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            آدرس Favicon
          </label>
          <input
            type="text"
            name="favicon"
            value={formData.favicon}
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
          />
        </div>

        <hr
          style={{
            margin: "30px 0",
            border: "none",
            borderTop: "1px solid #eee",
          }}
        />

        <h2
          style={{ fontSize: "20px", fontWeight: "700", marginBottom: "20px" }}
        >
          اطلاعات تماس
        </h2>

        {/* تلفن */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            شماره تماس
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
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
          />
        </div>

        {/* تلفن دوم */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            شماره تماس دوم
          </label>
          <input
            type="text"
            name="phone2"
            value={formData.phone2}
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
          />
        </div>

        {/* ایمیل */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            ایمیل
          </label>
          <input
            type="text"
            name="email"
            value={formData.email}
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
          />
        </div>

        {/* آدرس */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            آدرس
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
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
          />
        </div>

        <hr
          style={{
            margin: "30px 0",
            border: "none",
            borderTop: "1px solid #eee",
          }}
        />

        <h2
          style={{ fontSize: "20px", fontWeight: "700", marginBottom: "20px" }}
        >
          ساعت کاری
        </h2>

        {/* ساعت کاری روزانه */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            ساعت کاری روزانه
          </label>
          <input
            type="text"
            name="workingHours"
            value={formData.workingHours}
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
          />
        </div>

        {/* ساعت کاری جمعه */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            ساعت کاری جمعه
          </label>
          <input
            type="text"
            name="fridayHours"
            value={formData.fridayHours}
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
          />
        </div>

        {/* ساعت کاری تعطیلات رسمی */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            ساعت کاری تعطیلات رسمی
          </label>
          <input
            type="text"
            name="holidayHours"
            value={formData.holidayHours}
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
          />
        </div>

        <hr
          style={{
            margin: "30px 0",
            border: "none",
            borderTop: "1px solid #eee",
          }}
        />

        <h2
          style={{ fontSize: "20px", fontWeight: "700", marginBottom: "20px" }}
        >
          شبکه‌های اجتماعی
        </h2>

        {/* اینستاگرام */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            اینستاگرام
          </label>
          <input
            type="text"
            name="social.instagram"
            value={formData.socialMedia?.instagram || ""}
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
            placeholder="https://instagram.com/..."
          />
        </div>

        {/* تلگرام */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            تلگرام
          </label>
          <input
            type="text"
            name="social.telegram"
            value={formData.socialMedia?.telegram || ""}
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
            placeholder="https://t.me/..."
          />
        </div>

        {/* واتساپ */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            واتساپ
          </label>
          <input
            type="text"
            name="social.whatsapp"
            value={formData.socialMedia?.whatsapp || ""}
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
            placeholder="https://wa.me/..."
          />
        </div>

        {/* یوتیوب */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            یوتیوب
          </label>
          <input
            type="text"
            name="social.youtube"
            value={formData.socialMedia?.youtube || ""}
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
            placeholder="https://youtube.com/..."
          />
        </div>

        <hr
          style={{
            margin: "30px 0",
            border: "none",
            borderTop: "1px solid #eee",
          }}
        />

        <h2
          style={{ fontSize: "20px", fontWeight: "700", marginBottom: "20px" }}
        >
          سئو (SEO)
        </h2>

        {/* کلمات کلیدی */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            کلمات کلیدی (Meta Keywords)
          </label>
          <input
            type="text"
            name="metaKeywords"
            value={formData.metaKeywords}
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
            placeholder="باشگاه ورزشی، تناسب اندام، بدنسازی"
          />
        </div>

        {/* توضیحات متا */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            توضیحات (Meta Description)
          </label>
          <textarea
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleChange}
            rows="3"
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
            placeholder="توضیحات مختصر برای موتورهای جستجو..."
          />
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
            marginTop: "20px",
          }}
        >
          <FaSave />
          {loading ? "در حال ذخیره..." : "ذخیره تنظیمات"}
        </button>
      </form>
    </>
  );
}
