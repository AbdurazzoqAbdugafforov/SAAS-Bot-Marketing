// ============================================
// BiznesOS AI — API Client
// ============================================
// Backend API bilan ishlash uchun HTTP client.

import { getInitData } from "./telegram";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * API so'rov yuborish uchun umumiy funksiya.
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string; error?: string }> {
  try {
    const initData = getInitData();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    // Telegram auth headeri
    if (initData) {
      headers["x-telegram-init-data"] = initData;
    } else {
      // Development mode
      headers["x-telegram-init-data"] = "dev-mode";
      headers["x-telegram-id"] = "123456789";
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Noma'lum xatolik yuz berdi",
    };
  }
}

// ============================================
// Profil API
// ============================================

export interface UserProfile {
  id: number;
  telegramId: string;
  name: string | null;
  username: string | null;
  createdAt: string;
  businessProfile: BusinessProfile | null;
  subscription: SubscriptionData | null;
}

export interface BusinessProfile {
  id: number;
  businessType: string;
  name: string;
  address: string | null;
  workingHours: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionData {
  id: number;
  plan: "free" | "pro" | "premium";
  status: "active" | "expired" | "cancelled";
  expiresAt: string | null;
  createdAt: string;
}

/**
 * Foydalanuvchi profilini olish.
 */
export async function getProfile() {
  return apiRequest<UserProfile>("/api/profile");
}

/**
 * Biznes profilini saqlash/yangilash.
 */
export async function saveProfile(data: {
  businessType: string;
  name: string;
  address?: string;
  workingHours?: string;
  description?: string;
}) {
  return apiRequest<BusinessProfile>("/api/profile", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Biznes profilini o'chirish.
 */
export async function deleteProfile() {
  return apiRequest("/api/profile", {
    method: "DELETE",
  });
}

// ============================================
// AI Post Generatsiya API
// ============================================

export interface GeneratedPost {
  id?: number | null;
  content: string;
  platform: string;
  type: string;
  tokensUsed?: number;
  isDemo: boolean;
  createdAt?: string;
}

export interface PostTypesResponse {
  postTypes: Array<{ id: string; name: string }>;
  platforms: Array<{ id: string; name: string }>;
  businessTypes: Array<{ id: string; name: string }>;
}

/**
 * AI yordamida post yaratish.
 */
export async function generatePost(data: {
  businessType: string;
  businessName: string;
  topic: string;
  postType?: string;
  platform?: string;
  language?: string;
  tone?: string;
  address?: string;
  workingHours?: string;
  imageUrl?: string | null;
}) {
  return apiRequest<GeneratedPost>("/api/generate-post", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Post turlarini olish.
 */
export async function getPostTypes() {
  return apiRequest<PostTypesResponse>("/api/generate-post/types");
}

// ============================================
// Saqlangan Postlar Tarixi API
// ============================================

export interface SavedPost {
  id: number;
  userId: number;
  businessType: string;
  topic: string;
  postType: string;
  platform: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
}

/**
 * Barcha saqlangan postlar tarixini olish.
 */
export async function getPosts() {
  return apiRequest<SavedPost[]>("/api/posts");
}

/**
 * Postni saqlash.
 */
export async function savePostToHistory(data: {
  businessType: string;
  topic: string;
  postType: string;
  platform: string;
  content: string;
  imageUrl?: string | null;
}) {
  return apiRequest<SavedPost>("/api/posts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Postni o'chirish.
 */
export async function deletePost(id: number) {
  return apiRequest<{ message: string }>(`/api/posts/${id}`, {
    method: "DELETE",
  });
}

// ============================================
// Obuna API
// ============================================

/**
 * Obuna ma'lumotlarini olish.
 */
export async function getSubscription() {
  return apiRequest<SubscriptionData>("/api/subscription");
}

/**
 * Obuna rejasini yangilash.
 */
export async function upgradeSubscription(plan: string) {
  return apiRequest<SubscriptionData>("/api/subscription/upgrade", {
    method: "POST",
    body: JSON.stringify({ plan }),
  });
}
