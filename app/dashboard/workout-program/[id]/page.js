// app/dashboard/workout-program/[id]/page.js
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { FaArrowRight, FaPrint, FaDownload, FaFilePdf } from "react-icons/fa";
import styles from "./program.module.css";

export default function ViewProgramPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const programId = params.id;

  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (programId) {
      fetchProgram();
    }
  }, [status, programId, router]);

  const fetchProgram = async () => {
    try {
      setLoading(true);
      console.log("🔍 دریافت برنامه با شناسه:", programId);
      
      const res = await fetch(`/api/workout/program/${programId}`);
      console.log("📡 پاسخ API:", res.status);
      
      const data = await res.json();
      console.log("📦 داده:", data);

      if (data.success) {
        setProgram(data.data);
      } else {
        setError(data.message || "خطا در دریافت برنامه");
      }
    } catch (err) {
      console.error("❌ خطا:", err);
      setError("مشکل در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>در حال بارگذاری برنامه...</p>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className={styles.container}>
        <div className={styles.errorBox}>
          <p className={styles.error}>{error || "برنامه یافت نشد"}</p>
          <Link href="/dashboard" className={styles.backBtn}>
            <FaArrowRight /> بازگشت به داشبورد
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/dashboard" className={styles.backBtn}>
            <FaArrowRight /> بازگشت به داشبورد
          </Link>
          <div className={styles.actions}>
            <button onClick={handlePrint} className={styles.printBtn}>
              <FaPrint /> چاپ
            </button>
          </div>
        </div>

        <div className={styles.programCard}>
          <h1 className={styles.title}>{program.title}</h1>
          
          {program.notes && <p className={styles.notes}>{program.notes}</p>}
          
          <p className={styles.coachInfo}>
            👨‍🏫 تهیه شده توسط: {program.coach?.name || "مربی"}
          </p>

          {/* ===== اگر برنامه PDF است ===== */}
          {program.programType === "upload" && program.pdfUrl && (
            <div className={styles.pdfViewer}>
              <div className={styles.pdfInfo}>
                <FaFilePdf size={48} color="#dc3545" />
                <div>
                  <h3>📄 فایل برنامه تمرینی</h3>
                  <p>این برنامه به صورت فایل PDF ارسال شده است</p>
                  <a
                    href={program.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.downloadPdfBtn}
                  >
                    <FaDownload /> دانلود فایل PDF
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ===== اگر برنامه دستی است ===== */}
          {program.programType !== "upload" && program.content && program.content.length > 0 && (
            <>
              {program.content.map((day, index) => (
                <div key={index} className={styles.daySection}>
                  <h3>{day.day}</h3>
                  <table className={styles.exerciseTable}>
                    <thead>
                      <tr>
                        <th>تمرین</th>
                        <th>ست</th>
                        <th>تکرار</th>
                        <th>وزن</th>
                        <th>استراحت</th>
                      </tr>
                    </thead>
                    <tbody>
                      {day.exercises.map((ex, i) => (
                        <tr key={i}>
                          <td>{ex.name || "-"}</td>
                          <td>{ex.sets || "-"}</td>
                          <td>{ex.reps || "-"}</td>
                          <td>{ex.weight || "-"}</td>
                          <td>{ex.rest || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </>
          )}

          {(!program.content || program.content.length === 0) && program.programType !== "upload" && (
            <p className={styles.emptyContent}>محتوایی برای نمایش وجود ندارد</p>
          )}
        </div>
      </div>
    </div>
  );
}