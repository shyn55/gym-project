"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaSave, FaArrowRight, FaSpinner } from "react-icons/fa";

export default function EditBlog() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    image: "",
    isPublished: false,
  });

  // دریافت اطلاعات مقاله
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/blog/${id}`);
        const data = await res.json();

        if (data.success) {
          setFormData({
            title: data.data.title || "",
            content: data.data.content || "",
            category: data.data.category || "",
            image: data.data.image || "",
            isPublished: data.data.isPublished || false,
          });
        } else {
          setError(data.message || "مقاله پیدا نشد");
        }
      } catch (error) {
        setError("مشکل در دریافت اطلاعات مقاله");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  // تغییر مقادیر فرم
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ذخیره تغییرات
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const res = await fetch(`/api/blog/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        alert("مقاله با موفقیت ویرایش شد");

        router.push("/admin/blog");
        router.refresh();
      } else {
        setError(data.message || "خطا در ذخیره تغییرات");
      }
    } catch (error) {
      setError("مشکل در ارتباط با سرور");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "80px 0",
          color: "#888",
        }}
      >
        <FaSpinner
          style={{
            fontSize: "30px",
            animation: "spin 1s linear infinite",
          }}
        />

        <p style={{ marginTop: "15px" }}>در حال دریافت اطلاعات مقاله...</p>
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "80px 0",
        }}
      >
        <p style={{ color: "red", marginBottom: "20px" }}>{error}</p>

        <Link
          href="/admin/blog"
          style={{
            padding: "10px 20px",
            background: "#333",
            color: "#fff",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          بازگشت به مقالات
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      {/* هدر */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              color: "#2d2926",
            }}
          >
            ✏️ ویرایش مقاله
          </h1>

          <p
            style={{
              color: "#888",
              marginTop: "8px",
            }}
          >
            اطلاعات مقاله را ویرایش کنید
          </p>
        </div>

        <Link
          href="/admin/blog"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
            color: "#555",
          }}
        >
          <FaArrowRight />
          بازگشت
        </Link>
      </div>

      {/* پیام خطا */}
      {error && (
        <div
          style={{
            background: "#ffe0e0",
            color: "#b00020",
            padding: "14px",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {/* فرم */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 2px 15px rgba(0,0,0,0.08)",
          border: "1px solid #eee",
        }}
      >
        {/* عنوان */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
            }}
          >
            عنوان مقاله
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "15px",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* دسته بندی */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
            }}
          >
            دسته‌بندی
          </label>

          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="مثلاً آموزش Next.js"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "15px",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* لینک تصویر */}
        {/* تصویر مقاله */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
            }}
          >
            تصویر مقاله
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
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />

          {/* پیش نمایش */}
          <div
            style={{
              marginTop: "15px",
              width: "200px",
              height: "120px",
              position: "relative",
              borderRadius: "10px",
              overflow: "hidden",
              background: "#f2f2f2",
            }}
          >
            <Image
              src={formData.image || "/images/blog/default.jpg"}
              alt="پیش نمایش مقاله"
              fill
              style={{
                objectFit: "cover",
              }}
            />
          </div>
        </div>

        {/* متن مقاله */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
            }}
          >
            متن مقاله
          </label>

          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={15}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "15px",
              resize: "vertical",
              boxSizing: "border-box",
              lineHeight: "1.8",
            }}
          />
        </div>

        {/* وضعیت انتشار */}
        <div
          style={{
            marginBottom: "25px",
            padding: "15px",
            background: "#f8f8f8",
            borderRadius: "10px",
          }}
        >
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
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              style={{
                width: "18px",
                height: "18px",
                cursor: "pointer",
              }}
            />

            <span>انتشار مقاله</span>
          </label>

          <p
            style={{
              margin: "8px 0 0",
              fontSize: "13px",
              color: "#888",
            }}
          >
            در صورت فعال بودن، مقاله برای کاربران قابل مشاهده خواهد بود.
          </p>
        </div>

        {/* دکمه ها */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "flex-start",
          }}
        >
          <button
            type="submit"
            disabled={saving}
            style={{
              border: "none",
              background: saving ? "#aaa" : "#2d2926",
              color: "#fff",
              padding: "12px 22px",
              borderRadius: "8px",
              cursor: saving ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "15px",
            }}
          >
            {saving ? (
              <>
                <FaSpinner />
                در حال ذخیره...
              </>
            ) : (
              <>
                <FaSave />
                ذخیره تغییرات
              </>
            )}
          </button>

          <Link
            href="/admin/blog"
            style={{
              padding: "12px 22px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              textDecoration: "none",
              color: "#555",
            }}
          >
            انصراف
          </Link>
        </div>
      </form>
    </div>
  );
}
