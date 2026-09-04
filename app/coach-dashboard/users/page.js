// app/coach-dashboard/users/page.js
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { FaArrowRight, FaUsers } from "react-icons/fa";
import styles from "./users.module.css";

export default function CoachUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated" && session?.user?.role !== "coach") {
      router.push("/dashboard");
      return;
    }
  }, [status, session, router]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/coach-dashboard" className={styles.backBtn}>
            <FaArrowRight /> بازگشت
          </Link>
          <h1 className={styles.title}>👥 کاربران</h1>
        </div>
        <div className={styles.content}>
          <FaUsers className={styles.icon} />
          <h2>در حال توسعه...</h2>
          <p>این بخش به زودی تکمیل می‌شود</p>
        </div>
      </div>
    </div>
  );
}