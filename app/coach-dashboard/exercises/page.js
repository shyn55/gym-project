// app/coach-dashboard/exercises/page.js
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaDumbbell,
  FaVideo,
} from "react-icons/fa";
import styles from "./exercises.module.css";

const categories = [
  "همه",
  "سینه",
  "پشت",
  "پا",
  "شانه",
  "بازو",
  "شکم",
  "کاردیو",
  "کششی",
  "سایر",
];

export default function CoachExercises() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("همه");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated" && session?.user?.role !== "coach") {
      router.push("/dashboard");
      return;
    }
    fetchExercises();
  }, [status, session, router]);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/exercises");
      const data = await res.json();
      if (data.success) {
        setExercises(data.data);
      } else {
        setError("خطا در دریافت حرکات");
      }
    } catch (err) {
      setError("مشکل در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("آیا از حذف این حرکت اطمینان دارید؟")) return;

    try {
      const res = await fetch(`/api/exercises/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setExercises(exercises.filter((ex) => ex._id !== id));
      } else {
        alert("خطا در حذف حرکت");
      }
    } catch (err) {
      alert("مشکل در ارتباط با سرور");
    }
  };

  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch = ex.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "همه" || ex.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
        {/* هدر */}
        <div className={styles.header}>
          <h1 className={styles.title}>🏋️ حرکات تمرینی</h1>
          <Link href="/coach-dashboard/exercises/new" className={styles.addBtn}>
            <FaPlus /> افزودن حرکت جدید
          </Link>
        </div>

        {/* جستجو و فیلتر */}
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="جستجوی حرکت..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.filterBox}>
            <FaFilter className={styles.filterIcon} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.filterSelect}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <div className={styles.errorBox}>{error}</div>}

        {/* لیست حرکات */}
        {filteredExercises.length === 0 ? (
          <div className={styles.emptyState}>
            <FaDumbbell className={styles.emptyIcon} />
            <p>هیچ حرکتی ثبت نشده است</p>
            <Link
              href="/coach-dashboard/exercises/new"
              className={styles.emptyAddBtn}
            >
              افزودن اولین حرکت
            </Link>
          </div>
        ) : (
          <div className={styles.exercisesGrid}>
            {filteredExercises.map((ex) => (
              <div key={ex._id} className={styles.exerciseCard}>
                <div className={styles.cardImage}>
                  <Image
                    src={ex.image || "/images/exercises/default.jpg"}
                    alt={ex.name}
                    width={300}
                    height={180}
                  />
                  <span className={styles.categoryBadge}>{ex.category}</span>
                </div>
                <div className={styles.cardBody}>
                  <h3>{ex.name}</h3>
                  <p className={styles.difficulty}>
                    سطح: {ex.difficulty || "متوسط"}
                  </p>
                  {ex.description && (
                    <p className={styles.description}>{ex.description}</p>
                  )}
                  {ex.videoUrl && (
                    <a
                      href={ex.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.videoLink}
                    >
                      <FaVideo /> مشاهده ویدیو
                    </a>
                  )}
                  <div className={styles.cardActions}>
                    <Link
                      href={`/coach-dashboard/exercises/${ex._id}/edit`}
                      className={styles.editBtn}
                    >
                      <FaEdit /> ویرایش
                    </Link>
                    <button
                      onClick={() => handleDelete(ex._id)}
                      className={styles.deleteBtn}
                    >
                      <FaTrash /> حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}