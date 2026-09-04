// components/dashboard/WorkoutRequests.jsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaFileAlt,
  FaEye,
  FaSpinner,
} from "react-icons/fa";
import styles from "./WorkoutRequests.module.css";

export default function WorkoutRequests() {
  const { data: session } = useSession();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session?.user) {
      fetchRequests();
    }
  }, [session]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/workout/user-requests");
      const data = await res.json();
      if (data.success) {
        setRequests(data.data);
      } else {
        setError("خطا در دریافت اطلاعات");
      }
    } catch (err) {
      setError("مشکل در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  // وضعیت‌ها
  const getStatusInfo = (status) => {
    const statusMap = {
      pending: {
        label: "در انتظار بررسی",
        icon: <FaClock />,
        className: styles.statusPending,
      },
      in_progress: {
        label: "در حال بررسی",
        icon: <FaSpinner className={styles.spin} />,
        className: styles.statusProgress,
      },
      completed: {
        label: "تکمیل شده",
        icon: <FaCheckCircle />,
        className: styles.statusCompleted,
      },
      rejected: {
        label: "رد شده",
        icon: <FaTimesCircle />,
        className: styles.statusRejected,
      },
    };
    return statusMap[status] || statusMap.pending;
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>در حال بارگذاری درخواست‌ها...</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className={styles.empty}>
        <FaFileAlt className={styles.emptyIcon} />
        <p>شما هنوز درخواست برنامه تمرینی ثبت نکرده‌اید</p>
        <Link href="/training-request" className={styles.requestBtn}>
          ثبت درخواست جدید
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>📋 درخواست‌های برنامه تمرینی</h3>
        <Link href="/training-request" className={styles.newRequestBtn}>
          + درخواست جدید
        </Link>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.requestsList}>
        {requests.map((req) => {
          const statusInfo = getStatusInfo(req.status);
          return (
            <div key={req._id} className={styles.requestCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardInfo}>
                  <span className={styles.date}>
                    {new Date(req.createdAt).toLocaleDateString("fa-IR")}
                  </span>
                  <span className={styles.goal}>{req.goal}</span>
                </div>
                <span className={`${styles.statusBadge} ${statusInfo.className}`}>
                  {statusInfo.icon}
                  {statusInfo.label}
                </span>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.stats}>
                  <span>📏 قد: {req.height} سانتی‌متر</span>
                  <span>⚖️ وزن: {req.weight} کیلوگرم</span>
                  <span>📊 BMI: {req.bmi}</span>
                </div>
                {req.coach && (
                  <div className={styles.coachInfo}>
                    👨‍🏫 مربی: {req.coach.name}
                  </div>
                )}
              </div>

              <div className={styles.cardActions}>
                {req.status === "completed" && req.program ? (
                  <Link
                    href={`/dashboard/workout-program/${req.program._id}`}
                    className={styles.viewProgramBtn}
                  >
                    <FaEye /> مشاهده برنامه
                  </Link>
                ) : req.status === "pending" || req.status === "in_progress" ? (
                  <button className={styles.waitingBtn} disabled>
                    <FaClock /> در حال بررسی...
                  </button>
                ) : (
                  <button className={styles.rejectedBtn} disabled>
                    <FaTimesCircle /> رد شده
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}