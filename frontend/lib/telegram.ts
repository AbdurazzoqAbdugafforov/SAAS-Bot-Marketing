// ============================================
// BiznesOS AI — Telegram WebApp Utility
// ============================================
// Telegram WebApp SDK bilan ishlash uchun
// yordamchi funksiyalar.

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    query_id?: string;
    user?: TelegramUser;
    auth_date?: number;
    hash?: string;
  };
  version: string;
  platform: string;
  colorScheme: "light" | "dark";
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  BackButton: {
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  HapticFeedback: {
    impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
    notificationOccurred: (type: "error" | "success" | "warning") => void;
    selectionChanged: () => void;
  };
  close: () => void;
  expand: () => void;
  ready: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  showPopup: (params: {
    title?: string;
    message: string;
    buttons?: Array<{
      id?: string;
      type?: "default" | "ok" | "close" | "cancel" | "destructive";
      text?: string;
    }>;
  }, callback?: (buttonId: string) => void) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

/**
 * Telegram WebApp obyektini olish.
 */
export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window !== "undefined" && window.Telegram?.WebApp) {
    return window.Telegram.WebApp;
  }
  return null;
}

/**
 * Telegram foydalanuvchi ma'lumotlarini olish.
 */
export function getTelegramUser(): TelegramUser | null {
  const webapp = getTelegramWebApp();
  return webapp?.initDataUnsafe?.user || null;
}

/**
 * Telegram initData ni olish (auth uchun).
 */
export function getInitData(): string {
  const webapp = getTelegramWebApp();
  return webapp?.initData || "";
}

/**
 * WebApp ni ishga tushirish va sozlash.
 */
export function initTelegramApp(): void {
  const webapp = getTelegramWebApp();
  if (!webapp) return;

  // Mini-App tayyor ekanligini bildirish
  webapp.ready();

  // To'liq ekranga kengaytirish
  webapp.expand();

  // Dark mode uchun header va background ranglarini sozlash
  webapp.setHeaderColor("#0a0a0b");
  webapp.setBackgroundColor("#0a0a0b");
}

/**
 * Haptic feedback berish.
 */
export function hapticFeedback(
  type: "impact" | "notification" | "selection",
  style?: string
): void {
  const webapp = getTelegramWebApp();
  if (!webapp?.HapticFeedback) return;

  switch (type) {
    case "impact":
      webapp.HapticFeedback.impactOccurred(
        (style as "light" | "medium" | "heavy") || "medium"
      );
      break;
    case "notification":
      webapp.HapticFeedback.notificationOccurred(
        (style as "error" | "success" | "warning") || "success"
      );
      break;
    case "selection":
      webapp.HapticFeedback.selectionChanged();
      break;
  }
}

/**
 * Orqaga tugmasini boshqarish.
 */
export function showBackButton(callback: () => void): () => void {
  const webapp = getTelegramWebApp();
  if (!webapp) return () => {};

  webapp.BackButton.show();
  webapp.BackButton.onClick(callback);

  // Cleanup funksiya
  return () => {
    webapp.BackButton.hide();
    webapp.BackButton.offClick(callback);
  };
}

/**
 * Mini-App ni yopish.
 */
export function closeMiniApp(): void {
  const webapp = getTelegramWebApp();
  webapp?.close();
}
