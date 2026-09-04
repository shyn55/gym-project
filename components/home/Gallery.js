// src/components/home/Gallery.jsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaImages, FaTimes } from "react-icons/fa";
import styles from "./Gallery.module.css";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState("همه");

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch("/api/public/gallery");

        console.log("Status:", res.status);

        const text = await res.text();
        console.log(text);
      } catch (err) {
        console.error(err);
      }
    }

    fetchImages();
  }, []);

  const categories = [
    "همه",
    ...new Set(images.map((item) => item.category || "عمومی")),
  ];

  const filteredImages =
    filter === "همه"
      ? images
      : images.filter((item) => (item.category || "عمومی") === filter);

  if (loading) {
    return (
      <section className={styles.gallery}>
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

  if (images.length === 0) {
    return null;
  }

  return (
    <section className={styles.gallery}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>🖼️ گالری تصاویر</h2>
          <p className={styles.subtitle}>
            تصاویری از باشگاه، تمرینات و رویدادها
          </p>
        </div>

        {/* فیلتر دسته‌بندی */}
        <div className={styles.filters}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${filter === cat ? styles.active : ""}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* شبکه تصاویر */}
        <div className={styles.grid}>
          {filteredImages.map((item) => (
            <div
              key={item._id}
              className={styles.imageCard}
              onClick={() => setSelectedImage(item.image)}
            >
              <Image
                src={item.image}
                alt={item.title}
                width={300}
                height={300}
                className={styles.image}
              />
              {item.title && (
                <div className={styles.overlay}>
                  <span>{item.title}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className={styles.lightbox} onClick={() => setSelectedImage(null)}>
          <button
            className={styles.closeBtn}
            onClick={() => setSelectedImage(null)}
          >
            <FaTimes />
          </button>
          <Image
            src={selectedImage}
            alt="تصویر بزرگ"
            width={800}
            height={600}
            className={styles.lightboxImage}
          />
        </div>
      )}
    </section>
  );
}
