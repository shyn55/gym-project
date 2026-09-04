// src/components/layout/Footer.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FaInstagram,
  FaTelegram,
  FaWhatsapp,
  FaYoutube,
  FaLocationDot,
  FaPhone,
  FaEnvelope,
  FaClock,
} from "react-icons/fa6";
import styles from "./Footer.module.css";

export default function Footer({ settings = {} }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* ستون ۱: لوگو و توضیحات */}
        <div className={styles.column}>
          <div className={styles.logoWrapper}>
            <Image
              src="/images/logo.webp"
              alt="باشگاه امپراطور"
              width={160}
              height={50}
              className={styles.logo}
              priority
            />
          </div>
          <p className={styles.aboutText}>
            باشگاه امپراطور، جایی برای شروع مسیر تناسب اندام شما. با تجهیزات
            مدرن، مربیان حرفه‌ای و فضایی انگیزشی، بهترین نسخه خود باشید.
          </p>
          <div className={styles.socialLinks}>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="اینستاگرام"
            >
              <FaInstagram />
            </a>
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="تلگرام"
            >
              <FaTelegram />
            </a>
            <a
              href="https://wa.me"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="واتساپ"
            >
              <FaWhatsapp />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="یوتیوب"
            >
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* ستون ۲: دسترسی سریع */}
        <div className={styles.column}>
          <h4 className={styles.columnTitle}>دسترسی سریع</h4>
          <ul className={styles.linksList}>
            <li>
              <Link href="/">صفحه اصلی</Link>
            </li>
            <li>
              <Link href="/coaches">مربیان</Link>
            </li>
            <li>
              <Link href="/branches">شعبه‌ها</Link>
            </li>
            <li>
              <Link href="/training">برنامه تمرینی</Link>
            </li>
            <li>
              <Link href="/nutrition">برنامه غذایی</Link>
            </li>
            <li>
              <Link href="/exercises">حرکات تمرینی</Link>
            </li>
          </ul>
        </div>

        {/* ستون ۳: اطلاعات تماس */}
        <div className={styles.column}>
          <h4 className={styles.columnTitle}>اطلاعات تماس</h4>
          <ul className={styles.contactList}>
            <li>
              <FaLocationDot className={styles.contactIcon} />
              <span>کرج، مهرشهر، فاز ۴، بلوار رزه بان، خیابان ۴۱۰ غربی</span>
            </li>
            <li>
              <FaPhone className={styles.contactIcon} />
              <span>۰۲۶-۳۳۵۲۱۹۲۲</span>
            </li>
            <li>
              <FaPhone className={styles.contactIcon} />
              <span>۰۹۱۰-۰۰۵۸۵۷۰</span>
            </li>
            <li>
              <FaEnvelope className={styles.contactIcon} />
              <span>info@empiregym.ir</span>
            </li>
          </ul>
        </div>

        {/* ستون ۴: ساعت کاری */}
        <div className={styles.column}>
          <h4 className={styles.columnTitle}>ساعت کاری</h4>
          <ul className={styles.hoursList}>
            <li>
              <FaClock className={styles.hoursIcon} />
              <div>
                <span className={styles.day}>شنبه تا پنجشنبه</span>
                <span className={styles.time}>۸:۰۰ - ۲۳:۰۰</span>
              </div>
            </li>
            <li>
              <FaClock className={styles.hoursIcon} />
              <div>
                <span className={styles.day}>جمعه</span>
                <span className={styles.time}>تعطیل</span>
              </div>
            </li>
            <li>
              <FaClock className={styles.hoursIcon} />
              <div>
                <span className={styles.day}>ایام تعطیلات رسمی</span>
                <span className={styles.time}>۱۹:۰۰ - ۲۳:۰۰</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* پایین فوتر */}
      <div className={styles.bottomBar}>
        <div className={styles.container}>
          <p className={styles.copyRight}>
            تمامی حقوق متعلق به باشگاه امپراطور © {new Date().getFullYear()} |
            طراحی و توسعه توسط{" "}
            <span className={styles.developer}>تیم امپراطور</span>
          </p>
          <div className={styles.bottomLinks}>
            <Link href="/privacy">حریم خصوصی</Link>
            <Link href="/terms">شرایط استفاده</Link>
            <Link href="/contact">تماس با ما</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
