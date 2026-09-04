// src/components/home/Hero.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FaLocationDot,
  FaPhone,
  FaMapLocationDot,
  FaDownload,
} from "react-icons/fa6";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* تصویر پس‌زمینه */}
      <div className={styles.heroBackground}>
        <Image
          src="/images/hero-bg.jpg" // مسیر تصویر را تنظیم کنید
          alt="باشگاه ورزشی"
          fill
          className={styles.heroImage}
          priority
        />
        <div className={styles.heroOverlay}></div>
      </div>

      {/* محتوای هیرو */}
      <div className={styles.heroContainer}>
        {/* سمت راست: متن اصلی */}
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.titleWhite}>حس خوب</span>
            <br />
            <span className={styles.titleCyan}>فیت بودن در این باشگاه</span>
          </h1>
          <p className={styles.heroDescription}>
            همین حالا شروع کن، بهترین نسخه خودت باش.
          </p>
        </div>

        {/* سمت چپ: باکس اطلاعات */}
        <div className={styles.heroBox}>
          <p className={styles.boxLabel}>📍 شعبه مهرشهر</p>

          <h2 className={styles.boxAddress}>باشگاه ورزشی امپراطور</h2>

          <p className={styles.boxDetail}>
            کرج، فاز ۴ مهرشهر
            <br />
            خیابان ۴۱۰ غربی، بین بلوار رزهبان و شش متری
          </p>

          <div className={styles.phoneList}>
            <a href="tel:02633521922" className={styles.phoneItem}>
              <FaPhone />
              <span>026-33521922</span>
            </a>

            <a href="tel:09100058570" className={styles.phoneItem}>
              <FaPhone />
              <span>0910-005-8570</span>
            </a>
          </div>

          <div className={styles.boxButtons}>
            <a
              href="https://nshn.ir/20_bvW_EIxfc3E"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.boxBtn} ${styles.btnNeshan}`}
            >
              <FaMapLocationDot className={styles.btnIcon} />
              مسیر در نشان
            </a>

            <a
              href="https://balad.ir/p/6YfF3tGgkmHCXl"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.boxBtn} ${styles.btnBalad}`}
            >
              <FaLocationDot className={styles.btnIcon} />
              مسیر در بلد
            </a>
          </div>

          <div className={styles.boxFooter}>
            <span className={styles.footerText}>قبلاً ثبت‌نام کرده‌اید؟</span>

            <Link href="/app" className={styles.footerLink}>
              <FaDownload className={styles.footerIcon} />
              دانلود اپلیکیشن
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
