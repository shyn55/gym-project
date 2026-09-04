// src/components/home/HealthyHabits.jsx
"use client";

import { FaArrowLeft } from "react-icons/fa";
import styles from "./HealthyHabits.module.css";

export default function HealthyHabits() {
  return (
    <section className={styles.healthyHabits}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>
            عادات سالم را بسازید...
            <br />
            <span className={styles.highlight}>هر زمان، هر مکان</span>
          </h2>
          <p className={styles.description}>
            با داشتن باشگاه‌های محلی در سراسر کشور، پیدا کردن یک باشگاه مناسب در نزدیکی شما آسان است.
            درست جایی که زندگی و کار می‌کنید، با برنامه‌ای که متناسب با زندگی شماست.
          </p>
          <button className={styles.findBtn}>
            <span>پیدا کردن باشگاه</span>
            <FaArrowLeft className={styles.btnIcon} />
          </button>
        </div>
      </div>
    </section>
  );
}