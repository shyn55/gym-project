// app/training-request/page.js
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./training-request.module.css";

export default function TrainingRequestPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // پیش‌نمایش تصاویر
  const [frontPreview, setFrontPreview] = useState(null);
  const [backPreview, setBackPreview] = useState(null);
  const [sidePreview, setSidePreview] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "مرد",
    height: "",
    weight: "",
    goal: "تناسب اندام",
    description: "",
    frontImage: "",
    backImage: "",
    sideImage: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("حجم عکس نباید بیشتر از ۲ مگابایت باشد");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target.result;
      setFormData((prev) => ({ ...prev, [type]: base64String }));

      if (type === "frontImage") setFrontPreview(base64String);
      else if (type === "backImage") setBackPreview(base64String);
      else if (type === "sideImage") setSidePreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/workout/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          fullName: formData.fullName || session?.user?.name,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setSuccess("✅ درخواست شما با موفقیت ثبت شد!");
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        setError(data.message || "خطا در ثبت درخواست");
      }
    } catch (err) {
      setError("مشکل در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>📋 درخواست برنامه تمرینی</h1>
        <p className={styles.subtitle}>
          اطلاعات خود را وارد کنید تا مربی بتواند بهترین برنامه را برای شما طراحی کند
        </p>

        {error && <div className={styles.errorBox}>❌ {error}</div>}
        {success && <div className={styles.successBox}>✅ {success}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* اطلاعات شخصی */}
          <div className={styles.section}>
            <h3>👤 اطلاعات شخصی</h3>

            <div className={styles.row}>
              <div className={styles.field}>
                <label>نام کامل</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder={session?.user?.name || "نام کامل"}
                />
              </div>
              <div className={styles.field}>
                <label>سن</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  placeholder="مثال: ۲۵"
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label>جنسیت</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="مرد">مرد</option>
                  <option value="زن">زن</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>هدف</label>
                <select name="goal" value={formData.goal} onChange={handleChange}>
                  <option value="تناسب اندام">تناسب اندام</option>
                  <option value="افزایش وزن">افزایش وزن</option>
                  <option value="کاهش وزن">کاهش وزن</option>
                  <option value="افزایش قدرت">افزایش قدرت</option>
                  <option value="افزایش استقامت">افزایش استقامت</option>
                </select>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label>قد (سانتی‌متر)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  required
                  placeholder="مثال: ۱۷۵"
                />
              </div>
              <div className={styles.field}>
                <label>وزن (کیلوگرم)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                  placeholder="مثال: ۷۰"
                />
              </div>
            </div>
          </div>

          {/* تصاویر */}
          <div className={styles.section}>
            <h3>📸 تصاویر بدن</h3>
            <p className={styles.hint}>
              برای بررسی بهتر وضعیت بدن، تصاویر خود را آپلود کنید
            </p>

            <div className={styles.imageGrid}>
              <div className={styles.imageUpload}>
                <label>جلو</label>
                <div
                  className={styles.uploadBox}
                  onClick={() => document.getElementById("frontImage").click()}
                >
                  {frontPreview ? (
                    <Image
                      src={frontPreview}
                      alt="جلو"
                      width={200}
                      height={200}
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div className={styles.placeholder}>📷</div>
                  )}
                  <input
                    type="file"
                    id="frontImage"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "frontImage")}
                    style={{ display: "none" }}
                  />
                </div>
              </div>

              <div className={styles.imageUpload}>
                <label>پشت</label>
                <div
                  className={styles.uploadBox}
                  onClick={() => document.getElementById("backImage").click()}
                >
                  {backPreview ? (
                    <Image
                      src={backPreview}
                      alt="پشت"
                      width={200}
                      height={200}
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div className={styles.placeholder}>📷</div>
                  )}
                  <input
                    type="file"
                    id="backImage"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "backImage")}
                    style={{ display: "none" }}
                  />
                </div>
              </div>

              <div className={styles.imageUpload}>
                <label>کنار</label>
                <div
                  className={styles.uploadBox}
                  onClick={() => document.getElementById("sideImage").click()}
                >
                  {sidePreview ? (
                    <Image
                      src={sidePreview}
                      alt="کنار"
                      width={200}
                      height={200}
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div className={styles.placeholder}>📷</div>
                  )}
                  <input
                    type="file"
                    id="sideImage"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "sideImage")}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* توضیحات */}
          <div className={styles.section}>
            <h3>📝 توضیحات اضافی</h3>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="هر گونه توضیح اضافی، محدودیت‌ها یا نیازهای خاص..."
              className={styles.textarea}
            />
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? "در حال ثبت..." : "ارسال درخواست"}
          </button>
        </form>
      </div>
    </div>
  );
}