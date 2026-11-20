"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Crown, Zap } from "lucide-react";
import {
  getTelegramWebApp,
  hapticFeedback,
  showBackButton,
} from "@/lib/telegram";
import { getProfile, upgradeSubscription, UserProfile } from "@/lib/api";

const PLANS = [
  {
    id: "free",
    name: "Start",
    badge: "Bepul",
    price: "0",
    period: "so'm",
    description: "Boshlang'ich tanishish va sinov uchun",
    popular: false,
    features: [
      "1 ta biznes profil",
      "Kuniga 3 ta post",
      "Instagram va Telegram preview",
      "Oddiy shablonlar",
    ],
  },
  {
    id: "pro",
    name: "Pro Business",
    badge: "⭐ Eng ommabop",
    price: "49,000",
    period: "so'm / oy",
    description: "Faol mijozlarni jalb qiluvchi kichik bizneslar uchun",
    popular: true,
    features: [
      "1 ta biznes profil",
      "Kuniga 25 tagacha post",
      "Barcha marketing shablonlari",
      "Telegramda to'g'ridan-to'g'ri ulashish",
      "Ustuvor tezlik",
      "Suratlar kutubxonasi",
    ],
  },
  {
    id: "premium",
    name: "Ultra SaaS",
    badge: "Cheksiz",
    price: "99,000",
    period: "so'm / oy",
    description: "Bir nechta filiali bor yoki bir nechta biznes egalari uchun",
    popular: false,
    features: [
      "5 tagacha biznes profil",
      "Cheksiz post generatsiyasi",
      "Shaxsiy brending va ohang",
      "24/7 VIP qo'llab-quvvatlash",
      "Eksklyuziv shablonlar",
    ],
  },
];

export default function SubscriptionPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  useEffect(() => {
    const cleanup = showBackButton(() => router.push("/"));
    return cleanup;
  }, [router]);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    const res = await getProfile();
    if (res.success && res.data) {
      setProfile(res.data);
    }
    setLoading(false);
  }

  const currentPlan = profile?.subscription?.plan || "free";

  async function handleUpgrade(planId: string) {
    if (planId === currentPlan) return;

    setUpgrading(planId);
    hapticFeedback("impact", "heavy");

    const res = await upgradeSubscription(planId);
    setUpgrading(null);

    if (res.success) {
      hapticFeedback("notification", "success");
      getTelegramWebApp()?.showAlert(`Reja ${planId.toUpperCase()} ga muvaffaqiyatli yangilandi! 🎉`);
      await loadProfile();
    } else {
      hapticFeedback("notification", "error");
      getTelegramWebApp()?.showAlert(res.error || "Xatolik yuz berdi");
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 pt-4">
        <div className="h-8 w-44 rounded-2xl bg-[#EAE3D2] animate-pulse" />
        <div className="h-56 w-full rounded-3xl bg-[#EAE3D2] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-12">
      {/* ======== HEADER ======== */}
      <header className="flex items-center gap-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FDF6E9] text-[#9A6B3A] border border-[#F5E6CD]">
          <Crown className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-black text-[#1E1A14]">Tariflar va Obuna</h1>
          <p className="text-xs text-[#756B5D]">
            Biznesingiz uchun eng mos rejani tanlang
          </p>
        </div>
      </header>

      {/* ======== PLANS LIST ======== */}
      <div className="space-y-4">
        {PLANS.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          const isProcessing = upgrading === plan.id;

          return (
            <div
              key={plan.id}
              className={`relative overflow-hidden rounded-[24px] border p-5 transition-all shadow-cream ${
                isCurrent
                  ? "border-emerald-500 bg-white ring-1 ring-emerald-500/30"
                  : plan.popular
                  ? "border-[#9A6B3A] bg-gradient-to-br from-[#FFFDF9] to-[#FAF5EB] ring-1 ring-[#9A6B3A]/30"
                  : "border-[#EAE3D2] bg-white"
              }`}
            >
              {/* Badge */}
              {plan.popular && !isCurrent && (
                <span className="absolute right-4 top-4 rounded-full bg-[#9A6B3A] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow">
                  {plan.badge}
                </span>
              )}
              {isCurrent && (
                <span className="absolute right-4 top-4 rounded-full bg-emerald-100 border border-emerald-300 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-800">
                  Faol Rejangiz
                </span>
              )}

              {/* Title & Desc */}
              <div>
                <h3 className="text-base font-black text-[#1E1A14]">{plan.name}</h3>
                <p className="mt-0.5 text-xs text-[#756B5D]">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="my-4 flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-[#1E1A14]">{plan.price}</span>
                <span className="text-xs text-[#756B5D] font-medium">{plan.period}</span>
              </div>

              {/* Features */}
              <div className="space-y-2 mb-5">
                {plan.features.map((f, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <Check className="h-2.5 w-2.5" />
                    </div>
                    <span className="text-[#1E1A14] font-medium">{f}</span>
                  </div>
                ))}
              </div>

              {/* Button */}
              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={isCurrent || isProcessing}
                className={`w-full py-3.5 text-xs font-bold transition rounded-xl ${
                  isCurrent
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-default"
                    : plan.popular
                    ? "btn-electric"
                    : "btn-glass text-[#1E1A14]"
                }`}
              >
                {isProcessing
                  ? "Faollashtirilmoqda..."
                  : isCurrent
                  ? "✓ Joriy Reja"
                  : `${plan.name} rejasiga o'tish`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
