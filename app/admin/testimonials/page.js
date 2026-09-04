// src/app/admin/testimonials/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import styles from "../admin.module.css";
import Image from "next/image";

export default function TestimonialsList() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/testimonials");
        const data = await res.json();

        if (data.success) {
          setTestimonials(data.data);
        } else {
          setError("خطا در دریافت اطلاعات");
        }
      } catch (err) {
        setError("مشکل در ارتباط با سرور");
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("آیا از حذف این نظر اطمینان دارید؟")) return;

    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setTestimonials(testimonials.filter((item) => item._id !== id));
      } else {
        alert("خطا در حذف نظر");
      }
    } catch (err) {
      alert("مشکل در ارتباط با سرور");
    }
  };

  const handleToggleApproval = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isApproved: !currentStatus }),
      });
      const data = await res.json();

      if (data.success) {
        setTestimonials(
          testimonials.map((item) =>
            item._id === id ? { ...item, isApproved: !currentStatus } : item,
          ),
        );
      } else {
        alert("خطا در تغییر وضعیت");
      }
    } catch (err) {
      alert("مشکل در ارتباط با سرور");
    }
  };

  // تابع نمایش ستاره‌ها
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} style={{ color: "#f5a623" }} />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" style={{ color: "#f5a623" }} />);
    }
    const remaining = 5 - stars.length;
    for (let i = 0; i < remaining; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} style={{ color: "#ddd" }} />);
    }
    return stars;
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0", color: "#888" }}>
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          ⭐ نظرات <span>مدیریت</span>
        </h1>
        <Link href="/admin/testimonials/new" className={styles.btnPrimary}>
          <FaPlus /> افزودن نظر جدید
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

      {testimonials.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#888" }}>
          <FaStar style={{ fontSize: "48px", opacity: 0.3 }} />
          <p style={{ marginTop: "16px" }}>هیچ نظری ثبت نشده است</p>
          <Link
            href="/admin/testimonials/new"
            className={styles.btnPrimary}
            style={{ display: "inline-block", marginTop: "16px" }}
          >
            افزودن اولین نظر
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          {testimonials.map((item) => (
            <div
              key={item._id}
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "20px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                border: "1px solid #eee",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {/* هدر: نام و وضعیت */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      background: "#f0f0f0",
                      flexShrink: 0,
                    }}
                  >
                    <Image
                      src={item.image || "/images/testimonials/default.jpg"}
                      alt={item.name}
                      width={300}
                      height={200}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        margin: 0,
                        color: "#2d2926",
                      }}
                    >
                      {item.name}
                    </h3>
                    {item.position && (
                      <p
                        style={{
                          fontSize: "13px",
                          color: "#888",
                          margin: "2px 0 0 0",
                        }}
                      >
                        {item.position}
                      </p>
                    )}
                  </div>
                </div>

                {/* دکمه تایید/رد */}
                <button
                  onClick={() =>
                    handleToggleApproval(item._id, item.isApproved)
                  }
                  style={{
                    padding: "4px 12px",
                    borderRadius: "20px",
                    border: "none",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                    background: item.isApproved ? "#d4edda" : "#f8d7da",
                    color: item.isApproved ? "#155724" : "#721c24",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {item.isApproved ? (
                    <>
                      <FaCheck size={12} /> تایید شده
                    </>
                  ) : (
                    <>
                      <FaTimes size={12} /> تایید نشده
                    </>
                  )}
                </button>
              </div>

              {/* ستاره‌ها */}
              <div style={{ display: "flex", gap: "2px", fontSize: "18px" }}>
                {renderStars(item.rating || 5)}
              </div>

              {/* متن نظر */}
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: "1.6",
                  color: "#555",
                  margin: "4px 0 0 0",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {item.comment}
              </p>

              {/* تاریخ */}
              <p
                style={{
                  fontSize: "12px",
                  color: "#aaa",
                  margin: "4px 0 0 0",
                }}
              >
                {new Date(item.createdAt).toLocaleDateString("fa-IR")}
              </p>

              {/* دکمه‌ها */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginTop: "4px",
                }}
              >
                <Link
                  href={`/admin/testimonials/${item._id}/edit`}
                  className={styles.btnSecondary}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    padding: "8px 14px",
                    flex: 1,
                    justifyContent: "center",
                  }}
                >
                  <FaEdit /> ویرایش
                </Link>
                <button
                  onClick={() => handleDelete(item._id)}
                  className={styles.btnDanger}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    padding: "8px 14px",
                  }}
                >
                  <FaTrash /> حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
