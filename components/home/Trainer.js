// src/components/home/Trainer.jsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Trainer.module.css";

export default function Trainer() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const res = await fetch("/api/public/coaches");
        const data = await res.json();
        if (data.success) {
          setCoaches(data.data);
        }
      } catch (error) {
        console.error("خطا در دریافت مربیان:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoaches();
  }, []);

  if (loading) {
    return (
      <section className={styles.trainer}>
        <div className={styles.trainerContainer}>
          <div style={{ textAlign: "center", width: "100%", color: "#fff" }}>
            در حال بارگذاری...
          </div>
        </div>
      </section>
    );
  }

  if (coaches.length === 0) {
    return null; // یا نمایش پیام "مربی وجود ندارد"
  }

  const activeCoach = coaches[activeIndex] || coaches[0];

  return (
    <section className={styles.trainer}>
      <div className={styles.trainerContainer}>
        {/* سمت چپ: تصویر مربی */}
        <div className={styles.trainerImage}>
          <Image
            src={activeCoach.image || "/images/coaches/default.jpg"}
            alt={activeCoach.name}
            width={800}
            height={450}
            className={styles.trainerImg}
          />
        </div>

        {/* سمت راست: محتوای متنی */}
        <div className={styles.trainerContent}>
          <h2 className={styles.trainerTitle}>
            در اینجا چیزی متفاوت
            <br />
            <span className={styles.trainerHighlight}>
              با مربی‌گری {activeCoach.name}
            </span>
          </h2>
          <p className={styles.trainerDescription}>{activeCoach.bio}</p>

          {/* لیست مربیان برای انتخاب */}
          <div className={styles.coachSelector}>
            {coaches.map((coach, index) => (
              <button
                key={coach._id}
                className={`${styles.coachBtn} ${
                  activeIndex === index ? styles.active : ""
                }`}
                onClick={() => setActiveIndex(index)}
              >
                {coach.name}
              </button>
            ))}
          </div>

          <button className={styles.trainerBtn}>دریافت برنامه تمرینی</button>
        </div>
      </div>
    </section>
  );
}
