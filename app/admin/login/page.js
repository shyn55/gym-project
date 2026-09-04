// src/app/admin/login/page.js
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("نام کاربری یا رمز عبور اشتباه است");
      } else {
        router.push("/admin");
      }
    } catch (err) {
      setError("مشکل در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1a1a2e, #2d1b4e)",
        padding: "20px",
        margin: 0,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "40px",
          borderRadius: "24px",
          maxWidth: "400px",
          width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "900", color: "#2d2926", margin: 0 }}>
            ⚡ امپراطور
          </h1>
          <p style={{ color: "#888", marginTop: "8px" }}>ورود به پنل مدیریت</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#333",
              }}
            >
              نام کاربری
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #ddd",
                borderRadius: "12px",
                fontSize: "16px",
                fontFamily: "inherit",
                outline: "none",
                transition: "border 0.3s ease",
              }}
              required
              autoFocus
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#333",
              }}
            >
              رمز عبور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #ddd",
                borderRadius: "12px",
                fontSize: "16px",
                fontFamily: "inherit",
                outline: "none",
                transition: "border 0.3s ease",
              }}
              required
            />
          </div>

          {error && (
            <div
              style={{
                color: "red",
                padding: "12px",
                background: "#ffe0e0",
                borderRadius: "12px",
                marginBottom: "16px",
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

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
            }}
          >
            {loading ? "در حال ورود..." : "ورود به پنل مدیریت"}
          </button>
        </form>
      </div>
    </div>
  );
}