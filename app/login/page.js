// app/login/page.js
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./auth.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("ایمیل یا رمز عبور اشتباه است");
        setLoading(false);
        return;
      }

      // ===== دریافت سشن برای تشخیص نقش =====
      const res = await fetch("/api/auth/session");
      const session = await res.json();

      if (session?.user) {
        const role = session.user.role || "member";
        console.log("🔍 نقش کاربر:", role);

        // هدایت بر اساس نقش
        switch (role) {
          case "super_admin":
          case "admin":
            router.push("/admin");
            break;
          case "coach":
            router.push("/coach-dashboard");
            break;
          default:
            router.push("/dashboard");
            break;
        }
      } else {
        router.push("/dashboard");
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
          <h1 className={styles.title}>ورود به حساب کاربری</h1>
          <p className={styles.subtitle}>خوش آمدید! لطفاً وارد شوید</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label>ایمیل</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
              />
            </div>

            <div className={styles.field}>
              <label>رمز عبور</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={styles.submitBtn}
            >
              {loading ? "در حال ورود..." : "ورود"}
            </button>
          </form>

          <p className={styles.footer}>
            حساب کاربری ندارید؟ <Link href="/register">ثبت‌نام کنید</Link>
          </p>
        </div>
      </div>
    </div>
  );
}