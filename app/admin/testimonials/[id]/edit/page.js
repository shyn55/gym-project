// src/app/admin/testimonials/[id]/edit/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { FaArrowRight, FaSave, FaStar, FaRegStar } from "react-icons/fa";
import styles from "../../../admin.module.css";

export default function EditTestimonialPage() {
  const router = useRouter();
  const params = useParams();
  const testimonialId = params.id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    comment: "",
    rating: 5,
    image: "",
    position: "",
    isApproved: true,
  });

  useEffect(() => {
    const fetchTestimonial = async () => {
      try {
        const res = await fetch(`/api/testimonials/${testimonialId}`);
        const data = await res.json();

        if (data.success) {
          const item = data.data;
          setFormData({
            name: item.name || "",
            comment: item.comment || "",
            rating: item.rating || 5,
            image: item.image || "",
            position: item.position || "",
            isApproved: item.isApproved !== undefined ? item.isApproved : true,
          });
        } else {
          setError("خطا در دریافت اطلاعات");
        }
      } catch (err) {
        setError("مشکل در ارتباط با سرور");
      } finally {
        setFetching(false);
      }
    };

    if (testimonialId) {
      fetchTestimonial();
    }
  }, [testimonialId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRatingClick = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/testimonials/${testimonialId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/admin/testimonials");
      } else {
        setError(data.message || "خطا در ویرایش نظر");
      }
    } catch (err) {
      setError("مشکل در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating, hovered) => {
    return [1, 2, 3, 4, 5].map((star) => {
      const isActive = star <= (hovered || rating);
      return (
        <button
          key={star}
          type="button"
          onClick={() => handleRatingClick(star)}
          onMouseEnter={() => setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(0)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "2px",
            fontSize: "28px",
            color: isActive ? "#f5a623" : "#ddd",
            transition: "color 0.2s ease",
          }}
        >
          {isActive ? <FaStar /> : <FaRegStar />}
        </button>
      );
    });
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
        <h1 className={styles.pageTitle}>✏️ ویرایش نظر</h1>
        <Link href="/admin/testimonials" className={styles.btnSecondary}>
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
        {/* نام */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            نام کاربر <span style={{ color: "red" }}>*</span>
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
            }}
          />
        </div>

        {/* موقعیت شغلی */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            موقعیت شغلی
          </label>
          <input
            type="text"
            name="position"
            value={formData.position}
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

        {/* نظر */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            نظر کاربر <span style={{ color: "red" }}>*</span>
          </label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            rows="4"
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
          />
        </div>

        {/* امتیاز */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "8px",
              color: "#333",
            }}
          >
            امتیاز
          </label>
          <div style={{ display: "flex", gap: "4px" }}>
            {renderStars(formData.rating, hoveredRating)}
            <span
              style={{
                marginRight: "12px",
                fontSize: "16px",
                fontWeight: "600",
                color: "#555",
              }}
            >
              {formData.rating} از ۵
            </span>
          </div>
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
            آدرس تصویر کاربر
          </label>
          {/* تصویر کاربر */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom: "6px",
                color: "#333",
              }}
            >
              تصویر کاربر
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const uploadData = new FormData();
                uploadData.append("file", file);

                try {
                  const res = await fetch("/api/upload", {
                    method: "POST",
                    body: uploadData,
                  });

                  const data = await res.json();

                  if (data.success) {
                    setFormData((prev) => ({
                      ...prev,
                      image: data.url,
                    }));
                  } else {
                    alert(data.message || "خطا در آپلود تصویر");
                  }
                } catch (error) {
                  alert("خطا در آپلود تصویر");
                }
              }}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                fontSize: "15px",
                fontFamily: "inherit",
                outline: "none",
                boxSizing: "border-box",
              }}
            />

            {formData.image && (
              <div
                style={{
                  marginTop: "12px",
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid #eee",
                }}
              >
                <img
                  src={formData.image}
                  alt="تصویر کاربر"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* وضعیت تایید */}
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
              name="isApproved"
              checked={formData.isApproved}
              onChange={handleChange}
              style={{ width: "18px", height: "18px", accentColor: "#440099" }}
            />
            <span style={{ fontWeight: "500", color: "#333" }}>
              تایید شده (نمایش در سایت)
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
          {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </button>
      </form>
    </>
  );
}
