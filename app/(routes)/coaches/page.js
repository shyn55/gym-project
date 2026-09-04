// src/app/(routes)/coaches/page.js
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaTelegram, FaWhatsapp, FaUser } from "react-icons/fa";
import styles from "./coaches.module.css";

export default function CoachesPage() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div className={styles.container}>
        <div style={{ textAlign: "center", padding: "60px 0", color: "#888" }}>
          در حال بارگذاری...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>مربیان ما</h1>
        <p className={styles.pageSubtitle}>
          با بهترین مربیان حرفه‌ای آشنا شوید
        </p>

        {coaches.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888" }}>
            هیچ مربی ثبت نشده است
          </p>
        ) : (
          <div className={styles.grid}>
            {coaches.map((coach) => (
              <div key={coach._id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={coach.image || "/images/coaches/default.jpg"}
                    alt={coach.name}
                    width={200}
                    height={200}
                    className={styles.image}
                  />
                </div>
                <h3 className={styles.name}>{coach.name}</h3>
                <p className={styles.specialty}>{coach.specialty}</p>
                {coach.experience && (
                  <p className={styles.experience}>📅 {coach.experience}</p>
                )}
                {coach.bio && <p className={styles.bio}>{coach.bio}</p>}

                {/* شبکه‌های اجتماعی */}
                <div className={styles.socialLinks}>
                  {coach.socialLinks?.instagram && (
                    <a
                      href={coach.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                    >
                      <FaInstagram />
                    </a>
                  )}
                  {coach.socialLinks?.telegram && (
                    <a
                      href={coach.socialLinks.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                    >
                      <FaTelegram />
                    </a>
                  )}
                  {coach.socialLinks?.whatsapp && (
                    <a
                      href={coach.socialLinks.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                    >
                      <FaWhatsapp />
                    </a>
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