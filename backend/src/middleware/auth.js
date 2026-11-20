// ============================================
// BiznesOS AI — Telegram WebApp Auth Middleware
// ============================================
// Telegram WebApp initData ni tekshiradi va
// foydalanuvchini avtomatik yaratadi yoki topadi.

const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/**
 * Telegram WebApp initData ni HMAC-SHA256 bilan tekshirish.
 * Rasmiy hujjat: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
function validateTelegramData(initData, botToken) {
  try {
    const params = new URLSearchParams(initData);
    const hash = params.get("hash");
    if (!hash) return null;

    params.delete("hash");

    // Parametrlarni alifbo tartibida saralash
    const dataCheckArr = [];
    for (const [key, value] of params.entries()) {
      dataCheckArr.push(`${key}=${value}`);
    }
    dataCheckArr.sort();
    const dataCheckString = dataCheckArr.join("\n");

    // HMAC-SHA256 bilan tekshirish
    const secretKey = crypto
      .createHmac("sha256", "WebAppData")
      .update(botToken)
      .digest();

    const calculatedHash = crypto
      .createHmac("sha256", secretKey)
      .update(dataCheckString)
      .digest("hex");

    if (calculatedHash !== hash) {
      return null;
    }

    // User ma'lumotlarini olish
    const userParam = params.get("user");
    if (!userParam) return null;

    return JSON.parse(userParam);
  } catch (error) {
    console.error("Telegram data validation error:", error);
    return null;
  }
}

/**
 * Auth middleware — har bir so'rovni tekshiradi.
 * Header: x-telegram-init-data
 */
async function authMiddleware(req, res, next) {
  try {
    const initData = req.headers["x-telegram-init-data"];

    if (!initData) {
      return res.status(401).json({
        success: false,
        error: "Autentifikatsiya ma'lumotlari topilmadi",
      });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      return res.status(500).json({
        success: false,
        error: "Bot token sozlanmagan",
      });
    }

    // Telegram ma'lumotlarini tekshirish
    const telegramUser = validateTelegramData(initData, botToken);

    if (!telegramUser) {
      return res.status(401).json({
        success: false,
        error: "Telegram autentifikatsiyasi muvaffaqiyatsiz",
      });
    }

    // Foydalanuvchini DB dan topish yoki yaratish
    let user = await prisma.user.findUnique({
      where: { telegramId: BigInt(telegramUser.id) },
      include: {
        businessProfile: true,
        subscription: true,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          telegramId: BigInt(telegramUser.id),
          name:
            [telegramUser.first_name, telegramUser.last_name]
              .filter(Boolean)
              .join(" ") || null,
          username: telegramUser.username || null,
          subscription: {
            create: {
              plan: "free",
              status: "active",
            },
          },
        },
        include: {
          businessProfile: true,
          subscription: true,
        },
      });
    }

    // BigInt ni string ga aylantirish (JSON serialization uchun)
    req.user = {
      ...user,
      telegramId: user.telegramId.toString(),
    };
    req.telegramUser = telegramUser;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      error: "Server xatosi",
    });
  }
}

/**
 * Development uchun soddalashtirilgan auth (initData bo'lmasa ham ishlaydi)
 */
async function devAuthMiddleware(req, res, next) {
  try {
    const initData = req.headers["x-telegram-init-data"];

    // Agar initData bo'lsa — haqiqiy tekshirish
    if (initData && initData !== "dev-mode") {
      return authMiddleware(req, res, next);
    }

    // Development mode — test foydalanuvchi
    const telegramId = req.headers["x-telegram-id"] || "123456789";

    let user = await prisma.user.findUnique({
      where: { telegramId: BigInt(telegramId) },
      include: {
        businessProfile: true,
        subscription: true,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          telegramId: BigInt(telegramId),
          name: "Dev User",
          username: "dev_user",
          subscription: {
            create: {
              plan: "free",
              status: "active",
            },
          },
        },
        include: {
          businessProfile: true,
          subscription: true,
        },
      });
    }

    req.user = {
      ...user,
      telegramId: user.telegramId.toString(),
    };

    next();
  } catch (error) {
    console.error("Dev auth middleware error:", error);
    return res.status(500).json({
      success: false,
      error: "Server xatosi",
    });
  }
}

module.exports = {
  authMiddleware,
  devAuthMiddleware,
  validateTelegramData,
};
