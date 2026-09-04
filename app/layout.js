// src/app/layout.js
import { Suspense } from "react";
import connectDB from "@/lib/mongoose";
import Settings from "@/models/Settings";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/providers/Providers";
// تابع برای دریافت تنظیمات در سرور
async function getSettings() {
  try {
    await connectDB();

    const settings = await Settings.findOne().lean();

    if (!settings) return {};

    return JSON.parse(JSON.stringify(settings));
  } catch (error) {
    console.error(error);
    return {};
  }
}

export async function generateMetadata() {
  const settings = await getSettings();
  return {
    title: settings.siteName || "باشگاه امپراطور",
    description: settings.metaDescription || "بهترین باشگاه ورزشی",
    keywords: settings.metaKeywords || "باشگاه ورزشی، تناسب اندام، بدنسازی",
    icons: {
      icon: settings.favicon || "/favicon.ico",
    },
  };
}

export default async function RootLayout({ children }) {
  const settings = await getSettings();

  return (
    <html lang="fa" dir="rtl">
      <body>
        <Providers>
          <Navbar settings={settings} />

          <Suspense fallback={null}>{children}</Suspense>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}
