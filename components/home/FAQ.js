// src/components/home/FAQ.jsx
"use client";

import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import styles from "./FAQ.module.css";

const faqData = [
  {
    id: 1,
    question: "ساعت کاری باشگاه امپراطور به چه صورتی هست؟",
    answer:
      "باشگاه امپراطور از ساعت ۸ صبح تا ۱۱ شب (۱۵ ساعت) فعالیت دارد. جمعه‌ها تعطیل است و در ایام تعطیلات رسمی، ساعت کاری از ۷ شب تا ۱۱ شب می‌باشد.",
  },
  {
    id: 2,
    question: "آیا عضویت در باشگاه امپراطور ماهانه است؟",
    answer:
      "بله، تمامی پلن‌های عضویت به صورت ماهانه ارائه می‌شوند و شما می‌توانید در هر زمان که تمایل داشتید، عضویت خود را تمدید یا لغو کنید. هیچ تعهد طولانی‌مدتی وجود ندارد.",
  },
  {
    id: 3,
    question: "آیا باشگاه امپراطور برای مبتدیان مناسب است؟",
    answer:
      "قطعاً! باشگاه امپراطور با داشتن مربیان مجرب و حرفه‌ای، محیطی امن و دوستانه برای همه سطوح فراهم کرده است. برنامه‌های تمرینی ویژه مبتدیان و جلسات مشاوره رایگان برای شروع مسیر تناسب اندام در نظر گرفته شده است.",
  },
  {
    id: 4,
    question: "آیا باشگاه امپراطور شلوغ است؟",
    answer:
      "باشگاه امپراطور با طراحی هوشمندانه و فضای مناسب، حتی در ساعات پیک نیز شلوغی قابل توجهی ندارد. سیستم رزرو آنلاین برای برخی تجهیزات و کلاس‌ها، به شما امکان برنامه‌ریزی دقیق و تمرین بدون دغدغه را می‌دهد.",
  },
  {
    id: 5,
    question: "آیا باشگاه امپراطور قیمت مناسبی دارد؟",
    answer:
      "بله، باشگاه امپراطور با ارائه پلن‌های متنوع و مقرون‌به‌صرفه، بهترین ارزش را در برابر امکانات و خدمات خود ارائه می‌دهد. از پلن پایه تا پلن طلایی، شما می‌توانید متناسب با بودجه و نیاز خود بهترین گزینه را انتخاب کنید.",
  },
  {
    id: 6,
    question: "باشگاه امپراطور چه تفاوتی با سایر باشگاه‌ها دارد؟",
    answer:
      "باشگاه امپراطور با ترکیبی از تجهیزات مدرن، مربیان حرفه‌ای، فضایی انگیزشی و رویکردی ویژه به سلامت روان، تجربه‌ای منحصربه‌فرد ارائه می‌دهد. همچنین برنامه‌های غذایی اختصاصی، کلاس‌های متنوع و امکانات رفاهی مثل سونا و جکوزی، امپراطور را از سایر باشگاه‌ها متمایز می‌کند.",
  },
  {
    id: 7,
    question: "چرا باید باشگاه امپراطور را انتخاب کنم؟",
    answer:
      "زیرا در باشگاه امپراطور، شما فقط یک عضو نیستید؛ شما بخشی از یک خانواده هستید. ما به شما کمک می‌کنیم تا بهترین نسخه خود شوید. با محیطی پویا، پشتیبانی مستمر و رویکردی جامع به تناسب اندام، هر روزتان پر از انرژی و انگیزه خواهد بود.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.faq}>
      <div className={styles.container}>
        {/* هدر بخش */}
        <div className={styles.header}>
          <h2 className={styles.title}>سوالات متداول</h2>
          <p className={styles.subtitle}>
            پاسخ سوالات رایج درباره باشگاه امپراطور
          </p>
        </div>

        {/* لیست سوالات */}
        <div className={styles.faqList}>
          {faqData.map((item, index) => (
            <div
              key={item.id}
              className={`${styles.faqItem} ${
                openIndex === index ? styles.active : ""
              }`}
            >
              <button
                className={styles.faqQuestion}
                onClick={() => toggleFAQ(index)}
              >
                <span>{item.question}</span>
                <span className={styles.iconWrapper}>
                  {openIndex === index ? (
                    <FaMinus className={styles.icon} />
                  ) : (
                    <FaPlus className={styles.icon} />
                  )}
                </span>
              </button>
              <div className={styles.faqAnswer}>
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
