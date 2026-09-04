// app/coach-dashboard/requests/[id]/page.js
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  FaArrowRight,
  FaUser,
  FaWeight,
  FaRulerVertical,
  FaCalendarAlt,
  FaSave,
  FaPlus,
  FaTrash,
  FaEye,
  FaFilePdf,
  FaUpload,
} from "react-icons/fa";
import styles from "./request-detail.module.css";

export default function RequestDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const requestId = params.id;

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ===== حالت‌های نمایش =====
  const [viewMode, setViewMode] = useState("view");

  // ===== نوع برنامه =====
  const [programType, setProgramType] = useState("manual"); // "manual" | "upload"
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfFileName, setPdfFileName] = useState("");

  // ===== فرم برنامه =====
  const [programData, setProgramData] = useState({
    title: "برنامه تمرینی",
    notes: "",
    days: [
      {
        day: "روز ۱",
        exercises: [{ name: "", sets: "", reps: "", weight: "", rest: "" }],
      },
    ],
  });

  // ===== دریافت اطلاعات درخواست =====
  const fetchRequest = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/workout/request/${requestId}`);
      const data = await res.json();

      if (data.success) {
        setRequest(data.data);

        if (data.data.program) {
          const prog = data.data.program;
          setProgramData({
            title: prog.title || "برنامه تمرینی",
            notes: prog.notes || "",
            days: prog.content || [
              {
                day: "روز ۱",
                exercises: [
                  { name: "", sets: "", reps: "", weight: "", rest: "" },
                ],
              },
            ],
          });

          // اگر برنامه از نوع آپلود است
          if (prog.programType === "upload" && prog.pdfUrl) {
            setProgramType("upload");
            setPdfFileName(prog.pdfFileName || "برنامه-تمرینی.pdf");
          } else {
            setProgramType("manual");
          }

          setViewMode("view");
        } else {
          setViewMode("edit");
          setProgramType("manual");
        }
      } else {
        setError("خطا در دریافت اطلاعات");
      }
    } catch (err) {
      setError("مشکل در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  // ===== بررسی دسترسی =====
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated" && session?.user?.role !== "coach") {
      router.push("/dashboard");
      return;
    }
    if (requestId) {
      fetchRequest();
    }
  }, [status, session, router, requestId, fetchRequest]);

  // ===== توابع مدیریت برنامه (دستی) =====
  const addDay = () => {
    setProgramData((prev) => ({
      ...prev,
      days: [
        ...prev.days,
        {
          day: `روز ${prev.days.length + 1}`,
          exercises: [{ name: "", sets: "", reps: "", weight: "", rest: "" }],
        },
      ],
    }));
  };

  const removeDay = (dayIndex) => {
    if (programData.days.length <= 1) return;
    setProgramData((prev) => ({
      ...prev,
      days: prev.days.filter((_, i) => i !== dayIndex),
    }));
  };

  const addExercise = (dayIndex) => {
    setProgramData((prev) => {
      const newDays = [...prev.days];
      newDays[dayIndex].exercises.push({
        name: "",
        sets: "",
        reps: "",
        weight: "",
        rest: "",
      });
      return { ...prev, days: newDays };
    });
  };

  const removeExercise = (dayIndex, exerciseIndex) => {
    if (programData.days[dayIndex].exercises.length <= 1) return;
    setProgramData((prev) => {
      const newDays = [...prev.days];
      newDays[dayIndex].exercises.splice(exerciseIndex, 1);
      return { ...prev, days: newDays };
    });
  };

  const updateDayName = (dayIndex, value) => {
    setProgramData((prev) => {
      const newDays = [...prev.days];
      newDays[dayIndex].day = value;
      return { ...prev, days: newDays };
    });
  };

  const updateExercise = (dayIndex, exerciseIndex, field, value) => {
    setProgramData((prev) => {
      const newDays = [...prev.days];
      newDays[dayIndex].exercises[exerciseIndex][field] = value;
      return { ...prev, days: newDays };
    });
  };

  // ===== تغییر فایل PDF =====
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("لطفاً فقط فایل PDF آپلود کنید");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("حجم فایل نباید بیشتر از ۵ مگابایت باشد");
      return;
    }

    setPdfFile(file);
    setPdfFileName(file.name);
    setError("");
  };

  // ===== ذخیره برنامه (با پشتیبانی از دو حالت) =====
  const saveProgram = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      let res;

      if (programType === "upload") {
        // ===== حالت آپلود PDF =====
        if (!pdfFile) {
          setError("لطفاً فایل PDF را انتخاب کنید");
          setSaving(false);
          return;
        }

        const formData = new FormData();
        formData.append("requestId", requestId);
        formData.append("title", programData.title || "برنامه تمرینی");
        formData.append("notes", programData.notes || "");
        formData.append("pdfFile", pdfFile);

        res = await fetch("/api/workout/program", {
          method: "POST",
          body: formData,
        });
      } else {
        // ===== حالت دستی =====
        res = await fetch("/api/workout/program", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requestId: requestId,
            title: programData.title,
            content: programData.days,
            notes: programData.notes,
          }),
        });
      }

      const data = await res.json();

      if (data.success) {
        setSuccess("✅ برنامه با موفقیت ثبت شد!");
        setViewMode("view");
        await fetchRequest();
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(data.message || "خطا در ثبت برنامه");
      }
    } catch (err) {
      setError("مشکل در ارتباط با سرور");
    } finally {
      setSaving(false);
    }
  };

  // ===== وضعیت لودینگ =====
  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>در حال بارگذاری...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className={styles.container}>
        <p>درخواست یافت نشد</p>
      </div>
    );
  }

  const isProgramComplete = request.status === "completed" && request.program;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* ===== هدر ===== */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Link href="/coach-dashboard/requests" className={styles.backBtn}>
              <FaArrowRight /> بازگشت
            </Link>
            <h1 className={styles.title}>بررسی درخواست</h1>
          </div>
          <div className={styles.headerActions}>
            <span
              className={`${styles.statusBadge} ${
                request.status === "completed" ? styles.completed : styles.pending
              }`}
            >
              {request.status === "completed" ? "✅ تکمیل شده" : "⏳ در انتظار"}
            </span>
          </div>
        </div>

        {/* ===== اطلاعات کاربر ===== */}
        <div className={styles.userCard}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              <FaUser />
            </div>
            <div>
              <h2>{request.fullName || request.user?.name}</h2>
              <p>{request.user?.email}</p>
            </div>
          </div>

          <div className={styles.userStats}>
            <div className={styles.stat}>
              <FaCalendarAlt />
              <span>{request.age} سال</span>
            </div>
            <div className={styles.stat}>
              <FaWeight />
              <span>{request.weight} کیلوگرم</span>
            </div>
            <div className={styles.stat}>
              <FaRulerVertical />
              <span>{request.height} سانتی‌متر</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.bmi}>BMI: {request.bmi}</span>
              <span className={styles.bmiCategory}>
                ({request.bmiCategory})
              </span>
            </div>
          </div>

          <div className={styles.goal}>
            <span className={styles.goalLabel}>هدف:</span>
            <span className={styles.goalValue}>{request.goal}</span>
          </div>

          {request.description && (
            <p className={styles.description}>{request.description}</p>
          )}
        </div>

        {/* ===== تصاویر ===== */}
        {(request.frontImage || request.backImage || request.sideImage) && (
          <div className={styles.imagesCard}>
            <h3>📸 تصاویر بدن</h3>
            <div className={styles.imagesGrid}>
              {request.frontImage && (
                <div className={styles.imageBox}>
                  <img src={request.frontImage} alt="جلو" />
                  <span>جلو</span>
                </div>
              )}
              {request.backImage && (
                <div className={styles.imageBox}>
                  <img src={request.backImage} alt="پشت" />
                  <span>پشت</span>
                </div>
              )}
              {request.sideImage && (
                <div className={styles.imageBox}>
                  <img src={request.sideImage} alt="کنار" />
                  <span>کنار</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== برنامه تمرینی ===== */}
        <div className={styles.programCard}>
          <div className={styles.programHeader}>
            <h3>📋 برنامه تمرینی</h3>
            {isProgramComplete && viewMode === "view" && (
              <button
                onClick={() => {
                  setViewMode("edit");
                  if (request.program?.programType === "upload") {
                    setProgramType("upload");
                  } else {
                    setProgramType("manual");
                  }
                }}
                className={styles.editProgramBtn}
              >
                <FaEye /> ویرایش برنامه
              </button>
            )}
            {viewMode === "edit" && request.status !== "completed" && (
              <span className={styles.editModeBadge}>✏️ حالت ویرایش</span>
            )}
          </div>

          {error && <div className={styles.errorBox}>{error}</div>}
          {success && <div className={styles.successBox}>{success}</div>}

          {/* ===== حالت نمایش (View Mode) ===== */}
          {viewMode === "view" && isProgramComplete && (
            <div className={styles.viewProgram}>
              <div className={styles.programTitle}>
                <h4>{programData.title}</h4>
                {request.program?.programType === "upload" && (
                  <span className={styles.programTypeBadge}>📤 آپلود شده</span>
                )}
              </div>
              {programData.notes && (
                <p className={styles.programNotes}>{programData.notes}</p>
              )}

              {/* ===== اگر برنامه PDF است ===== */}
              {request.program?.programType === "upload" && request.program?.pdfUrl && (
                <div className={styles.pdfView}>
                  <FaFilePdf size={32} color="#dc3545" />
                  <div>
                    <p>فایل برنامه به صورت PDF آپلود شده است</p>
                    <a
                      href={request.program.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.pdfDownloadLink}
                    >
                      📥 دانلود فایل PDF
                    </a>
                  </div>
                </div>
              )}

              {/* ===== اگر برنامه دستی است ===== */}
              {request.program?.programType !== "upload" &&
                programData.days.map((day, index) => (
                  <div key={index} className={styles.viewDay}>
                    <h5>{day.day}</h5>
                    <table className={styles.viewTable}>
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

              {request.status === "completed" && (
                <div className={styles.programActions}>
                  <button className={styles.pdfBtn}>
                    <FaSave /> دانلود PDF
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ===== حالت ویرایش (Edit Mode) ===== */}
          {viewMode === "edit" && (
            <div className={styles.programForm}>
              {/* ===== انتخاب نوع برنامه ===== */}
              <div className={styles.programTypeSelector}>
                <label>نوع ثبت برنامه</label>
                <div className={styles.typeOptions}>
                  <button
                    type="button"
                    className={`${styles.typeBtn} ${programType === "manual" ? styles.active : ""}`}
                    onClick={() => setProgramType("manual")}
                  >
                    <span>✏️</span> نوشتن دستی
                  </button>
                  <button
                    type="button"
                    className={`${styles.typeBtn} ${programType === "upload" ? styles.active : ""}`}
                    onClick={() => setProgramType("upload")}
                  >
                    <span>📤</span> آپلود PDF
                  </button>
                </div>
              </div>

              {/* ===== فیلدهای مشترک ===== */}
              <div className={styles.field}>
                <label>عنوان برنامه</label>
                <input
                  type="text"
                  value={programData.title}
                  onChange={(e) =>
                    setProgramData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="عنوان برنامه..."
                />
              </div>

              <div className={styles.field}>
                <label>یادداشت‌ها</label>
                <textarea
                  value={programData.notes}
                  onChange={(e) =>
                    setProgramData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  rows="3"
                  placeholder="یادداشت‌های اضافی..."
                />
              </div>

              {/* ===== حالت دستی ===== */}
              {programType === "manual" && (
                <>
                  {programData.days.map((day, dayIndex) => (
                    <div key={dayIndex} className={styles.daySection}>
                      <div className={styles.dayHeader}>
                        <input
                          type="text"
                          value={day.day}
                          onChange={(e) => updateDayName(dayIndex, e.target.value)}
                          className={styles.dayTitle}
                          placeholder="نام روز..."
                        />
                        <button
                          type="button"
                          onClick={() => removeDay(dayIndex)}
                          className={styles.removeDayBtn}
                          disabled={programData.days.length <= 1}
                        >
                          <FaTrash />
                        </button>
                      </div>

                      <div className={styles.exercises}>
                        <table className={styles.exerciseTable}>
                          <thead>
                            <tr>
                              <th>تمرین</th>
                              <th>ست</th>
                              <th>تکرار</th>
                              <th>وزن</th>
                              <th>استراحت</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {day.exercises.map((exercise, exIndex) => (
                              <tr key={exIndex}>
                                <td>
                                  <input
                                    type="text"
                                    value={exercise.name}
                                    onChange={(e) =>
                                      updateExercise(
                                        dayIndex,
                                        exIndex,
                                        "name",
                                        e.target.value
                                      )
                                    }
                                    placeholder="نام تمرین"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    value={exercise.sets}
                                    onChange={(e) =>
                                      updateExercise(
                                        dayIndex,
                                        exIndex,
                                        "sets",
                                        e.target.value
                                      )
                                    }
                                    placeholder="ست"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    value={exercise.reps}
                                    onChange={(e) =>
                                      updateExercise(
                                        dayIndex,
                                        exIndex,
                                        "reps",
                                        e.target.value
                                      )
                                    }
                                    placeholder="تکرار"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    value={exercise.weight}
                                    onChange={(e) =>
                                      updateExercise(
                                        dayIndex,
                                        exIndex,
                                        "weight",
                                        e.target.value
                                      )
                                    }
                                    placeholder="وزن"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    value={exercise.rest}
                                    onChange={(e) =>
                                      updateExercise(
                                        dayIndex,
                                        exIndex,
                                        "rest",
                                        e.target.value
                                      )
                                    }
                                    placeholder="استراحت"
                                  />
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    onClick={() => removeExercise(dayIndex, exIndex)}
                                    className={styles.removeExBtn}
                                    disabled={day.exercises.length <= 1}
                                  >
                                    ✕
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <button
                          type="button"
                          onClick={() => addExercise(dayIndex)}
                          className={styles.addExBtn}
                        >
                          <FaPlus /> افزودن تمرین
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addDay}
                    className={styles.addDayBtn}
                  >
                    <FaPlus /> افزودن روز جدید
                  </button>
                </>
              )}

              {/* ===== حالت آپلود ===== */}
              {programType === "upload" && (
                <div className={styles.uploadSection}>
                  <div className={styles.uploadBox}>
                    <label>📄 فایل برنامه (PDF)</label>
                    <div
                      className={styles.dropZone}
                      onClick={() => document.getElementById("pdfUpload").click()}
                    >
                      {pdfFile ? (
                        <div className={styles.fileInfo}>
                          <FaFilePdf size={32} color="#dc3545" />
                          <span>{pdfFile.name}</span>
                          <span className={styles.fileSize}>
                            {(pdfFile.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                      ) : pdfFileName && !pdfFile ? (
                        <div className={styles.fileInfo}>
                          <FaFilePdf size={32} color="#440099" />
                          <span>فایل موجود: {pdfFileName}</span>
                          <span className={styles.fileSize}>
                            (برای تغییر فایل جدید انتخاب کنید)
                          </span>
                        </div>
                      ) : (
                        <div className={styles.dropContent}>
                          <span>📤</span>
                          <p>برای آپلود فایل PDF کلیک کنید</p>
                          <small>حداکثر حجم: ۵ مگابایت</small>
                        </div>
                      )}
                      <input
                        type="file"
                        id="pdfUpload"
                        accept=".pdf"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                      />
                    </div>
                    {pdfFile && (
                      <button
                        type="button"
                        onClick={() => {
                          setPdfFile(null);
                          setPdfFileName("");
                        }}
                        className={styles.removeFileBtn}
                      >
                        حذف فایل
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={saveProgram}
                  disabled={saving}
                  className={styles.saveBtn}
                >
                  <FaSave /> {saving ? "در حال ثبت..." : "ثبت برنامه"}
                </button>
                {isProgramComplete && (
                  <button
                    type="button"
                    onClick={() => setViewMode("view")}
                    className={styles.cancelBtn}
                  >
                    انصراف
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}