// ===== تابع ارسال فرم =====
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    // ساخت FormData برای ارسال فایل
    const formDataToSend = new FormData();

    // اضافه کردن فیلدهای متنی
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

    // اضافه کردن فایل فیلم
    if (videoFile) {
      formDataToSend.append("videoFile", videoFile);
    }

    console.log("📤 ارسال فرم به سرور...");
    
    const res = await fetch("/api/exercises", {
      method: "POST",
      body: formDataToSend,
    });

    console.log("📡 پاسخ:", res.status);

    const data = await res.json();
    console.log("📦 داده:", data);

    if (data.success) {
      router.push("/coach-dashboard/exercises");
    } else {
      setError(data.message || "خطا در افزودن حرکت");
    }
  } catch (err) {
    console.error("❌ خطا:", err);
    setError("مشکل در ارتباط با سرور: " + err.message);
  } finally {
    setLoading(false);
  }
};