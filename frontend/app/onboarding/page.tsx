"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, ArrowLeft, Award, CheckCircle2 } from "lucide-react";
import {
  getTelegramWebApp,
  hapticFeedback,
  showBackButton,
} from "@/lib/telegram";
import { getProfile, saveProfile } from "@/lib/api";
import { BUSINESS_CATEGORIES, getCategoryById } from "@/lib/businessData";

type WizardStep = "category" | "details" | "success";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<WizardStep>("category");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [selectedType, setSelectedType] = useState("barber");
  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");
  const [workingHours, setWorkingHours] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const cleanup = showBackButton(() => {
      if (step === "details") {
        setStep("category");
      } else {
        router.push("/");
      }
    });
    return cleanup;
  }, [step, router]);

  useEffect(() => {
    loadExistingProfile();
  }, []);

  async function loadExistingProfile() {
    setLoading(true);
    const result = await getProfile();

    if (result.success && result.data?.businessProfile) {
      const bp = result.data.businessProfile;
      setSelectedType(bp.businessType || "barber");
      setBusinessName(bp.name || "");
      setAddress(bp.address || "");
      setWorkingHours(bp.workingHours || "");
      setDescription(bp.description || "");
      setIsEditing(true);
      setStep("details");
    }
    setLoading(false);
  }

  function handleSelectCategory(catId: string) {
    hapticFeedback("selection");
    setSelectedType(catId);
    const cat = getCategoryById(catId);

    if (!businessName) {
      setBusinessName(cat.name.split(" & ")[0] || "Mening Biznesim");
    }
    if (!workingHours) {
      setWorkingHours(cat.defaultWorkingHours);
    }
    if (!address) {
      setAddress(cat.sampleAddress);
    }
    if (!description) {
      setDescription(cat.sampleDescription);
    }

    setStep("details");
  }

  async function handleSave() {
    if (!businessName.trim()) {
      hapticFeedback("notification", "error");
      getTelegramWebApp()?.showAlert("Biznes nomini kiriting");
      return;
    }

    setSaving(true);
    hapticFeedback("impact", "medium");

    const result = await saveProfile({
      businessType: selectedType,
      name: businessName.trim(),
      address: address.trim() || undefined,
      workingHours: workingHours.trim() || undefined,
      description: description.trim() || undefined,
    });

    setSaving(false);

    if (result.success) {
      hapticFeedback("notification", "success");
      setStep("success");
    } else {
      hapticFeedback("notification", "error");
      getTelegramWebApp()?.showAlert(result.error || "Saqlashda xatolik yuz berdi");
    }
  }

  const currentCategory = getCategoryById(selectedType);

  if (loading) {
    return (
      <div className="space-y-4 pt-4">
        <div className="h-8 w-48 rounded-2xl bg-[#EAE3D2] animate-pulse" />
        <div className="grid grid-cols-2 gap-3 mt-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-36 rounded-2xl bg-[#EAE3D2] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-12">
      {/* ======== STEP PROGRESS BAR ======== */}
      <div className="flex items-center justify-between border-b border-[#EAE3D2] pb-3">
        <div className="flex items-center gap-2">
          {["category", "details", "success"].map((s, idx) => {
            const isCompleted =
              (s === "category" && (step === "details" || step === "success")) ||
              (s === "details" && step === "success");
            const isCurrent = step === s;

            return (
              <div key={s} className="flex items-center gap-1.5">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    isCurrent
                      ? "bg-[#1E1A14] text-[#FAF7F2]"
                      : isCompleted
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-[#EAE3D2] text-[#756B5D]"
                  }`}
                >
                  {isCompleted ? <Check className="h-3 w-3" /> : idx + 1}
                </div>
                <span
                  className={`text-xs font-bold ${
                    isCurrent ? "text-[#1E1A14]" : "text-[#756B5D]"
                  }`}
                >
                  {s === "category" ? "Soha" : s === "details" ? "Ma'lumotlar" : "Tayyor"}
                </span>
                {idx < 2 && <span className="text-[#D8CEBC]">/</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* ======== 1-QADAM: SOHANI TANLASH ======== */}
      {step === "category" && (
        <div className="space-y-4">
          <div>
            <h1 className="text-lg font-black text-[#1E1A14]">Biznes sohangizni tanlang</h1>
            <p className="text-xs text-[#756B5D]">
              Sohangizga mos post shablonlari avtomatik tayyorlanadi
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {Object.values(BUSINESS_CATEGORIES).map((cat) => {
              const isSelected = selectedType === cat.id;

              return (
                <div
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`group relative cursor-pointer overflow-hidden rounded-[20px] border transition-all duration-200 active:scale-95 ${
                    isSelected
                      ? "border-[#9A6B3A] ring-2 ring-[#9A6B3A]/30 shadow-cream bg-white"
                      : "border-[#EAE3D2] hover:border-[#D8CEBC] bg-white"
                  }`}
                >
                  <div className="relative h-28 w-full overflow-hidden bg-[#FAF7F2]">
                    <Image
                      src={cat.imageUrl}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <span className="absolute left-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-xl bg-white/80 text-sm backdrop-blur-md shadow">
                      {cat.emoji}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-bold text-[#1E1A14] group-hover:text-[#9A6B3A] transition truncate">
                      {cat.name}
                    </p>
                    <p className="text-[10px] text-[#756B5D] mt-0.5 truncate">
                      {cat.tagline}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======== 2-QADAM: MA'LUMOTLAR ======== */}
      {step === "details" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-black text-[#1E1A14]">Biznes ma&apos;lumotlari</h1>
              <p className="text-xs text-[#756B5D]">{currentCategory.name}</p>
            </div>
            <button
              onClick={() => setStep("category")}
              className="flex items-center gap-1 text-xs font-bold text-[#9A6B3A] hover:underline"
            >
              <ArrowLeft className="h-3 w-3" />
              Sohani almashtirish
            </button>
          </div>

          {/* Selected Category Header Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-[#EAE3D2] bg-white shadow-cream">
            <div className="relative h-24 w-full">
              <Image
                src={currentCategory.imageUrl}
                alt={currentCategory.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex items-center p-4">
                <span className="text-2xl mr-3">{currentCategory.emoji}</span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#FAF7F2]">Tanlangan Soha</p>
                  <p className="text-sm font-bold text-white">{currentCategory.name}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#756B5D]">
                Biznes nomi <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                className="rich-input"
                placeholder="Masalan: Rayhon Cafe"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#756B5D]">
                Manzil
              </label>
              <input
                type="text"
                className="rich-input"
                placeholder="Toshkent sh., Chilonzor tumani"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#756B5D]">
                Ish vaqti
              </label>
              <input
                type="text"
                className="rich-input"
                placeholder="09:00 — 21:00 (Har kuni)"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#756B5D]">
                Qisqacha ta&apos;rif
              </label>
              <textarea
                className="rich-input min-h-[85px] resize-none"
                placeholder="Biznesingiz haqida qisqacha ma'lumot..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Service Tags */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#756B5D] mb-2">
                Ommabop xizmatlar (bosing va qo&apos;shing):
              </p>
              <div className="flex flex-wrap gap-1.5">
                {currentCategory.serviceTags.map((tag, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      hapticFeedback("selection");
                      setDescription((prev) => (prev ? `${prev}, ${tag}` : tag));
                    }}
                    className="rounded-xl border border-[#EAE3D2] bg-white px-2.5 py-1 text-[11px] font-medium text-[#756B5D] hover:border-[#9A6B3A] hover:text-[#1E1A14] active:scale-95"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || !businessName.trim()}
            className="btn-electric w-full py-4 text-xs font-bold mt-2"
          >
            {saving ? "Saqlanmoqda..." : "Saqlash va davom etish"}
          </button>
        </div>
      )}

      {/* ======== 3-BOSQICH: TASDIQ ======== */}
      {step === "success" && (
        <div className="space-y-5 pt-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700 border border-emerald-300 shadow-sm">
            <Award className="h-8 w-8" />
          </div>

          <div>
            <h1 className="text-xl font-black text-[#1E1A14]">Profil saqlandi!</h1>
            <p className="mt-1 text-xs text-[#756B5D] max-w-xs mx-auto">
              Ma&apos;lumotlar yangilandi va barcha postlarda avtomatik qo&apos;llaniladi.
            </p>
          </div>

          {/* Mini preview card */}
          <div className="rounded-[22px] border border-[#EAE3D2] bg-white p-4 text-left shadow-cream">
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-[#FAF7F2]">
                <Image
                  src={currentCategory.imageUrl}
                  alt={businessName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{currentCategory.emoji}</span>
                  <h3 className="text-sm font-bold text-[#1E1A14]">{businessName}</h3>
                  <CheckCircle2 className="h-3.5 w-3.5 fill-[#9A6B3A] text-white" />
                </div>
                <p className="text-xs text-[#756B5D] mt-0.5">{address || "Toshkent"}</p>
                <p className="text-[11px] text-emerald-700 font-semibold">{workingHours}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => router.push("/content")}
              className="btn-electric w-full py-4 text-xs font-bold"
            >
              Post yozishga o&apos;tish
            </button>

            <button
              onClick={() => router.push("/")}
              className="btn-glass w-full py-3 text-xs"
            >
              Asosiy sahifaga qaytish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
