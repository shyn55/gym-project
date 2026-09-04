// app/coach-dashboard/page.js
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import styles from "./coach-dashboard.module.css";

export default function CoachDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated" && session?.user?.role !== "coach") {
      router.push("/dashboard");
      return;
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>در حال بارگذاری...</p>
      </div>
    );
  }

  const coach = session?.user;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* هدر */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>🧑‍🏫 پنل <span>مربی</span></h1>
            <p className={styles.subtitle}>به پنل مدیریت خود خوش آمدید</p>
          </div>
          <button
            onClick={() => router.push("/")}
            className={styles.logoutBtn}
          >
            <FaSignOutAlt /> خروج
          </button>
        </div>

        {/* اطلاعات مربی */}
        <div className={styles.coachInfo}>
          <div className={styles.coachAvatar}>
            <FaUser />
          </div>
          <div className={styles.coachDetails}>
            <h2>{coach?.name}</h2>
            <p>
              <span className={styles.specialty}>مربی</span>
            </p>
            <p style={{ fontSize: "13px", color: "#aaa" }}>{coach?.email}</p>
          </div>
        </div>

        {/* ===== کارت‌های دسترسی (همه لینک‌دار) ===== */}
        <div className={styles.cards}>
          <Link href="/coach-dashboard/requests" className={styles.card}>
            <span className={styles.cardIcon}>📋</span>
            <h3>درخواست‌های تمرینی</h3>
            <p>مشاهده و مدیریت درخواست‌ها</p>
          </Link>

          <Link href="/coach-dashboard/exercises" className={styles.card}>
            <span className={styles.cardIcon}>🏋️</span>
            <h3>حرکات تمرینی</h3>
            <p>مدیریت حرکات</p>
          </Link>

          <Link href="/coach-dashboard/users" className={styles.card}>
            <span className={styles.cardIcon}>👥</span>
            <h3>کاربران</h3>
            <p>مشاهده لیست کاربران</p>
          </Link>

          <Link href="/coach-dashboard/comments" className={styles.card}>
            <span className={styles.cardIcon}>⭐</span>
            <h3>نظرات</h3>
            <p>مشاهده و پاسخ به نظرات</p>
          </Link>
        </div>
      </div>
    </div>
  );
}