// app/(routes)/exercises/page.js
"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaSearch, FaFilter, FaVideo } from "react-icons/fa";
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

export default function ExercisesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("همه");
  const videoRefs = useRef({});

  useEffect(() => {
    // بررسی احراز هویت (اختیاری - کاربران بدون لاگین هم می‌توانند ببینند)
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/exercises");
      const data = await res.json();
      if (data.success) {
        setExercises(data.data);
      }
    } catch (err) {
      console.error("خطا:", err);
    } finally {
      setLoading(false);
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

  // ===== کنترل پخش فیلم (مثل GIF) =====
  const handleVideoMouseEnter = (id) => {
    const video = videoRefs.current[id];
    if (video) {
      video.play().catch((err) => console.log("پخش خودکار:", err));
    }
  };

  const handleVideoMouseLeave = (id) => {
    const video = videoRefs.current[id];
    if (video) {
      video.pause();
      video.currentTime = 0; // بازنشانی به ابتدا
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>در حال بارگذاری حرکات...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>🏋️ حرکات تمرینی</h1>
        <p className={styles.subtitle}>بانک کامل حرکات تمرینی با توضیحات و تصاویر</p>

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

        {filteredExercises.length === 0 ? (
          <div className={styles.emptyState}>
            <p>هیچ حرکتی یافت نشد</p>
          </div>
        ) : (
          <div className={styles.exercisesGrid}>
            {filteredExercises.map((ex) => (
              <div key={ex._id} className={styles.exerciseCard}>
                {/* ===== تصویر یا فیلم ===== */}
                <div className={styles.cardImage}>
                  {ex.videoFile ? (
                    // ===== نمایش فیلم (مثل GIF) =====
                    <div
                      className={styles.videoWrapper}
                      onMouseEnter={() => handleVideoMouseEnter(ex._id)}
                      onMouseLeave={() => handleVideoMouseLeave(ex._id)}
                    >
                      <video
                        ref={(el) => {
                          if (el) videoRefs.current[ex._id] = el;
                        }}
                        src={ex.videoFile}
                        muted
                        loop
                        playsInline
                        className={styles.videoThumb}
                        poster={ex.image || "/images/exercises/default.jpg"}
                      />
                      <span className={styles.videoBadge}>
                        <FaVideo /> فیلم
                      </span>
                    </div>
                  ) : (
                    // ===== نمایش تصویر =====
                    <>
                      <Image
                        src={ex.image || "/images/exercises/default.jpg"}
                        alt={ex.name}
                        width={300}
                        height={180}
                        priority
                        className={styles.imageThumb}
                      />
                    </>
                  )}
                  <span className={styles.categoryBadge}>{ex.category}</span>
                </div>

                {/* ===== اطلاعات حرکت ===== */}
                <div className={styles.cardBody}>
                  <h3>{ex.name}</h3>
                  <p className={styles.difficulty}>
                    سطح: {ex.difficulty || "متوسط"}
                  </p>
                  {ex.description && (
                    <p className={styles.description}>{ex.description}</p>
                  )}
                  
                  {/* لینک ویدیو از خارج */}
                  {ex.videoUrl && !ex.videoFile && (
                    <a
                      href={ex.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.videoLink}
                    >
                      <FaVideo /> مشاهده ویدیو
                    </a>
                  )}
                  
                  {ex.equipment && (
                    <p className={styles.equipment}>🔧 {ex.equipment}</p>
                  )}

                  {/* عضلات درگیر */}
                  {ex.muscles && ex.muscles.length > 0 && (
                    <div className={styles.muscles}>
                      {ex.muscles.slice(0, 3).map((muscle, index) => (
                        <span key={index} className={styles.muscleTag}>
                          {muscle}
                        </span>
                      ))}
                      {ex.muscles.length > 3 && (
                        <span className={styles.muscleTag}>+{ex.muscles.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}