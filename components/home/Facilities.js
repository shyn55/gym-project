// src/components/home/Facilities.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  FaDumbbell, // تجهیزات باشگاه
  FaHotTub, // سونا و جکوزی
  FaHeartbeat, // بخش هوازی و کاردیو
  FaTableTennis, // بیلیارد و تفریحی
  FaFistRaised, // تی آر ایکس و کیسه بوکس
} from "react-icons/fa";
import styles from "./Facilities.module.css";

const facilitiesData = [
  {
    id: 1,
    title: "تجهیزات باشگاه",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.",
    image: "/images/facilities/equipment.jpg",
    icon: FaDumbbell,
  },
  {
    id: 2,
    title: "سونا و جکوزی",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.",
    image: "/images/facilities/sauna.jpg",
    icon: FaHotTub,
  },
  {
    id: 3,
    title: "بخش هوازی و کاردیو",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.",
    image: "/images/facilities/cardio.jpg",
    icon: FaHeartbeat,
  },
  {
    id: 4,
    title: "بیلیارد و تفریحی",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.",
    image: "/images/facilities/billiard.jpg",
    icon: FaTableTennis,
  },
  {
    id: 5,
    title: "تی آر ایکس و کیسه بوکس",
    description:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است.",
    image: "/images/facilities/trx.jpg",
    icon: FaFistRaised,
  },
];

export default function Facilities() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const scrollContainerRef = useRef(null);

  // تشخیص موبایل
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 980);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // اسکرول خودکار در موبایل
  useEffect(() => {
    if (!isMobile) return;

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % facilitiesData.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isMobile]);

  // اسکرول به کارت فعال در موبایل
  useEffect(() => {
    if (isMobile && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeCard = container.children[activeIndex];

      if (activeCard) {
        container.scrollTo({
          left: activeCard.offsetLeft - container.offsetLeft,
          behavior: "smooth",
        });
      }
    }
  }, [activeIndex, isMobile]);

  // تنظیم تصویر پس‌زمینه در دسکتاپ
  const backgroundImage = isMobile
    ? "none"
    : `url(${facilitiesData[activeIndex].image})`;

  return (
    <section className={styles.facilities}>
      <div className={styles.container}>
        {/* عنوان و توضیحات */}
        <div className={styles.header}>
          <h2 className={styles.title}>باشگاه ما خانه شماست</h2>
          <p className={styles.subtitle}>
            با تجهیزات مدرن، مربیان حرفه‌ای و فضایی انگیزشی، مسیر تناسب اندام رو
            امروز شروع کن.
          </p>
        </div>

        {/* بخش اصلی */}
        <div
          className={styles.mainContent}
          style={{
            backgroundImage: backgroundImage,
          }}
        >
          {/* لیست امکانات (دسکتاپ) */}
          {!isMobile && (
            <div className={styles.facilitiesList}>
              {facilitiesData.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.id}
                    className={`${styles.facilityItem} ${
                      activeIndex === index ? styles.active : ""
                    }`}
                    onClick={() => setActiveIndex(index)}
                  >
                    {/* بخش چپ: دایره سفید + آیکون + عنوان */}
                    <div className={styles.facilityItemLeft}>
                      <div className={styles.facilityIconWrapper}>
                        <IconComponent className={styles.facilityIcon} />
                      </div>
                      <h3 className={styles.facilityTitle}>{item.title}</h3>
                    </div>
                    {/* بخش راست: توضیحات */}
                    <div className={styles.facilityItemRight}>
                      <p className={styles.facilityDesc}>{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* کارت‌های اسلایدر (موبایل) */}
          {isMobile && (
            <div className={styles.mobileSlider} ref={scrollContainerRef}>
              {facilitiesData.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.id}
                    className={`${styles.mobileCard} ${
                      activeIndex === index ? styles.mobileCardActive : ""
                    }`}
                    style={{
                      backgroundImage: `url(${item.image})`,
                    }}
                  >
                    <div className={styles.mobileCardOverlay}>
                      <div className={styles.mobileCardHeader}>
                        <div className={styles.mobileIconWrapper}>
                          <IconComponent className={styles.mobileCardIcon} />
                        </div>
                        <h3 className={styles.mobileCardTitle}>{item.title}</h3>
                      </div>
                      <p className={styles.mobileCardDesc}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
