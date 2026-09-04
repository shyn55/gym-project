// src/app/(routes)/branches/page.js
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaClock,
  FaEnvelope,
} from "react-icons/fa";
import styles from "./branches.module.css";

export default function BranchesPage() {
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
        <h1 className={styles.pageTitle}>شعبه‌های ما</h1>
        <p className={styles.pageSubtitle}>در بهترین نقاط شهر در خدمت شما هستیم</p>

        {branches.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888" }}>
            هیچ شعبه‌ای ثبت نشده است
          </p>
        ) : (
          <div className={styles.grid}>
            {branches.map((branch) => (
              <div key={branch._id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={branch.image || "/images/branches/default.jpg"}
                    alt={branch.name}
                    width={400}
                    height={220}
                    className={styles.image}
                  />
                </div>
                <div className={styles.content}>
                  <h3 className={styles.name}>{branch.name}</h3>
                  <p className={styles.address}>
                    <FaMapMarkerAlt /> {branch.address}
                  </p>
                  <p className={styles.phone}>
                    <FaPhone /> {branch.phone}
                    {branch.phone2 && ` | ${branch.phone2}`}
                  </p>
                  {branch.email && (
                    <p className={styles.email}>
                      <FaEnvelope /> {branch.email}
                    </p>
                  )}
                  <p className={styles.hours}>
                    <FaClock /> {branch.hours}
                  </p>
                  {branch.fridayHours && (
                    <p className={styles.hours}>جمعه: {branch.fridayHours}</p>
                  )}
                  {branch.facilities && branch.facilities.length > 0 && (
                    <div className={styles.facilities}>
                      {branch.facilities.map((facility, index) => (
                        <span key={index} className={styles.facilityTag}>
                          {facility}
                        </span>
                      ))}
                    </div>
                  )}
                  {branch.mapLink && (
                    <a
                      href={branch.mapLink}
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
        )}
      </div>
    </div>
  );
}