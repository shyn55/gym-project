// app/coach-dashboard/requests/page.js
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaSearch,
  FaEye,
  FaCheckCircle,
  FaClock,
  FaUser,
  FaCalendarAlt,
  FaWeight,
  FaRulerVertical,
  FaFilePdf,
} from "react-icons/fa";
import styles from "./requests.module.css";

export default function CoachRequests() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated" && session?.user?.role !== "coach") {
      router.push("/dashboard");
      return;
    }
    if (session?.user?.id) {
      fetchRequests();
    }
  }, [status, session, router]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/workout/request?coachId=${session.user.id}`,
      );
      const data = await res.json();
      if (data.success) {
        setRequests(data.data);
      } else {
        setError("خطا در دریافت درخواست‌ها");
      }
    } catch (err) {
      setError("مشکل در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { label: "در انتظار", className: styles.statusPending },
      in_progress: { label: "در حال بررسی", className: styles.statusProgress },
      completed: { label: "تکمیل شده", className: styles.statusCompleted },
      rejected: { label: "رد شده", className: styles.statusRejected },
    };
    return badges[status] || badges.pending;
  };

  const filteredRequests = requests.filter((req) => {
    if (filter === "all") return true;
    return req.status === filter;
  });

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>📋 درخواست‌های برنامه تمرینی</h1>
          <div className={styles.headerActions}>
            <div className={styles.searchBox}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="جستجوی کاربر..."
                className={styles.searchInput}
              />
            </div>
          </div>
        </div>

        {/* فیلترها */}
        <div className={styles.filters}>
          <button
            className={`${styles.filterBtn} ${filter === "all" ? styles.active : ""}`}
            onClick={() => setFilter("all")}
          >
            همه ({requests.length})
          </button>
          <button
            className={`${styles.filterBtn} ${filter === "pending" ? styles.active : ""}`}
            onClick={() => setFilter("pending")}
          >
            در انتظار ({requests.filter((r) => r.status === "pending").length})
          </button>
          <button
            className={`${styles.filterBtn} ${filter === "in_progress" ? styles.active : ""}`}
            onClick={() => setFilter("in_progress")}
          >
            در حال بررسی (
            {requests.filter((r) => r.status === "in_progress").length})
          </button>
          <button
            className={`${styles.filterBtn} ${filter === "completed" ? styles.active : ""}`}
            onClick={() => setFilter("completed")}
          >
            تکمیل شده ({requests.filter((r) => r.status === "completed").length}
            )
          </button>
        </div>

        {error && <div className={styles.errorBox}>{error}</div>}

        {filteredRequests.length === 0 ? (
          <div className={styles.emptyState}>
            <FaSearch className={styles.emptyIcon} />
            <p>هیچ درخواستی در این دسته بندی وجود ندارد</p>
          </div>
        ) : (
          <div className={styles.requestsGrid}>
            {filteredRequests.map((req) => {
              const statusInfo = getStatusBadge(req.status);
              return (
                <div key={req._id} className={styles.requestCard}>
                  {/* هدر کارت */}
                  <div className={styles.cardHeader}>
                    <div className={styles.userInfo}>
                      <div className={styles.userAvatar}>
                        <FaUser />
                      </div>
                      <div>
                        <h3 className={styles.userName}>
                          {req.fullName || req.user?.name}
                        </h3>
                        <p className={styles.userEmail}>{req.user?.email}</p>
                      </div>
                    </div>
                    <span
                      className={`${styles.statusBadge} ${statusInfo.className}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* اطلاعات */}
                  <div className={styles.cardBody}>
                    <div className={styles.infoGrid}>
                      <div className={styles.infoItem}>
                        <FaCalendarAlt />
                        <span>سن: {req.age} سال</span>
                      </div>
                      <div className={styles.infoItem}>
                        <FaWeight />
                        <span>وزن: {req.weight} کیلوگرم</span>
                      </div>
                      <div className={styles.infoItem}>
                        <FaRulerVertical />
                        <span>قد: {req.height} سانتی‌متر</span>
                      </div>
                      <div className={styles.infoItem}>
                        <span className={styles.bmiBadge}>
                          BMI: {req.bmi} ({req.bmiCategory})
                        </span>
                      </div>
                    </div>

                    <div className={styles.goalBox}>
                      <span className={styles.goalLabel}>هدف:</span>
                      <span className={styles.goalValue}>{req.goal}</span>
                    </div>

                    {req.description && (
                      <p className={styles.description}>{req.description}</p>
                    )}

                    {/* تصاویر */}
                    {(req.frontImage || req.backImage || req.sideImage) && (
                      <div className={styles.imageThumbs}>
                        {req.frontImage && (
                          <div className={styles.thumb}>
                            <img src={req.frontImage} alt="جلو" />
                            <span>جلو</span>
                          </div>
                        )}
                        {req.backImage && (
                          <div className={styles.thumb}>
                            <img src={req.backImage} alt="پشت" />
                            <span>پشت</span>
                          </div>
                        )}
                        {req.sideImage && (
                          <div className={styles.thumb}>
                            <img src={req.sideImage} alt="کنار" />
                            <span>کنار</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* دکمه‌ها */}
                  <div className={styles.cardActions}>
                    <Link
                      href={`/coach-dashboard/requests/${req._id}`}
                      className={styles.viewBtn}
                    >
                      <FaEye /> مشاهده و بررسی
                    </Link>
                    {req.status === "completed" && req.program && (
                      <Link
                        href={`/coach-dashboard/programs/${req.program._id}/pdf`}
                        className={styles.pdfBtn}
                      >
                        <FaFilePdf /> دانلود PDF
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
