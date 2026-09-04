// src/app/admin/blog/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaPlus, FaEdit, FaTrash, FaNewspaper, FaEye } from "react-icons/fa";
import styles from "../admin.module.css";
import Image from "next/image";
export default function BlogList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/blog");
        const data = await res.json();

        if (data.success) {
          setArticles(data.data);
        } else {
          setError("خطا در دریافت اطلاعات");
        }
      } catch (err) {
        setError("مشکل در ارتباط با سرور");
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("آیا از حذف این مقاله اطمینان دارید؟")) return;

    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setArticles(articles.filter((item) => item._id !== id));
      } else {
        alert("خطا در حذف مقاله");
      }
    } catch (err) {
      alert("مشکل در ارتباط با سرور");
    }
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
          📝 مقالات <span>مدیریت</span>
        </h1>
        <Link href="/admin/blog/new" className={styles.btnPrimary}>
          <FaPlus /> افزودن مقاله جدید
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

      {articles.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#888" }}>
          <FaNewspaper style={{ fontSize: "48px", opacity: 0.3 }} />
          <p style={{ marginTop: "16px" }}>هیچ مقاله‌ای ثبت نشده است</p>
          <Link
            href="/admin/blog/new"
            className={styles.btnPrimary}
            style={{ display: "inline-block", marginTop: "16px" }}
          >
            نوشتن اولین مقاله
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {articles.map((item) => (
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
                gap: "8px",
              }}
            >
              {/* تصویر و وضعیت */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    background: "#f0f0f0",
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src={item.image || "/images/blog/default.jpg"}
                    alt={item.title}
                    width={300}
                    height={200}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    padding: "2px 12px",
                    borderRadius: "20px",
                    background: item.isPublished ? "#d4edda" : "#f8d7da",
                    color: item.isPublished ? "#155724" : "#721c24",
                    fontWeight: "600",
                  }}
                >
                  {item.isPublished ? "✅ منتشر شده" : "❌ پیش‌نویس"}
                </span>
              </div>

              {/* عنوان */}
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  margin: "8px 0 0 0",
                  color: "#2d2926",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {item.title}
              </h3>

              {/* دسته‌بندی و بازدید */}
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  fontSize: "13px",
                  color: "#888",
                }}
              >
                <span>📂 {item.category || "عمومی"}</span>
                <span>
                  <FaEye style={{ marginLeft: "4px" }} /> {item.viewCount || 0}
                </span>
              </div>

              {/* دکمه‌ها */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginTop: "8px",
                }}
              >
                <Link
                  href={`/admin/blog/${item._id}/edit`}
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
