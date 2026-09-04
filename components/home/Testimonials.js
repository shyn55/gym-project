// src/components/home/Testimonials.jsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaStar, FaQuoteRight } from "react-icons/fa";
import styles from "./Testimonials.module.css";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchTestimonials = async () => {
        try {
          const res = await fetch("/api/public/testimonials");
          const data = await res.json();
          if (data.success) {
            setTestimonials(data.data);
          }
        } catch (error) {
          console.error("خطا در دریافت نظرات:", error);
        } finally {
          setLoading(false);
        }
      };
    fetchTestimonials();
  }, []);


  if (loading) {
    return (
      <section className={styles.testimonials}>
        <div className={styles.container}>
          <div style={{ textAlign: "center", padding: "60px 0", color: "#888" }}>
            در حال بارگذاری...
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className={styles.testimonials}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>نظرات مشتریان</h2>
          <p className={styles.subtitle}>آنچه مشتریان ما درباره ما می‌گویند</p>
        </div>

        <div className={styles.grid}>
          {testimonials.map((item) => (
            <div key={item._id} className={styles.card}>
              <FaQuoteRight className={styles.quoteIcon} />
              <p className={styles.comment}>{item.comment}</p>
              <div className={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < (item.rating || 5) ? styles.starFilled : styles.starEmpty}
                  />
                ))}
              </div>
              <div className={styles.user}>
                <div className={styles.userImage}>
                  <Image
                    src={item.image || "/images/testimonials/default.jpg"}
                    alt={item.name}
                    width={48}
                    height={48}
                  />
                </div>
                <div className={styles.userInfo}>
                  <h4>{item.name}</h4>
                  <span>{item.position || "مشتری"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}