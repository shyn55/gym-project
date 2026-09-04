// src/app/admin/branches/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaBuilding,
  FaMapMarkerAlt,
  FaPhone,
  FaClock,
} from "react-icons/fa";
import styles from "../admin.module.css";
import Image from "next/image";

export default function BranchesList() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/branches");
        const data = await res.json();

        if (data.success) {
          setBranches(data.data);
        } else {
          setError("خطا در دریافت اطلاعات");
        }
      } catch (err) {
        setError("مشکل در ارتباط با سرور");
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("آیا از حذف این شعبه اطمینان دارید؟")) return;

    try {
      const res = await fetch(`/api/branches/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setBranches(branches.filter((item) => item._id !== id));
      } else {
        alert("خطا در حذف شعبه");
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
  console.log("BRANCH ID:", item._id);
  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          🏢 شعبه‌ها <span>مدیریت</span>
        </h1>
        <Link href="/admin/branches/new" className={styles.btnPrimary}>
          <FaPlus /> افزودن شعبه جدید
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

      {branches.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#888" }}>
          <FaBuilding style={{ fontSize: "48px", opacity: 0.3 }} />
          <p style={{ marginTop: "16px" }}>هیچ شعبه‌ای ثبت نشده است</p>
          <Link
            href="/admin/branches/new"
            className={styles.btnPrimary}
            style={{ display: "inline-block", marginTop: "16px" }}
          >
            افزودن اولین شعبه
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          {branches.map((item) => (
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
              {/* تصویر و عنوان */}
              <div style={{ display: "flex", gap: "16px" }}>
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
                    src={item.image || "/images/branches/default.jpg"}
                    alt={item.name}
                    fill
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      margin: "0 0 4px 0",
                      color: "#2d2926",
                    }}
                  >
                    {item.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#888",
                      margin: "0",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <FaMapMarkerAlt size={12} />
                    {item.address}
                  </p>
                </div>
              </div>

              {/* اطلاعات تماس */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  fontSize: "13px",
                  color: "#555",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <FaPhone size={12} />
                  {item.phone}
                  {item.phone2 && ` | ${item.phone2}`}
                </p>
                <p
                  style={{
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <FaClock size={12} />
                  {item.hours}
                </p>
              </div>

              {/* امکانات */}
              {item.facilities && item.facilities.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "4px",
                    marginTop: "4px",
                  }}
                >
                  {item.facilities.slice(0, 3).map((facility, index) => (
                    <span
                      key={index}
                      style={{
                        background: "#f0f0f0",
                        padding: "2px 10px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        color: "#555",
                      }}
                    >
                      {facility}
                    </span>
                  ))}
                  {item.facilities.length > 3 && (
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#888",
                      }}
                    >
                      +{item.facilities.length - 3} بیشتر
                    </span>
                  )}
                </div>
              )}

              {/* دکمه‌ها */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginTop: "4px",
                }}
              >
                <Link
                  href={`/admin/branches/${item._id}/edit`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    padding: "8px 14px",
                    flex: 1,
                    justifyContent: "center",
                    color: "#000",
                    textDecoration: "none",
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
