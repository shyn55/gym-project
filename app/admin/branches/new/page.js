// src/app/admin/branches/new/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowRight, FaSave, FaPlus, FaTimes } from "react-icons/fa";
import styles from "../../admin.module.css";

export default function NewBranchPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [facilityInput, setFacilityInput] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    phone2: "",
    email: "",
    hours: "۸:۰۰ - ۲۳:۰۰",
    fridayHours: "تعطیل",
    holidayHours: "۱۹:۰۰ - ۲۳:۰۰",
    image: "/images/branches/default.jpg",
    mapLink: "",
    facilities: [],
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

  const addFacility = () => {
    if (facilityInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        facilities: [...prev.facilities, facilityInput.trim()],
      }));
      setFacilityInput("");
    }
  };

  const removeFacility = (index) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((_, i) => i !== index),
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFacility();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/branches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/admin/branches");
      } else {
        setError(data.message || "خطا در افزودن شعبه");
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
        <h1 className={styles.pageTitle}>🏢 افزودن شعبه جدید</h1>
        <Link href="/admin/branches" className={styles.btnSecondary}>
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
        {/* نام شعبه */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            نام شعبه <span style={{ color: "red" }}>*</span>
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
            placeholder="مثال: شعبه مرکزی"
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
            آدرس <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
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
            placeholder="مثال: کرج، مهرشهر، فاز ۴"
          />
        </div>

        {/* شماره تماس */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            شماره تماس <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
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
            placeholder="مثال: ۰۲۶-۳۳۵۲۱۹۲۲"
          />
        </div>

        {/* شماره تماس دوم */}
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
            placeholder="مثال: ۰۹۱۰-۰۰۵۸۵۷۰"
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
            type="email"
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
            placeholder="info@empiregym.ir"
          />
        </div>

        {/* ساعت کاری */}
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
            name="hours"
            value={formData.hours}
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
            placeholder="۸:۰۰ - ۲۳:۰۰"
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
            placeholder="تعطیل"
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
            placeholder="۱۹:۰۰ - ۲۳:۰۰"
          />
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
            آدرس تصویر شعبه
          </label>
          <input
            type="text"
            name="image"
            value={formData.image}
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
            placeholder="/images/branches/branch.jpg"
          />
        </div>

        {/* لینک نقشه */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            لینک نقشه
          </label>
          <input
            type="text"
            name="mapLink"
            value={formData.mapLink}
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
            placeholder="https://nshn.ir/..."
          />
        </div>

        {/* امکانات */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#333",
            }}
          >
            امکانات شعبه
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              value={facilityInput}
              onChange={(e) => setFacilityInput(e.target.value)}
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
              placeholder="مثال: سونا و جکوزی"
            />
            <button
              type="button"
              onClick={addFacility}
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

          {formData.facilities.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginTop: "12px",
              }}
            >
              {formData.facilities.map((facility, index) => (
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
                  {facility}
                  <button
                    type="button"
                    onClick={() => removeFacility(index)}
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
          {loading ? "در حال ثبت..." : "افزودن شعبه"}
        </button>
      </form>
    </>
  );
}