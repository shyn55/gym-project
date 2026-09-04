// src/app/admin/pricing/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaPlus, FaEdit, FaTrash, FaCoins } from "react-icons/fa";
import styles from "../admin.module.css";

export default function PricingList() {
  const [pricing, setPricing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/pricing");
        const data = await res.json();

        if (data.success) {
          setPricing(data.data);
        } else {
          setError("خطا در دریافت اطلاعات");
        }
      } catch (err) {
        setError("مشکل در ارتباط با سرور");
      } finally {
        setLoading(false);
      }
    };
    fetchPricing();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("آیا از حذف این پلن اطمینان دارید؟")) return;

    try {
      const res = await fetch(`/api/pricing/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setPricing(pricing.filter((item) => item._id !== id));
      } else {
        alert("خطا در حذف پلن");
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
          💰 قیمت‌ها <span>مدیریت</span>
        </h1>
        <Link href="/admin/pricing/new" className={styles.btnPrimary}>
          <FaPlus /> افزودن پلن جدید
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

      {pricing.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#888" }}>
          <FaCoins style={{ fontSize: "48px", opacity: 0.3 }} />
          <p style={{ marginTop: "16px" }}>هیچ پلن قیمتی ثبت نشده است</p>
          <Link
            href="/admin/pricing/new"
            className={styles.btnPrimary}
            style={{ display: "inline-block", marginTop: "16px" }}
          >
            افزودن اولین پلن
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {pricing.map((item) => (
            <div
              key={item._id}
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                border: item.badge
                  ? `2px solid ${item.color || "#440099"}`
                  : "1px solid #eee",
                position: "relative",
              }}
            >
              {item.badge && (
                <div
                  style={{
                    position: "absolute",
                    top: "-10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: item.color || "#440099",
                    color: "#fff",
                    fontSize: "12px",
                    padding: "2px 16px",
                    borderRadius: "20px",
                    fontWeight: "700",
                  }}
                >
                  {item.badge}
                </div>
              )}

              <div style={{ textAlign: "center", marginBottom: "12px" }}>
                <h3 style={{ fontSize: "22px", fontWeight: "800", margin: 0 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "14px", color: "#888", margin: "4px 0" }}>
                  {item.subtitle}
                </p>
                <div style={{ margin: "8px 0" }}>
                  <span style={{ fontSize: "28px", fontWeight: "900" }}>
                    {item.price}
                  </span>
                  <span style={{ fontSize: "14px", color: "#888" }}>
                    /{item.period}
                  </span>
                </div>
              </div>

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 0 16px 0",
                  textAlign: "center",
                }}
              >
                {item.features?.map((feature, index) => (
                  <li
                    key={index}
                    style={{
                      padding: "4px 0",
                      fontSize: "14px",
                      color: "#555",
                    }}
                  >
                    ✅ {feature}
                  </li>
                ))}
              </ul>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: "center",
                }}
              >
                <Link
                  href={`/admin/pricing/${item._id}/edit`}
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
                  onClick={() => handleDelete(item._id)}
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
