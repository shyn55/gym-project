// src/app/admin/layout.js
"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import Link from "next/link";
import {
  FaHome,
  FaUsers,
  FaMoneyBillWave,
  FaNewspaper,
  FaStar,
  FaBuilding,
  FaImages,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserCog,  // اضافه شد
} from "react-icons/fa";
import styles from "./admin.module.css";

const menuItems = [
  { name: "داشبورد", icon: FaHome, href: "/admin" },
  { name: "مربیان", icon: FaUsers, href: "/admin/coaches" },
  { name: "قیمت‌ها", icon: FaMoneyBillWave, href: "/admin/pricing" },
  { name: "مقالات", icon: FaNewspaper, href: "/admin/blog" },
  { name: "نظرات", icon: FaStar, href: "/admin/testimonials" },
  { name: "شعبه‌ها", icon: FaBuilding, href: "/admin/branches" },
  { name: "گالری", icon: FaImages, href: "/admin/gallery" },
  { name: "کاربران", icon: FaUserCog, href: "/admin/users" }, // اضافه شد
  { name: "تنظیمات", icon: FaCog, href: "/admin/settings" },
];

function AdminLayoutContent({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // فقط سوپرادمین (isAdmin: true) به پنل ادمین دسترسی داشته باشد
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
      return;
    }

    if (status === "authenticated" && !session?.user?.isAdmin) {
      router.push("/dashboard");
      return;
    }
  }, [status, session, router]);

  // بستن سایدبار با کلیک روی اوورلی
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  if (pathname === "/admin/login") {
    return children;
  }

  if (status === "loading") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          color: "#888",
        }}
      >
        در حال بارگذاری...
      </div>
    );
  }

  if (!session || !session.user?.isAdmin) {
    return null;
  }

  return (
    <>
      {/* دکمه همبرگر */}
      <button className={styles.hamburgerBtn} onClick={toggleSidebar}>
        <FaBars />
      </button>

      {/* اوورلی */}
      <div
        className={`${styles.overlay} ${
          sidebarOpen ? styles.overlayOpen : ""
        }`}
        onClick={closeSidebar}
      ></div>

      <div className={styles.adminLayout}>
        {/* سایدبار */}
        <aside
          className={`${styles.sidebar} ${
            sidebarOpen ? styles.sidebarOpen : ""
          }`}
        >
          <div className={styles.logo}>
            <h2>⚡ امپراطور</h2>
            <span>پنل مدیریت</span>
          </div>

          <nav className={styles.nav}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${styles.navLink} ${
                    isActive ? styles.active : ""
                  }`}
                  onClick={closeSidebar}
                >
                  <Icon className={styles.navIcon} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className={styles.logout}>
            <button onClick={() => signOut()} className={styles.logoutBtn}>
              <FaSignOutAlt className={styles.navIcon} />
              <span>خروج</span>
            </button>
          </div>
        </aside>

        <main className={styles.mainContent}>
          <div className={styles.content}>{children}</div>
        </main>
      </div>
    </>
  );
}

export default function AdminLayout({ children }) {
  return (
    <SessionProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SessionProvider>
  );
}