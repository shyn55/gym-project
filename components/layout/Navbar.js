// components/layout/Navbar.jsx
"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Navbar.module.css";
import { NAV_ITEMS } from "@/utils/constants";

export default function Navbar({ settings = {} }) {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const isLoggedIn = status === "authenticated";
  const role = session?.user?.role || "member";

  // ===== تعیین مسیر داشبورد بر اساس نقش =====
  const getDashboardLink = () => {
    if (!isLoggedIn) return "/login";
    switch (role) {
      case "super_admin":
      case "admin":
        return "/admin";
      case "coach":
        return "/coach-dashboard";
      default:
        return "/dashboard";
    }
  };

  // ===== تعیین نام نمایشی =====
  const getDisplayName = () => {
    if (!session?.user?.name) return "پنل کاربری";
    switch (role) {
      case "super_admin":
        return `👑 ${session.user.name}`;
      case "admin":
        return `🛡️ ${session.user.name}`;
      case "coach":
        return `🧑‍🏫 ${session.user.name}`;
      default:
        return session.user.name;
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        {/* لوگو */}
        <div className={styles.rightSection}>
          <Link href="/">
            <Image
              src="/images/logo.webp"
              alt="لوگو باشگاه"
              width={160}
              height={50}
              className={styles.logo}
              priority
            />
          </Link>
        </div>

        {/* منوی اصلی */}
        <ul className={styles.navMenu}>
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <Link href={item.href} className={styles.navLink}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* بخش ورود/خروج */}
        <div className={styles.leftSection}>
          {isLoggedIn ? (
            <>
              <Link href={getDashboardLink()} className={styles.dashboardLink}>
                {getDisplayName()}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className={styles.logoutBtn}
              >
                خروج
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.loginBtn}>
                ورود
              </Link>
              <Link href="/register" className={styles.registerBtn}>
                ثبت نام کنید
              </Link>
            </>
          )}
        </div>

        {/* همبرگر */}
        <button className={styles.hamburger} onClick={toggleMenu}>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>
      </div>

      {/* منوی موبایل */}
      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ""}`}>
        <div className={styles.mobileMenuHeader}>
          <Image src="/images/logo.webp" alt="لوگو" width={120} height={40} priority />
          <button className={styles.closeBtn} onClick={closeMenu}>✕</button>
        </div>
        <ul className={styles.mobileNavItems}>
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <Link href={item.href} className={styles.mobileNavLink} onClick={closeMenu}>
                {item.label}
              </Link>
            </li>
          ))}
          <li className={styles.mobileAuthItems}>
            {isLoggedIn ? (
              <>
                <Link href={getDashboardLink()} className={styles.mobileNavLink} onClick={closeMenu}>
                  {getDisplayName()}
                </Link>
                <button onClick={() => { signOut({ callbackUrl: "/" }); closeMenu(); }} 
                        className={styles.mobileLogoutBtn}>
                  خروج
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={styles.mobileNavLink} onClick={closeMenu}>
                  ورود
                </Link>
                <Link href="/register" className={styles.mobileRegisterBtn} onClick={closeMenu}>
                  ثبت نام کنید
                </Link>
              </>
            )}
          </li>
        </ul>
      </div>

      {isMenuOpen && <div className={styles.overlay} onClick={closeMenu}></div>}
    </nav>
  );
}