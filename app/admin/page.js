// src/app/admin/page.js
import styles from "./admin.module.css";

export default function AdminDashboard() {
  return (
    <>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>📊 داشبورد</h1>
      </div>
      <div style={{ textAlign: "center", padding: "60px 0", color: "#888" }}>
        <p style={{ fontSize: "18px" }}>به پنل مدیریت باشگاه امپراطور خوش آمدید</p>
        <p style={{ fontSize: "14px" }}>از منوی سمت راست بخش مورد نظر را انتخاب کنید</p>
      </div>
    </>
  );
}