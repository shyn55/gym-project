// src/app/admin/gallery/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaImages,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import styles from "../admin.module.css";
import Image from "next/image";

export default function GalleryList() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/gallery");
        const data = await res.json();

        if (data.success) {
          setImages(data.data);
        } else {
          setError("خطا در دریافت اطلاعات");
        }
      } catch (err) {
        setError("مشکل در ارتباط با سرور");
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("آیا از حذف این تصویر اطمینان دارید؟")) return;

    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setImages(images.filter((item) => item._id !== id));
      } else {
        alert("خطا در حذف تصویر");
      }
    } catch (err) {
      alert("مشکل در ارتباط با سرور");
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      const data = await res.json();

      if (data.success) {
        setImages(
          images.map((item) =>
            item._id === id ? { ...item, isActive: !currentStatus } : item,
          ),
        );
      } else {
        alert("خطا در تغییر وضعیت");
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
          🖼️ گالری <span>مدیریت</span>
        </h1>
        <Link href="/admin/gallery/new" className={styles.btnPrimary}>
          <FaPlus /> افزودن تصویر جدید
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

      {images.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#888" }}>
          <FaImages style={{ fontSize: "48px", opacity: 0.3 }} />
          <p style={{ marginTop: "16px" }}>هیچ تصویری در گالری ثبت نشده است</p>
          <Link
            href="/admin/gallery/new"
            className={styles.btnPrimary}
            style={{ display: "inline-block", marginTop: "16px" }}
          >
            افزودن اولین تصویر
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {images.map((item) => (
            <div
              key={item._id}
              style={{
                background: "#fff",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                border: "1px solid #eee",
                position: "relative",
              }}
            >
              {/* تصویر */}
              <div
                style={{
                  width: "100%",
                  height: "180px",
                  overflow: "hidden",
                  background: "#f0f0f0",
                  position: "relative",
                }}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                {/* وضعیت فعال/غیرفعال */}
                <button
                  onClick={() => handleToggleActive(item._id, item.isActive)}
                  style={{
                    position: "absolute",
                    top: "8px",
                    left: "8px",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    border: "none",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                    background: item.isActive ? "#d4edda" : "#f8d7da",
                    color: item.isActive ? "#155724" : "#721c24",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {item.isActive ? (
                    <FaEye size={12} />
                  ) : (
                    <FaEyeSlash size={12} />
                  )}
                  {item.isActive ? "فعال" : "غیرفعال"}
                </button>
              </div>

              {/* اطلاعات */}
              <div style={{ padding: "12px 16px 16px 16px" }}>
                <h3
                  style={{
                    fontSize: "15px",
                    fontWeight: "700",
                    margin: "0 0 4px 0",
                    color: "#2d2926",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#888",
                    margin: "0 0 12px 0",
                  }}
                >
                  📂 {item.category || "عمومی"}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                  }}
                >
                  <Link
                    href={`/admin/gallery/${item._id}/edit`}
                    className={styles.btnSecondary}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "12px",
                      padding: "6px 12px",
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
                      fontSize: "12px",
                      padding: "6px 12px",
                    }}
                  >
                    <FaTrash /> حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
