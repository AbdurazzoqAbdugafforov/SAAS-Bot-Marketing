"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Share2,
  Heart,
  MessageCircle,
  Bookmark,
  Send,
  Eye,
  CheckCircle2,
  Image as ImageIcon,
  Flame,
  Lightbulb,
  Star,
  Megaphone,
  Edit3,
  History,
  Trash2,
  X,
  ArrowUpRight,
} from "lucide-react";
import {
  getTelegramWebApp,
  hapticFeedback,
  showBackButton,
} from "@/lib/telegram";
import {
  getProfile,
  generatePost,
  getPosts,
  deletePost,
  GeneratedPost,
  UserProfile,
  SavedPost,
} from "@/lib/api";
import { getCategoryById } from "@/lib/businessData";

const POST_TYPES = [
  { id: "promo", icon: Flame, label: "Aksiya", desc: "Chegirma va sotuvlar" },
  { id: "info", icon: Lightbulb, label: "Maslahat", desc: "Foydali tavsiyalar" },
  { id: "story", icon: Star, label: "Sharh", desc: "Mijozlar tajribasi" },
  { id: "announce", icon: Megaphone, label: "Yangilik", desc: "Katta e'lonlar" },
];

const PLATFORMS = [
  { id: "both", label: "Universal" },
  { id: "instagram", label: "Instagram" },
  { id: "telegram", label: "Telegram" },
];

const TONES = [
  { id: "sotuvchi va jozibali", label: "🔥 Sotuvchi" },
  { id: "samimiy va do'stona", label: "🤝 Samimiy" },
  { id: "premium va hashamatli", label: "🎩 Premium" },
  { id: "aniq va qisqa", label: "🎯 Qisqa" },
];

function ContentGeneratorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<SavedPost[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedHistoryId, setCopiedHistoryId] = useState<number | null>(null);

  // Form states
  const [topic, setTopic] = useState("");
  const [postType, setPostType] = useState("promo");
  const [platform, setPlatform] = useState("both");
  const [tone, setTone] = useState("sotuvchi va jozibali");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [previewTab, setPreviewTab] = useState<"instagram" | "telegram">("instagram");
  const [isEditing, setIsEditing] = useState(false);

  // AI Result
  const [result, setResult] = useState<GeneratedPost | null>(null);
  const [editableContent, setEditableContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const cleanup = showBackButton(() => router.push("/"));
    return cleanup;
  }, [router]);

  useEffect(() => {
    loadData();

    const initialTopic = searchParams.get("topic");
    const initialType = searchParams.get("type");
    if (initialTopic) setTopic(decodeURIComponent(initialTopic));
    if (initialType) setPostType(initialType);
  }, [searchParams]);

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
        setHistory(postsRes.data);
      }
    } catch (e) {
      console.error("Content studio data load error:", e);
    } finally {
      setLoading(false);
    }
  }

  async function refreshHistory() {
    const postsRes = await getPosts();
    if (postsRes.success && postsRes.data) {
      setHistory(postsRes.data);
    }
  }

  const business = profile?.businessProfile;
  const category = getCategoryById(business?.businessType || "barber");
  const currentPhoto =
    category.galleryImages?.[selectedImageIndex] || category.imageUrl;

  async function handleGenerate() {
    if (!topic.trim()) {
      hapticFeedback("notification", "error");
      getTelegramWebApp()?.showAlert("Post mavzusi yoki g'oyasini kiriting");
      return;
    }

    setGenerating(true);
    setError("");
    setResult(null);
    setIsEditing(false);
    setShowHistory(false);
    hapticFeedback("impact", "heavy");

    const res = await generatePost({
      businessType: business?.businessType || "barber",
      businessName: business?.name || "Mening Biznesim",
      topic: topic.trim(),
      postType,
      platform,
      tone,
      address: business?.address || "",
      workingHours: business?.workingHours || "",
      imageUrl: currentPhoto,
    });

    setGenerating(false);

    if (res.success && res.data) {
      setResult(res.data);
      setEditableContent(res.data.content);
      hapticFeedback("notification", "success");
      refreshHistory();
    } else {
      setError(res.error || "Matn yaratishda xatolik yuz berdi");
      hapticFeedback("notification", "error");
    }
  }

  async function handleCopy() {
    const textToCopy = editableContent || result?.content;
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      hapticFeedback("notification", "success");
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  }

  function handleShareToTelegram() {
    const textToShare = editableContent || result?.content;
    if (!textToShare) return;
    const url = `https://t.me/share/url?text=${encodeURIComponent(textToShare)}`;
    window.open(url, "_blank");
  }

  function handleLoadFromHistory(post: SavedPost) {
    setTopic(post.topic);
    setPostType(post.postType);
    setEditableContent(post.content);
    setResult({
      content: post.content,
      platform: post.platform,
      type: post.postType,
      isDemo: false,
    });
    setShowHistory(false);
    hapticFeedback("impact", "medium");
  }

  async function handleDeletePost(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    hapticFeedback("impact", "light");
    const res = await deletePost(id);
    if (res.success) {
      setHistory((prev) => prev.filter((p) => p.id !== id));
    }
  }

  async function handleCopyHistoryText(id: number, text: string, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedHistoryId(id);
      hapticFeedback("notification", "success");
      setTimeout(() => setCopiedHistoryId(null), 2000);
    } catch {
      setCopiedHistoryId(id);
      setTimeout(() => setCopiedHistoryId(null), 2000);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 pt-4">
        <div className="h-10 w-48 rounded-2xl bg-[#EAE3D2] animate-pulse" />
        <div className="h-48 w-full rounded-3xl bg-[#EAE3D2] animate-pulse" />
        <div className="h-32 w-full rounded-2xl bg-[#EAE3D2] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-12">
      {/* ======== HEADER ======== */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-2xl border border-[#EAE3D2] shadow-sm">
            <Image
              src={category.imageUrl}
              alt={business?.name || "Biznes"}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-extrabold text-[#1E1A14]">
                {business?.name || "Biznes"}
              </h1>
              <CheckCircle2 className="h-4 w-4 fill-[#9A6B3A] text-white" />
            </div>
            <p className="text-xs text-[#756B5D]">{category.name}</p>
          </div>
        </div>

        {/* Tarix Tugmasi */}
        <button
          onClick={() => {
            hapticFeedback("selection");
            setShowHistory(!showHistory);
          }}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
            showHistory
              ? "bg-[#1E1A14] text-[#FAF7F2]"
              : "border border-[#EAE3D2] bg-white text-[#756B5D] hover:text-[#1E1A14]"
          }`}
        >
          <History className="h-3.5 w-3.5 text-[#9A6B3A]" />
          <span>Tarix</span>
          {history.length > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FAF7F2] text-[10px] font-extrabold text-[#9A6B3A]">
              {history.length}
            </span>
          )}
        </button>
      </header>

      {/* ======== TARIX PANEL (EXPANDABLE) ======== */}
      {showHistory && (
        <div className="rounded-[26px] border border-[#EAE3D2] bg-white p-4 shadow-cream space-y-3">
          <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-2">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-[#9A6B3A]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#1E1A14]">
                Saqlangan Postlar ({history.length})
              </h2>
            </div>
            <button
              onClick={() => setShowHistory(false)}
              className="rounded-lg p-1 text-[#756B5D] hover:bg-[#FAF7F2]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {history.length === 0 ? (
            <p className="py-6 text-center text-xs text-[#756B5D]">
              Hali postlar tarixi mavjud emas. Yangi post yarating!
            </p>
          ) : (
            <div className="max-h-[360px] overflow-y-auto space-y-2 pr-1">
              {history.map((item) => {
                const isCopied = copiedHistoryId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleLoadFromHistory(item)}
                    className="group cursor-pointer rounded-2xl border border-[#EAE3D2] bg-[#FAF7F2] p-3 transition hover:border-[#9A6B3A] hover:bg-white"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded-md bg-white border border-[#EAE3D2] px-1.5 py-0.5 text-[9px] font-bold text-[#9A6B3A] uppercase">
                          {item.postType}
                        </span>
                        <p className="text-xs font-bold text-[#1E1A14] line-clamp-1 max-w-[160px]">
                          {item.topic}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => handleCopyHistoryText(item.id, item.content, e)}
                          className="flex h-7 items-center gap-1 rounded-lg border border-[#EAE3D2] bg-white px-2 text-[10px] font-bold text-[#1E1A14] hover:border-[#9A6B3A]"
                        >
                          {isCopied ? (
                            <Check className="h-3 w-3 text-emerald-600" />
                          ) : (
                            <Copy className="h-3 w-3 text-[#756B5D]" />
                          )}
                          <span>{isCopied ? "Nusxalandi" : "Nusxa"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeletePost(item.id, e)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#EAE3D2] bg-white text-[#756B5D] hover:text-rose-600 hover:border-rose-300"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="mt-1.5 text-xs text-[#756B5D] line-clamp-2 leading-relaxed">
                      {item.content}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-[#A89E90]">
                      <span>{new Date(item.createdAt).toLocaleDateString("uz-UZ")}</span>
                      <span className="flex items-center gap-1 text-[#9A6B3A] font-bold group-hover:underline">
                        <span>Yuklash</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ======== FORMA ======== */}
      {!result ? (
        <div className="space-y-5">
          {/* Post Turi Cards */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#756B5D]">
              Post yo&apos;nalishi
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {POST_TYPES.map((t) => {
                const isSelected = postType === t.id;
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      hapticFeedback("selection");
                      setPostType(t.id);
                    }}
                    className={`flex items-start gap-3 rounded-2xl border p-3 text-left transition-all ${
                      isSelected
                        ? "border-[#9A6B3A] bg-[#F7EFE6] shadow-cream"
                        : "border-[#EAE3D2] bg-white hover:border-[#D8CEBC] hover:bg-[#FAF7F2]"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                        isSelected
                          ? "bg-[#9A6B3A] text-white"
                          : "bg-[#F4EFE6] text-[#756B5D]"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1E1A14]">{t.label}</p>
                      <p className="text-[10px] text-[#756B5D]">{t.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mavzu Input */}
          <div className="rich-card p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1E1A14]">
                Mavzu yoki g&apos;oyangiz
              </label>
              <span className="text-[11px] font-semibold text-[#756B5D]">
                {topic.length}/400
              </span>
            </div>
            <textarea
              className="rich-input min-h-[110px] resize-none"
              placeholder="Masalan: Hafta oxiri uchun 20% chegirma aksiyasi yoki yangi xizmatimiz taqdimoti..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              maxLength={400}
            />

            {/* Tayyor shablon chiplari */}
            <div className="mt-3">
              <p className="text-[11px] font-bold text-[#756B5D] mb-2">
                💡 Tayyor tavsiya g&apos;oyalar:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {category.postIdeas.map((idea, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      hapticFeedback("selection");
                      setTopic(idea.topic);
                      setPostType(idea.type);
                    }}
                    className="rounded-xl border border-[#EAE3D2] bg-[#FAF7F2] px-3 py-1.5 text-xs text-[#1E1A14] transition hover:border-[#9A6B3A] hover:bg-[#F4EFE6] active:scale-95 text-left"
                  >
                    {idea.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Surat Tanlash (Photo Gallery Picker) */}
          <div className="rich-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <ImageIcon className="h-4 w-4 text-[#9A6B3A]" />
                <label className="text-xs font-bold uppercase tracking-wider text-[#1E1A14]">
                  Post uchun surat tanlang
                </label>
              </div>
              <span className="text-[11px] text-[#756B5D]">
                {category.galleryImages?.length || 1} ta surat
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {(category.galleryImages || [category.imageUrl]).map((imgUrl, idx) => {
                const isSelected = selectedImageIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      hapticFeedback("selection");
                      setSelectedImageIndex(idx);
                    }}
                    className={`group relative h-20 cursor-pointer overflow-hidden rounded-xl border transition-all ${
                      isSelected
                        ? "border-[#9A6B3A] ring-2 ring-[#9A6B3A]/30 shadow-cream"
                        : "border-[#EAE3D2] opacity-75 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt="Gallery"
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="100px"
                    />
                    {isSelected && (
                      <div className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#9A6B3A] text-white shadow">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ohang va Platforma */}
          <div className="grid grid-cols-2 gap-3">
            {/* Ohang */}
            <div className="rich-card p-3.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#756B5D] mb-2">
                Ohang
              </label>
              <div className="space-y-1.5">
                {TONES.map((t) => {
                  const isSelected = tone === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        hapticFeedback("selection");
                        setTone(t.id);
                      }}
                      className={`w-full rounded-xl border px-3 py-2 text-left text-xs font-bold transition ${
                        isSelected
                          ? "border-[#9A6B3A] bg-[#F7EFE6] text-[#1E1A14]"
                          : "border-[#EAE3D2] bg-[#FAF7F2] text-[#756B5D] hover:border-[#D8CEBC]"
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Platforma */}
            <div className="rich-card p-3.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#756B5D] mb-2">
                Format
              </label>
              <div className="space-y-1.5">
                {PLATFORMS.map((p) => {
                  const isSelected = platform === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        hapticFeedback("selection");
                        setPlatform(p.id);
                      }}
                      className={`w-full rounded-xl border px-3 py-2 text-left text-xs font-bold transition ${
                        isSelected
                          ? "border-[#9A6B3A] bg-[#F7EFE6] text-[#1E1A14]"
                          : "border-[#EAE3D2] bg-[#FAF7F2] text-[#756B5D] hover:border-[#D8CEBC]"
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs text-rose-700">
              {error}
            </div>
          )}

          {/* Generatsiya Tugmasi */}
          <button
            onClick={handleGenerate}
            disabled={generating || !topic.trim()}
            className="btn-electric w-full py-4 text-sm"
          >
            {generating ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Matn tayyorlanmoqda...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Sotuvchi Post Yaratish
              </span>
            )}
          </button>
        </div>
      ) : (
        /* ======== NATIJA VA LIVE MOCKUP PREVIEW ======== */
        <div className="space-y-4">
          {/* Mockup Tab Tanlash */}
          <div className="flex items-center justify-between border-b border-[#EAE3D2] pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#756B5D]">
              Jonli Ko&apos;rinish
            </span>
            <div className="flex rounded-xl bg-[#F0E9DC] p-1 border border-[#EAE3D2]">
              <button
                onClick={() => setPreviewTab("instagram")}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                  previewTab === "instagram"
                    ? "bg-white text-[#1E1A14] shadow-sm"
                    : "text-[#756B5D] hover:text-[#1E1A14]"
                }`}
              >
                📸 Instagram
              </button>
              <button
                onClick={() => setPreviewTab("telegram")}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                  previewTab === "telegram"
                    ? "bg-white text-[#1E1A14] shadow-sm"
                    : "text-[#756B5D] hover:text-[#1E1A14]"
                }`}
              >
                ✈️ Telegram
              </button>
            </div>
          </div>

          {/* ======== INSTAGRAM MOCKUP ======== */}
          {previewTab === "instagram" ? (
            <div className="overflow-hidden rounded-[24px] border border-[#EAE3D2] bg-white shadow-cream">
              {/* Profile Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#F4EFE6]">
                <div className="flex items-center gap-2.5">
                  <div className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-[#9A6B3A]">
                    <Image
                      src={currentPhoto}
                      alt={business?.name || "Business"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1E1A14] leading-none">
                      {(business?.name || "biznes").toLowerCase().replace(/\s+/g, "_")}
                    </p>
                    <p className="text-[10px] text-[#756B5D] mt-0.5">
                      {business?.address || "Tashkent, Uzbekistan"}
                    </p>
                  </div>
                </div>
                <span className="text-[#9E9484] font-bold">•••</span>
              </div>

              {/* Selected Photo */}
              <div className="relative h-64 w-full overflow-hidden bg-[#FAF7F2]">
                <Image
                  src={currentPhoto}
                  alt="Post banner"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Instagram Action Buttons */}
              <div className="px-4 pt-3 flex items-center justify-between text-[#1E1A14]">
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
                  <MessageCircle className="h-5 w-5" />
                  <Send className="h-5 w-5" />
                </div>
                <Bookmark className="h-5 w-5" />
              </div>

              {/* Caption */}
              <div className="p-4 pt-2">
                {isEditing ? (
                  <textarea
                    value={editableContent}
                    onChange={(e) => setEditableContent(e.target.value)}
                    className="w-full rounded-xl border border-[#9A6B3A] bg-[#FAF7F2] p-3 text-xs text-[#1E1A14] outline-none min-h-[140px]"
                  />
                ) : (
                  <p className="text-xs text-[#1E1A14] whitespace-pre-line leading-relaxed">
                    <span className="font-bold mr-1.5 text-[#1E1A14]">
                      {(business?.name || "biznes").toLowerCase().replace(/\s+/g, "_")}
                    </span>
                    {editableContent}
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* ======== TELEGRAM MOCKUP ======== */
            <div className="rounded-[24px] border border-[#EAE3D2] bg-white p-4 shadow-cream">
              {/* Telegram Channel Header */}
              <div className="flex items-center gap-2.5 mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#F0E9DC] text-[#9A6B3A] font-bold text-sm">
                  {category.emoji}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1E1A14]">{business?.name || "Kanal"}</p>
                  <p className="text-[10px] text-[#756B5D]">1,480 obunachilar</p>
                </div>
              </div>

              {/* Telegram Photo */}
              <div className="relative h-48 w-full overflow-hidden rounded-2xl mb-3">
                <Image
                  src={currentPhoto}
                  alt="Telegram post"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Telegram Message Bubble */}
              <div className="rounded-2xl bg-[#F7F3EB] p-4 text-xs text-[#1E1A14] whitespace-pre-line leading-relaxed border border-[#EAE3D2]">
                {isEditing ? (
                  <textarea
                    value={editableContent}
                    onChange={(e) => setEditableContent(e.target.value)}
                    className="w-full rounded-xl border border-[#9A6B3A] bg-white p-3 text-xs text-[#1E1A14] outline-none min-h-[140px]"
                  />
                ) : (
                  editableContent
                )}
                <div className="mt-3 flex items-center justify-end gap-1 text-[10px] text-[#756B5D]">
                  <Eye className="h-3 w-3" />
                  <span>420</span>
                  <span className="ml-1">16:45</span>
                </div>
              </div>
            </div>
          )}

          {/* Copied Toast */}
          {copied && (
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50 py-2.5 text-xs font-bold text-emerald-800 shadow-sm animate-fade-in">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Nusxalandi! Instagram yoki Telegramga joylashingiz mumkin.
            </div>
          )}

          {/* Action Buttons Toolbar */}
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handleCopy}
                className="btn-electric py-3 text-xs font-bold"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Nusxalandi!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Matnni nusxalash
                  </>
                )}
              </button>

              <button
                onClick={handleShareToTelegram}
                className="btn-glass py-3 text-xs font-bold text-[#1E1A14]"
              >
                <Share2 className="h-4 w-4 text-[#9A6B3A]" />
                Telegramda ulashish
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn-glass flex-1 py-2 text-xs"
              >
                <Edit3 className="h-3.5 w-3.5 text-[#9A6B3A]" />
                {isEditing ? "Tayyor" : "Tahrirlash"}
              </button>

              <button
                onClick={handleGenerate}
                disabled={generating}
                className="btn-glass flex-1 py-2 text-xs"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Qayta generatsiya
              </button>

              <button
                onClick={() => {
                  setResult(null);
                  setTopic("");
                }}
                className="btn-glass flex-1 py-2 text-xs text-[#9A6B3A]"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Yangi post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ContentPage() {
  return (
    <Suspense fallback={<div className="h-48 rounded-2xl bg-[#EAE3D2] animate-pulse" />}>
      <ContentGeneratorContent />
    </Suspense>
  );
}
