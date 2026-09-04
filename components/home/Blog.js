// src/components/home/Blog.jsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaCalendarAlt, FaUser, FaEye } from "react-icons/fa";
import styles from "./Blog.module.css";

export default function Blog() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("/api/public/blog");
        const data = await res.json();
        if (data.success) {
          setArticles(data.data);
        }
      } catch (error) {
        console.error("خطا در دریافت مقالات:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) {
    return (
      <section className={styles.blog}>
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

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className={styles.blog}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>📝 آخرین مقالات</h2>
          <p className={styles.subtitle}>
            مطالب مفید در زمینه تناسب اندام، تغذیه و سلامت
          </p>
        </div>

        <div className={styles.grid}>
          {articles.map((item) => (
            <div key={item._id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image
                  src={item.image || "/images/blog/default.jpg"}
                  alt={item.title}
                  width={400}
                  height={240}
                  className={styles.image}
                />
                <span className={styles.category}>
                  {item.category || "عمومی"}
                </span>
              </div>
              <div className={styles.content}>
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.excerpt}>
                  {item.excerpt || item.content?.slice(0, 120) + "..."}
                </p>
                <div className={styles.meta}>
                  <span>
                    <FaCalendarAlt />{" "}
                    {new Date(item.createdAt).toLocaleDateString("fa-IR")}
                  </span>
                  <span>
                    <FaUser /> {item.author || "مدیر سایت"}
                  </span>
                  <span>
                    <FaEye /> {item.viewCount || 0}
                  </span>
                </div>
                <Link href={`/blog/${item.slug}`} className={styles.readMore}>
                  مطالعه بیشتر ←
                </Link>
              </div>
            </div>
          ))}
        </div>

        {articles.length >= 6 && (
          <div className={styles.viewAll}>
            <Link href="/blog" className={styles.viewAllBtn}>
              مشاهده همه مقالات
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
