// src/components/home/Branches.jsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaMapMarkerAlt, FaPhone, FaClock, FaEnvelope } from "react-icons/fa";
import styles from "./Branches.module.css";

export default function Branches() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchBranches = async () => {
        try {
          const res = await fetch("/api/public/branches");
          const data = await res.json();
          if (data.success) {
            setBranches(data.data);
          }
        } catch (error) {
          console.error("خطا در دریافت شعبه‌ها:", error);
        } finally {
          setLoading(false);
        }
      };
    fetchBranches();
  }, []);


  if (loading) {
    return (
      <section className={styles.branches}>
        <div className={styles.container}>
          <div style={{ textAlign: "center", padding: "60px 0", color: "#888" }}>
            در حال بارگذاری...
          </div>
        </div>
      </section>
    );
  }

  if (branches.length === 0) {
    return null;
  }

  return (
    <section className={styles.branches}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>🏢 شعبه‌های ما</h2>
          <p className={styles.subtitle}>برای رفاه شما، در بهترین نقاط شهر</p>
        </div>

        <div className={styles.grid}>
          {branches.map((item) => (
            <div key={item._id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image
                  src={item.image || "/images/branches/default.jpg"}
                  alt={item.name}
                  width={400}
                  height={220}
                  className={styles.image}
                />
              </div>
              <div className={styles.content}>
                <h3 className={styles.branchName}>{item.name}</h3>
                <p className={styles.address}>
                  <FaMapMarkerAlt /> {item.address}
                </p>
                <p className={styles.phone}>
                  <FaPhone /> {item.phone}
                  {item.phone2 && ` | ${item.phone2}`}
                </p>
                {item.email && (
                  <p className={styles.email}>
                    <FaEnvelope /> {item.email}
                  </p>
                )}
                <p className={styles.hours}>
                  <FaClock /> {item.hours}
                </p>
                {item.fridayHours && (
                  <p className={styles.hours}>جمعه: {item.fridayHours}</p>
                )}
                {item.facilities && item.facilities.length > 0 && (
                  <div className={styles.facilities}>
                    {item.facilities.map((facility, index) => (
                      <span key={index} className={styles.facilityTag}>
                        {facility}
                      </span>
                    ))}
                  </div>
                )}
                {item.mapLink && (
                  <a
                    href={item.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.mapBtn}
                  >
                    مشاهده در نقشه
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}