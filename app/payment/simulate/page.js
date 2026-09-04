// app/payment/simulate/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./payment.module.css";

export default function PaymentSimulatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // ===== تابع پرداخت =====
  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      // ۱. شبیه‌سازی پرداخت (تأخیر ۲ ثانیه)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // ۲. ارسال درخواست تمدید عضویت به سرور
      const res = await fetch("/api/user/renew-membership", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: "برنز", // یا هر پلنی که کاربر انتخاب کرده
          duration: 30, // ۳۰ روز
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        // بعد از ۲ ثانیه هدایت به داشبورد
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        setError(data.message || "خطا در تمدید عضویت");
        setLoading(false);
      }
    } catch (err) {
      setError("مشکل در ارتباط با سرور");
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>💳 درگاه پرداخت</h1>
          <p className={styles.subtitle}>
            تمدید عضویت باشگاه امپراطور
          </p>

          <div className={styles.priceBox}>
            <span>مبلغ قابل پرداخت</span>
            <strong>۱,۵۰۰,۰۰۰ تومان</strong>
          </div>

          <div className={styles.details}>
            <p>📌 پلن: برنز</p>
            <p>📅 مدت: ۳۰ روز</p>
            <p>✅ جلسات: هر روز</p>
          </div>

          {error && (
            <div className={styles.errorBox}>
              ❌ {error}
            </div>
          )}

          {success ? (
            <div className={styles.successBox}>
              <p>✅ پرداخت با موفقیت انجام شد!</p>
              <p>🔄 عضویت شما تمدید شد. به داشبورد هدایت می‌شوید...</p>
            </div>
          ) : (
            <>
              <button
                onClick={handlePayment}
                disabled={loading}
                className={styles.payBtn}
              >
                {loading ? "در حال پردازش..." : "پرداخت"}
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className={styles.cancelBtn}
                disabled={loading}
              >
                بازگشت به داشبورد
              </button>
            </>
          )}

          <p className={styles.note}>
            🔮 این یک شبیه‌سازی است. در نسخه نهایی به درگاه واقعی متصل می‌شود.
          </p>
        </div>
      </div>
    </div>
  );
}