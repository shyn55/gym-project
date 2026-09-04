// app/dashboard/page.js
"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaCreditCard,
  FaHistory,
  FaEdit,
} from "react-icons/fa";
import styles from "./dashboard.module.css";
import WorkoutRequests from "@/components/dashboard/WorkoutRequests"; // ← اضافه شد

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
      }
    } catch (error) {
      console.error("خطا در دریافت اطلاعات کاربر:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (session?.user) {
      fetchUserProfile();
    }
  }, [status, session, router, fetchUserProfile]);

  // ===== تابع هدایت به درگاه پرداخت =====
  const handleRenew = () => {
    router.push("/payment/simulate");
  };

  if (status === "loading" || loading || !user) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: "center", padding: "60px 0", color: "#888" }}>
          در حال بارگذاری...
        </div>
      </div>
    );
  }

  // محاسبه جلسات باقی‌مانده
  const remainingSessions =
    user.membership?.totalSessions - user.membership?.usedSessions || 0;
  const isMembershipActive = user.membership?.isActive;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>داشبورد کاربری</h1>

        {/* اطلاعات کاربر */}
        <div className={styles.card}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              <FaUser />
            </div>
            <div>
              <h2>{user.name}</h2>
              <p>{user.email}</p>
              {user.phone && <p>📱 {user.phone}</p>}
            </div>
          </div>
        </div>

        {/* وضعیت عضویت */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>💪 وضعیت عضویت</h3>
          <div className={styles.membershipStatus}>
            <div className={styles.statusBadge}>
              {isMembershipActive ? (
                <span className={styles.active}>✓ فعال</span>
              ) : (
                <span className={styles.inactive}>✗ غیرفعال</span>
              )}
            </div>
            {isMembershipActive && (
              <div className={styles.membershipInfo}>
                <div className={styles.infoItem}>
                  <FaCalendarAlt />
                  <span>
                    شروع:{" "}
                    {new Date(user.membership.startDate).toLocaleDateString(
                      "fa-IR"
                    )}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <FaClock />
                  <span>
                    پایان:{" "}
                    {new Date(user.membership.endDate).toLocaleDateString(
                      "fa-IR"
                    )}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <FaHistory />
                  <span>جلسات باقی‌مانده: {remainingSessions}</span>
                </div>
              </div>
            )}
          </div>

          {!isMembershipActive && (
            <button onClick={handleRenew} className={styles.renewBtn}>
              <FaCreditCard /> تمدید عضویت
            </button>
          )}
          {isMembershipActive && remainingSessions < 5 && (
            <button onClick={handleRenew} className={styles.renewBtn}>
              <FaCreditCard /> تمدید عضویت
            </button>
          )}
        </div>

        {/* آمار تمرین */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h4>جلسات کل</h4>
            <span>{user.membership?.totalSessions || 0}</span>
          </div>
          <div className={styles.statCard}>
            <h4>جلسات استفاده شده</h4>
            <span>{user.membership?.usedSessions || 0}</span>
          </div>
          <div className={styles.statCard}>
            <h4>جلسات باقی‌مانده</h4>
            <span>{remainingSessions}</span>
          </div>
          <div className={styles.statCard}>
            <h4>وضعیت</h4>
            <span className={isMembershipActive ? styles.green : styles.red}>
              {isMembershipActive ? "فعال" : "غیرفعال"}
            </span>
          </div>
        </div>

        {/* ویرایش اطلاعات */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>✏️ ویرایش اطلاعات شخصی</h3>
          <p className={styles.infoText}>
            برای ویرایش اطلاعات به صفحه تنظیمات بروید
          </p>
          <button className={styles.editBtn}>
            <FaEdit /> ویرایش اطلاعات
          </button>
        </div>

        {/* ============================================ */}
        {/* ===== بخش درخواست‌های برنامه تمرینی ===== */}
        {/* ============================================ */}
        <WorkoutRequests />
        {/* ============================================ */}
      </div>
    </div>
  );
}