"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Clock,
  MapPin,
  ArrowRight,
  Zap,
  CheckCircle2,
  Plus,
  Flame,
  Lightbulb,
  Star,
  Megaphone,
  TrendingUp,
  SlidersHorizontal,
  Bot,
  Copy,
  Check,
  History,
  FileText,
} from "lucide-react";
import { initTelegramApp, getTelegramUser, hapticFeedback } from "@/lib/telegram";
import { getProfile, getPosts, UserProfile, SavedPost } from "@/lib/api";
import { getCategoryById } from "@/lib/businessData";

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recentPosts, setRecentPosts] = useState<SavedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    initTelegramApp();
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [profileRes, postsRes] = await Promise.all([
        getProfile(),
        getPosts(),
      ]);

      if (profileRes.success && profileRes.data) {
        setProfile(profileRes.data);
      }
      if (postsRes.success && postsRes.data) {
        setRecentPosts(postsRes.data);
      }
    } catch (e) {
      console.error("Dashboard load data error:", e);
    } finally {
      setLoading(false);
    }
  }

  const handleCopyPost = async (id: number, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      hapticFeedback("notification", "success");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const tgUser = getTelegramUser();
  const userName = profile?.name || tgUser?.first_name || "Tadbirkor";
  const business = profile?.businessProfile;
  const category = getCategoryById(business?.businessType || "barber");
  const subscription = profile?.subscription;

  if (loading) {
    return (
      <div className="space-y-4 pt-3">
        <div className="flex items-center justify-between">
          <div className="h-10 w-36 rounded-2xl bg-[#EAE3D2] animate-pulse" />
          <div className="h-8 w-24 rounded-full bg-[#EAE3D2] animate-pulse" />
        </div>
        <div className="h-56 w-full rounded-3xl bg-[#EAE3D2] animate-pulse" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-28 rounded-2xl bg-[#EAE3D2] animate-pulse" />
          <div className="h-28 rounded-2xl bg-[#EAE3D2] animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-12">
      {/* ======== TOP HEADER ======== */}
      <header className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1E1A14] font-extrabold text-[#FAF7F2] shadow-sm">
            {userName.charAt(0).toUpperCase()}
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#FAF7F2] p-0.5">
              <span className="h-full w-full rounded-full bg-emerald-500" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold text-[#756B5D]">BiznesOS</p>
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </div>
            <h1 className="text-base font-extrabold tracking-tight text-[#1E1A14]">{userName}</h1>
          </div>
        </div>

        {/* Plan Pill */}
        <Link
          href="/subscription"
          onClick={() => hapticFeedback("selection")}
          className="badge-glow-amber transition hover:opacity-80"
        >
          <Zap className="h-3 w-3 fill-[#9A6B3A] text-[#9A6B3A]" />
          <span>{subscription?.plan?.toUpperCase() || "FREE"}</span>
        </Link>
      </header>

      {/* ======== HERO BIZNES KARTA ======== */}
      {business ? (
        <div className="group relative overflow-hidden rounded-[26px] border border-[#EAE3D2] bg-white shadow-cream transition-all duration-300">
          {/* Photo Banner with Warm Gradient Overlays */}
          <div className="relative h-44 w-full overflow-hidden bg-[#F4EFE6]">
            <Image
              src={category.imageUrl}
              alt={business.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
              sizes="(max-width: 640px) 100vw, 480px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />

            {/* Category Badge */}
            <div className="absolute left-3.5 top-3.5 flex items-center gap-1.5 rounded-full border border-white/60 bg-white/80 px-3 py-1 text-xs font-semibold text-[#1E1A14] shadow backdrop-blur-md">
              <span>{category.emoji}</span>
              <span>{category.name}</span>
            </div>
          </div>

          {/* Details */}
          <div className="relative -mt-6 p-4 pt-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-lg font-black tracking-tight text-[#1E1A14]">
                    {business.name}
                  </h2>
                  <CheckCircle2 className="h-4 w-4 fill-[#9A6B3A] text-white" />
                </div>
                <p className="mt-0.5 text-xs text-[#756B5D] line-clamp-1">
                  {business.description || category.sampleDescription}
                </p>
              </div>

              <Link
                href="/onboarding"
                onClick={() => hapticFeedback("selection")}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#EAE3D2] bg-[#FAF7F2] text-[#756B5D] transition hover:border-[#9A6B3A] hover:text-[#1E1A14]"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Link>
            </div>

            {/* Meta Tags */}
            <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs text-[#756B5D] border-t border-[#F4EFE6] pt-3">
              {business.workingHours && (
                <div className="flex items-center gap-1.5 rounded-lg border border-[#EAE3D2] bg-[#FAF7F2] px-2.5 py-1 font-medium">
                  <Clock className="h-3.5 w-3.5 text-[#9A6B3A]" />
                  <span>{business.workingHours}</span>
                </div>
              )}
              {business.address && (
                <div className="flex items-center gap-1.5 rounded-lg border border-[#EAE3D2] bg-[#FAF7F2] px-2.5 py-1 font-medium">
                  <MapPin className="h-3.5 w-3.5 text-rose-500" />
                  <span className="line-clamp-1 max-w-[200px]">{business.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className="rounded-[26px] border border-[#EAE3D2] bg-white p-5 shadow-cream">
          <div className="flex flex-col items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#EAE3D2] bg-[#FAF7F2] text-xl text-[#9A6B3A]">
              🏢
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1E1A14]">Biznes profilingizni sozlang</h2>
              <p className="mt-1 text-xs text-[#756B5D] leading-relaxed">
                Sohangizni tanlang va ish vaqtingizni kiriting — SMM postlar to&apos;liq moslashadi.
              </p>
            </div>
            <Link
              href="/onboarding"
              onClick={() => hapticFeedback("impact", "medium")}
              className="btn-electric w-full py-3"
            >
              <Plus className="h-4 w-4" />
              Profil yaratish (1 daqiqa)
            </Link>
          </div>
        </div>
      )}

      {/* ======== STATS ROW ======== */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="rounded-2xl border border-[#EAE3D2] bg-white p-3 text-center shadow-sm">
          <p className="text-[11px] font-semibold text-[#756B5D]">Postlar</p>
          <p className="mt-1 text-base font-black text-[#1E1A14]">
            {recentPosts.length} <span className="text-xs font-normal text-[#756B5D]">ta</span>
          </p>
        </div>
        <div className="rounded-2xl border border-[#EAE3D2] bg-white p-3 text-center shadow-sm">
          <p className="text-[11px] font-semibold text-[#756B5D]">Tarif</p>
          <p className="mt-1 text-base font-black text-[#9A6B3A]">
            {subscription?.plan?.toUpperCase() || "FREE"}
          </p>
        </div>
        <div className="rounded-2xl border border-[#EAE3D2] bg-white p-3 text-center shadow-sm">
          <p className="text-[11px] font-semibold text-[#756B5D]">AI Model</p>
          <p className="mt-1 text-base font-black text-[#1E1A14]">Gemini</p>
        </div>
      </div>

      {/* ======== NIMA YARATMOQCHISIZ? (4-GRID ACTION TILES) ======== */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#756B5D]">
            Nima yaratmoqchisiz?
          </h3>
          <span className="text-[11px] font-bold text-[#9A6B3A]">Tezkor Studio</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* 1. Aksiya */}
          <div
            onClick={() => {
              hapticFeedback("impact", "light");
              router.push("/content?type=promo");
            }}
            className="group cursor-pointer rounded-2xl border border-[#EAE3D2] bg-white p-3.5 transition hover:border-[#9A6B3A] hover:shadow-cream active:scale-[0.98]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
              <Flame className="h-5 w-5" />
            </div>
            <h4 className="mt-2.5 text-xs font-bold text-[#1E1A14] group-hover:text-[#9A6B3A] transition">
              Aksiya & Chegirma
            </h4>
            <p className="mt-0.5 text-[10px] text-[#756B5D]">Sotuvlarni oshirish</p>
          </div>

          {/* 2. Maslahat */}
          <div
            onClick={() => {
              hapticFeedback("impact", "light");
              router.push("/content?type=info");
            }}
            className="group cursor-pointer rounded-2xl border border-[#EAE3D2] bg-white p-3.5 transition hover:border-[#9A6B3A] hover:shadow-cream active:scale-[0.98]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
              <Lightbulb className="h-5 w-5" />
            </div>
            <h4 className="mt-2.5 text-xs font-bold text-[#1E1A14] group-hover:text-[#9A6B3A] transition">
              Foydali Maslahat
            </h4>
            <p className="mt-0.5 text-[10px] text-[#756B5D]">Ekspertlik va ishonch</p>
          </div>

          {/* 3. Sharh */}
          <div
            onClick={() => {
              hapticFeedback("impact", "light");
              router.push("/content?type=story");
            }}
            className="group cursor-pointer rounded-2xl border border-[#EAE3D2] bg-white p-3.5 transition hover:border-[#9A6B3A] hover:shadow-cream active:scale-[0.98]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-700 border border-violet-200">
              <Star className="h-5 w-5" />
            </div>
            <h4 className="mt-2.5 text-xs font-bold text-[#1E1A14] group-hover:text-[#9A6B3A] transition">
              Mijoz Sharhi
            </h4>
            <p className="mt-0.5 text-[10px] text-[#756B5D]">Ijtimoiy isbot (Proof)</p>
          </div>

          {/* 4. Yangilik */}
          <div
            onClick={() => {
              hapticFeedback("impact", "light");
              router.push("/content?type=announce");
            }}
            className="group cursor-pointer rounded-2xl border border-[#EAE3D2] bg-white p-3.5 transition hover:border-[#9A6B3A] hover:shadow-cream active:scale-[0.98]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-700 border border-sky-200">
              <Megaphone className="h-5 w-5" />
            </div>
            <h4 className="mt-2.5 text-xs font-bold text-[#1E1A14] group-hover:text-[#9A6B3A] transition">
              Yangi E&apos;lon
            </h4>
            <p className="mt-0.5 text-[10px] text-[#756B5D]">Xizmat va mahsulotlar</p>
          </div>
        </div>
      </section>

      {/* ======== OXIRGI YARATILGAN POSTLAR (TARIX) ======== */}
      {recentPosts.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <History className="h-4 w-4 text-[#9A6B3A]" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#756B5D]">
                Oxirgi Postlar Tarixi
              </h3>
            </div>
            <Link
              href="/content"
              onClick={() => hapticFeedback("selection")}
              className="text-[11px] font-bold text-[#9A6B3A] hover:underline"
            >
              Studio&apos;ga o&apos;tish →
            </Link>
          </div>

          <div className="space-y-2.5">
            {recentPosts.slice(0, 3).map((p) => {
              const isCopied = copiedId === p.id;
              return (
                <div
                  key={p.id}
                  className="rounded-2xl border border-[#EAE3D2] bg-white p-3.5 shadow-sm transition hover:border-[#9A6B3A]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-[#FAF7F2] border border-[#EAE3D2] px-2 py-0.5 text-[10px] font-bold text-[#9A6B3A] uppercase">
                        {p.postType}
                      </span>
                      <span className="text-[11px] font-bold text-[#1E1A14] line-clamp-1 max-w-[180px]">
                        {p.topic}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopyPost(p.id, p.content)}
                      className={`flex h-7 items-center gap-1 rounded-lg px-2.5 text-[11px] font-bold transition ${
                        isCopied
                          ? "bg-emerald-600 text-white"
                          : "border border-[#EAE3D2] bg-[#FAF7F2] text-[#1E1A14] hover:bg-[#F2ECE1]"
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3 w-3" />
                          <span>Ko&apos;chirildi!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Nusxa</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="mt-2 text-xs text-[#756B5D] line-clamp-2 leading-relaxed">
                    {p.content}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[10px] text-[#A89E90] border-t border-[#F4EFE6] pt-1.5">
                    <span>{new Date(p.createdAt).toLocaleDateString("uz-UZ")}</span>
                    <span>{p.platform === "both" ? "Instagram & Telegram" : p.platform}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ======== BUGUNGI TAVSIYA G'OYALAR ======== */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#756B5D]">
              Bugungi Tavsiya G&apos;oyalar
            </h3>
          </div>
          <span className="text-[11px] font-bold text-[#9A6B3A]">
            {category.name.split(" & ")[0]}
          </span>
        </div>

        <div className="space-y-2">
          {category.postIdeas.slice(0, 3).map((idea, index) => (
            <div
              key={index}
              onClick={() => {
                hapticFeedback("impact", "medium");
                router.push(`/content?topic=${encodeURIComponent(idea.topic)}&type=${idea.type}`);
              }}
              className="group flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-[#EAE3D2] bg-white p-3.5 transition hover:border-[#9A6B3A] hover:shadow-cream active:scale-[0.98]"
            >
              <div className="flex-1 pr-2">
                <p className="text-xs font-bold text-[#1E1A14] group-hover:text-[#9A6B3A] transition">
                  {idea.title}
                </p>
                <p className="mt-0.5 text-[11px] text-[#756B5D] line-clamp-1">
                  {idea.topic}
                </p>
              </div>

              <div className="flex h-8 shrink-0 items-center gap-1 rounded-xl border border-[#EAE3D2] bg-[#FAF7F2] px-3 text-[11px] font-extrabold text-[#9A6B3A] group-hover:bg-[#1E1A14] group-hover:text-[#FAF7F2] transition">
                <span>Yozish</span>
                <Sparkles className="h-3 w-3" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======== TELEGRAM BOT INFO KARTASI ======== */}
      <div className="rounded-2xl border border-[#EAE3D2] bg-white p-4 shadow-cream">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#FAF7F2] text-[#9A6B3A] border border-[#EAE3D2]">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1E1A14]">Telegram Bot integratsiyasi</p>
              <p className="text-[11px] text-[#756B5D]">Botda /post buyrug&apos;i orqali ham post yozishingiz mumkin</p>
            </div>
          </div>
          <Link
            href="/subscription"
            onClick={() => hapticFeedback("selection")}
            className="shrink-0 rounded-xl border border-[#EAE3D2] bg-[#FAF7F2] px-3 py-1.5 text-xs font-bold text-[#1E1A14] hover:bg-[#F2ECE1]"
          >
            Tariflar
          </Link>
        </div>
      </div>
    </div>
  );
}
