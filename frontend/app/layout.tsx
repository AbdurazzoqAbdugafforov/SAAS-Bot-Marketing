import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "BiznesOS — Boshqaruv",
  description: "Kichik bizneslar uchun marketing va boshqaruv platformasi",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-screen bg-[#FAF7F2] text-[#1E1A14] antialiased">
        <main className="mx-auto min-h-screen max-w-md px-4 pb-24 pt-3">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
