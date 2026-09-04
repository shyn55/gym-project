// src/components/home/MentalHealth.jsx
"use client";

import Image from "next/image";
import styles from "./MentalHealth.module.css";

const mentalHealthData = [
  {
    id: 1,
    title: "رختکنی مدرن و مجهز",
    description:
      "پایانی آرام برای یک تمرین پرفشار. رختکن‌های باشگاه با دوش‌های مدرن، سونا و فضایی تمیز، مکانی برای بازگشت انرژی و آرامش شما پس از تمرینات سخت است.",
    image: "/images/mental/mental1.jpg",
    imagePosition: "right",
  },
  {
    id: 2,
    title: "دوچرخه‌های پیشرفته باشگاه",
    description:
      "هر جلسه، یک سفر به سوی سلامتی. با دوچرخه‌های ثابت و اسپینینگ باشگاه، هر پدال زدن یک قدم به سوی تناسب اندام است. تنظیمات هوشمند و طراحی ارگونومیک، بهترین تجربه را برای شما رقم می‌زند.",
    image: "/images/mental/mental2.jpg",
    imagePosition: "left",
  },
];

export default function MentalHealth() {
  return (
    <section className={styles.mentalHealth}>
      <div className={styles.container}>
        {mentalHealthData.map((item) => (
          <div
            key={item.id}
            className={`${styles.card} ${
              item.imagePosition === "left"
                ? styles.imageLeft
                : styles.imageRight
            }`}
          >
            {/* تصویر */}
            <div className={styles.imageWrapper}>
              <Image
                src={item.image}
                alt={item.title}
                width={800}
                height={450}
                className={styles.image}
                priority
              />
            </div>

            {/* محتوای متنی */}
            <div className={styles.contentWrapper}>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDescription}>{item.description}</p>
              <button className={styles.learnMoreBtn}>بیشتر بدانید</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
