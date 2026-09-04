"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowRight, FaSave, FaPlus, FaTimes } from "react-icons/fa";
import styles from "../../admin.module.css";

export default function EditBranchPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [facilityInput, setFacilityInput] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    phone2: "",
    email: "",
    hours: "",
    fridayHours: "",
    holidayHours: "",
    image: "",
    mapLink: "",
    facilities: [],
    isActive: true,
    order: 0,
  });

  // دریافت اطلاعات شعبه
  useEffect(() => {
    const fetchBranch = async () => {
      try {
        const res = await fetch(`/api/branches/${id}`);
        const data = await res.json();

        if (!data.success) {
          setError(data.message || "شعبه پیدا نشد");
          return;
        }

        setFormData({
          name: data.data.name || "",
          address: data.data.address || "",
          phone: data.data.phone || "",
          phone2: data.data.phone2 || "",
          email: data.data.email || "",
          hours: data.data.hours || "",
          fridayHours: data.data.fridayHours || "",
          holidayHours: data.data.holidayHours || "",
          image: data.data.image || "",
          mapLink: data.data.mapLink || "",
          facilities: data.data.facilities || [],
          isActive: data.data.isActive ?? true,
          order: data.data.order || 0,
        });
      } catch (err) {
        setError("خطا در دریافت اطلاعات شعبه");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBranch();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // آپلود تصویر
  const handleImageUpload = async (e) => {
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
    } catch {
      alert("خطا در آپلود تصویر");
    }
  };

  const addFacility = () => {
    if (!facilityInput.trim()) return;

    setFormData((prev) => ({
      ...prev,
      facilities: [...prev.facilities, facilityInput.trim()],
    }));

    setFacilityInput("");
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
    setSaving(true);

    try {
      const res = await fetch(`/api/branches/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/admin/branches");
        router.refresh();
      } else {
        setError(data.message || "خطا در ویرایش شعبه");
      }
    } catch {
      setError("مشکل در ارتباط با سرور");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "40px" }}>در حال دریافت اطلاعات...</div>;
  }

  if (error && !formData.name) {
    return (
      <div style={{ padding: "40px", color: "red" }}>
        {error}
      </div>
    );
  }

  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>✏️ ویرایش شعبه</h1>

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
        {/* نام */}
        <div style={{ marginBottom: "20px" }}>
          <label>نام شعبه *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        {/* آدرس */}
        <div style={{ marginBottom: "20px" }}>
          <label>آدرس *</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        {/* تلفن */}
        <div style={{ marginBottom: "20px" }}>
          <label>شماره تماس *</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        {/* تلفن دوم */}
        <div style={{ marginBottom: "20px" }}>
          <label>شماره تماس دوم</label>
          <input
            type="text"
            name="phone2"
            value={formData.phone2}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        {/* ایمیل */}
        <div style={{ marginBottom: "20px" }}>
          <label>ایمیل</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        {/* ساعت کاری */}
        <div style={{ marginBottom: "20px" }}>
          <label>ساعت کاری روزانه</label>
          <input
            type="text"
            name="hours"
            value={formData.hours}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        {/* جمعه */}
        <div style={{ marginBottom: "20px" }}>
          <label>ساعت کاری جمعه</label>
          <input
            type="text"
            name="fridayHours"
            value={formData.fridayHours}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        {/* تعطیلات */}
        <div style={{ marginBottom: "20px" }}>
          <label>ساعت کاری تعطیلات رسمی</label>
          <input
            type="text"
            name="holidayHours"
            value={formData.holidayHours}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        {/* تصویر */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
            }}
          >
            تصویر شعبه
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={inputStyle}
          />

          {formData.image && (
            <img
              src={formData.image}
              alt="تصویر شعبه"
              style={{
                width: "180px",
                height: "120px",
                objectFit: "cover",
                borderRadius: "10px",
                marginTop: "12px",
                border: "1px solid #ddd",
              }}
            />
          )}
        </div>

        {/* لینک نقشه */}
        <div style={{ marginBottom: "20px" }}>
          <label>لینک نقشه</label>
          <input
            type="text"
            name="mapLink"
            value={formData.mapLink}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        {/* امکانات */}
        <div style={{ marginBottom: "20px" }}>
          <label>امکانات شعبه</label>

          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <input
              type="text"
              value={facilityInput}
              onChange={(e) => setFacilityInput(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ ...inputStyle, flex: 1 }}
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
                    padding: "5px 12px",
                    borderRadius: "20px",
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
                      color: "#ff6b6b",
                      cursor: "pointer",
                    }}
                  >
                    <FaTimes />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ترتیب */}
        <div style={{ marginBottom: "20px" }}>
          <label>ترتیب نمایش</label>
          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        {/* فعال */}
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
              style={{
                width: "18px",
                height: "18px",
                accentColor: "#440099",
              }}
            />
            <span>فعال</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          style={{
            width: "100%",
            padding: "14px",
            background: "#440099",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: "700",
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          <FaSave />
          {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </button>
      </form>
    </>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  fontSize: "15px",
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
  marginTop: "6px",
};