"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewExercisePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    // فیلدهای فرمت اینجا، مثلاً:
    name: "",
    muscles: [],
    isActive: true,
    // ...
  });
  const [videoFile, setVideoFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ===== تابع ارسال فرم =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "muscles") {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === "videoFile") {
          // این فیلد بعداً اضافه می‌شود
        } else if (key === "isActive") {
          formDataToSend.append(key, String(formData[key]));
        } else {
          formDataToSend.append(key, formData[key] || "");
        }
      });

      if (videoFile) {
        formDataToSend.append("videoFile", videoFile);
      }

      const res = await fetch("/api/exercises", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await res.json();

      if (data.success) {
        router.push("/coach-dashboard/exercises");
      } else {
        setError(data.message || "خطا در افزودن حرکت");
      }
    } catch (err) {
      setError("مشکل در ارتباط با سرور: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* فرم واقعی اینجا با input ها و... */}
      <form onSubmit={handleSubmit}>
        {/* فیلدهای فرم */}
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}