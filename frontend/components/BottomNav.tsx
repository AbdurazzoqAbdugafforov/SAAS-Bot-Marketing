"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Sparkles, Building2, Crown } from "lucide-react";
import { hapticFeedback } from "@/lib/telegram";

const NAV_ITEMS = [
  {
    href: "/",
    label: "Asosiy",
    icon: LayoutGrid,
  },
  {
    href: "/content",
    label: "Studio",
    icon: Sparkles,
    badge: "AI",
  },
  {
    href: "/onboarding",
    label: "Profil",
    icon: Building2,
  },
  {
    href: "/subscription",
    label: "Tariflar",
    icon: Crown,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#EAE3D2] bg-[#FAF7F2]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-center justify-around py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => hapticFeedback("selection")}
              className={`relative flex flex-col items-center gap-1 rounded-xl px-4 py-1.5 transition-all duration-150 ${
                isActive
                  ? "bg-[#F0E9DC] text-[#1E1A14]"
                  : "text-[#8A8072] hover:text-[#1E1A14]"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`h-5 w-5 transition-transform ${
                    isActive ? "scale-105 text-[#9A6B3A]" : "text-[#8A8072]"
                  }`}
                />
                {item.badge && !isActive && (
                  <span className="absolute -right-2 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#9A6B3A] text-[8px] font-black text-white shadow">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] tracking-tight ${
                  isActive ? "font-bold text-[#1E1A14]" : "font-medium text-[#8A8072]"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
