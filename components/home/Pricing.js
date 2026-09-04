// src/components/home/Pricing.jsx
"use client";

import { useState, useEffect } from "react";
import {
  FaDumbbell,
  FaFire,
  FaStar,
  FaCrown,
  FaCheckCircle,
} from "react-icons/fa";
import styles from "./Pricing.module.css";
import Image from "next/image";

// نگاشت آیکون‌ها بر اساس عنوان
const iconMap = {
  پایه: FaDumbbell,
  برنز: FaFire,
  نقره‌ای: FaStar,
  طلایی: FaCrown,
};

export default function Pricing() {
  const [pricingData, setPricingData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await fetch("/api/public/pricing");
        const data = await res.json();
        if (data.success) {
          setPricingData(data.data);
        }
      } catch (error) {
        console.error("خطا در دریافت قیمت‌ها:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPricing();
  }, []);

  if (loading) {
    return (
      <section className={styles.pricing}>
        <div className={styles.container}>
          <div
            style={{ textAlign: "center", padding: "60px 0", color: "#888" }}
          >
            در حال بارگذاری...
          </div>
        </div>
      </section>
    );
  }

  if (pricingData.length === 0) {
    return null;
  }

  return (
    <section className={styles.pricing}>
      <div className={styles.container}>
        {/* هدر بخش */}
        <div className={styles.header}>
          <h2 className={styles.title}>شهریه باشگاه</h2>
          <p className={styles.subtitle}>
            با هر دو نوع عضویت، به تمام تجهیزات هوازی و قدرتی دسترسی کامل و
            نامحدود دارید. فقط کافی است شروع کنید.
          </p>
        </div>

        {/* کارت‌های قیمت */}
        <div className={styles.pricingGrid}>
          {pricingData.map((item) => {
            const IconComponent = iconMap[item.title] || FaDumbbell;
            const isPopular = item.badge === "محبوب";
            const isLuxury = item.badge === "لوکس";

            return (
              <div
                key={item._id}
                className={`${styles.pricingCard} ${
                  isPopular ? styles.popular : ""
                } ${isLuxury ? styles.luxury : ""}`}
              >
                {item.badge && <div className={styles.badge}>{item.badge}</div>}

                <div className={styles.cardIconWrapper}>
                  <IconComponent className={styles.cardIcon} />
                </div>

                <div className={styles.cardImageWrapper}>
                  <Image
                    src={item.image || "/images/pricing/default.jpg"}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className={styles.cardImage}
                  />
                </div>

                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardSubtitle}>{item.subtitle}</p>

                <ul className={styles.featuresList}>
                  {item.features?.map((feature, index) => (
                    <li key={index} className={styles.featureItem}>
                      <FaCheckCircle className={styles.featureIcon} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className={styles.priceWrapper}>
                  <span className={styles.price}>{item.price}</span>
                  <span className={styles.period}>/{item.period}</span>
                </div>

                <button
                  className={`${styles.registerBtn} ${
                    isPopular ? styles.popularBtn : ""
                  } ${isLuxury ? styles.luxuryBtn : ""}`}
                >
                  {item.buttonText || "ثبت نام"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
