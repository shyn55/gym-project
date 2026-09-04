// src/app/admin/coaches/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaPlus, FaEdit, FaTrash, FaUser } from "react-icons/fa";
import styles from "../admin.module.css";

export default function CoachesList() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // دریافت لیست مربیان

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/coaches");
        const data = await res.json();

        if (data.success) {
          setCoaches(data.data);
        } else {
          setError("خطا در دریافت اطلاعات");
        }
      } catch (err) {
        setError("مشکل در ارتباط با سرور");
      } finally {
        setLoading(false);
      }
    };
    fetchCoaches();
  }, []);

  // حذف مربی
  const handleDelete = async (id) => {
    if (!confirm("آیا از حذف این مربی اطمینان دارید؟")) return;

    try {
      const res = await fetch(`/api/coaches/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setCoaches(coaches.filter((coach) => coach._id !== id));
      } else {
        alert("خطا در حذف مربی");
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
          🏋️ مربیان <span>مدیریت</span>
        </h1>
        <Link href="/admin/coaches/new" className={styles.btnPrimary}>
          <FaPlus /> افزودن مربی جدید
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

      {coaches.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#888" }}>
          <FaUser style={{ fontSize: "48px", opacity: 0.3 }} />
          <p style={{ marginTop: "16px" }}>هیچ مربی ثبت نشده است</p>
          <Link
            href="/admin/coaches/new"
            className={styles.btnPrimary}
            style={{ display: "inline-block", marginTop: "16px" }}
          >
            افزودن اولین مربی
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "24px",
          }}
        >
          {coaches.map((coach) => (
            <div
              key={coach._id}
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "20px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                textAlign: "center",
                transition: "all 0.3s ease",
              }}
            >
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  margin: "0 auto 12px",
                  background: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {coach.image ? (
                  <Image
                    src={coach.image}
                    alt={coach.name}
                    width={100}
                    height={100}
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <FaUser style={{ fontSize: "40px", color: "#ccc" }} />
                )}
              </div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  margin: "0 0 4px 0",
                }}
              >
                {coach.name}
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "#888",
                  margin: "0 0 16px 0",
                }}
              >
                {coach.specialty}
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "center",
                }}
              >
                <Link
                  href={`/admin/coaches/${coach._id}/edit`}
                  className={styles.btnSecondary}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <FaEdit /> ویرایش
                </Link>
                <button
                  onClick={() => handleDelete(coach._id)}
                  className={styles.btnDanger}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
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
