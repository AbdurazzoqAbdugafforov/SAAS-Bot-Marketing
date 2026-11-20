// ============================================
// BiznesOS AI — Main Server (Express)
// ============================================
// Barcha route va middlewarelarni birlashtiruvchi
// asosiy server fayli.

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { initBot, setWebhook } = require("./bot");
const { authMiddleware, devAuthMiddleware } = require("./middleware/auth");
const profileRoutes = require("./routes/profile");
const generatePostRoutes = require("./routes/generatePost");
const postsRoutes = require("./routes/posts");

const app = express();
const PORT = process.env.PORT || 3001;
const isDev = process.env.NODE_ENV !== "production";

// ============================================
// Middlewarelar
// ============================================

// JSON body parser
app.use(express.json());

// CORS sozlamalari
app.use(
  cors({
    origin: isDev
      ? ["http://localhost:3000", "http://127.0.0.1:3000"]
      : [process.env.FRONTEND_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-telegram-init-data",
      "x-telegram-id",
    ],
  })
);

// ============================================
// Sog'liqni tekshirish (Health Check)
// ============================================

app.get("/", (req, res) => {
  res.json({
    name: "BiznesOS AI API",
    version: "1.0.0",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ============================================
// API Routelar (auth bilan himoyalangan)
// ============================================

// Auth middleware — development va production uchun
const auth = isDev ? devAuthMiddleware : authMiddleware;

// Profil endpointlari
app.use("/api/profile", auth, profileRoutes);

// AI post generatsiya endpointi
app.use("/api/generate-post", auth, generatePostRoutes);

// Postlar tarixi endpointlari
app.use("/api/posts", auth, postsRoutes);

// --- Obuna ma'lumotlarini olish ---
app.get("/api/subscription", auth, async (req, res) => {
  try {
    const subscription = req.user.subscription;

    if (!subscription) {
      return res.json({
        success: true,
        data: {
          plan: "free",
          status: "active",
          expiresAt: null,
        },
      });
    }

    return res.json({
      success: true,
      data: {
        id: subscription.id,
        plan: subscription.plan,
        status: subscription.status,
        expiresAt: subscription.expiresAt,
        createdAt: subscription.createdAt,
      },
    });
  } catch (error) {
    console.error("GET /api/subscription error:", error);
    return res.status(500).json({
      success: false,
      error: "Obuna ma'lumotlarini olishda xatolik",
    });
  }
});

// --- Obuna rejasini yangilash (simulyatsiya) ---
app.post("/api/subscription/upgrade", auth, async (req, res) => {
  try {
    const { plan } = req.body;
    const { PrismaClient } = require("@prisma/client");
    const prisma = new PrismaClient();

    const allowedPlans = ["free", "pro", "premium"];
    if (!allowedPlans.includes(plan)) {
      return res.status(400).json({
        success: false,
        error: `Noto'g'ri reja. Ruxsat etilganlar: ${allowedPlans.join(", ")}`,
      });
    }

    // Obunani yangilash
    const expiresAt =
      plan === "free" ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 kun

    const subscription = await prisma.subscription.upsert({
      where: { userId: req.user.id },
      update: {
        plan,
        status: "active",
        expiresAt,
      },
      create: {
        userId: req.user.id,
        plan,
        status: "active",
        expiresAt,
      },
    });

    await prisma.$disconnect();

    return res.json({
      success: true,
      data: {
        id: subscription.id,
        plan: subscription.plan,
        status: subscription.status,
        expiresAt: subscription.expiresAt,
      },
      message: `Obuna "${plan}" rejasiga muvaffaqiyatli yangilandi`,
    });
  } catch (error) {
    console.error("POST /api/subscription/upgrade error:", error);
    return res.status(500).json({
      success: false,
      error: "Obunani yangilashda xatolik",
    });
  }
});

// ============================================
// 404 Handler
// ============================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route topilmadi: ${req.method} ${req.path}`,
  });
});

// ============================================
// Global Error Handler
// ============================================

app.use((err, req, res, next) => {
  console.error("Kutilmagan xato:", err);
  res.status(500).json({
    success: false,
    error: "Serverda kutilmagan xatolik yuz berdi",
  });
});

// ============================================
// Serverni Ishga Tushirish
// ============================================

app.listen(PORT, async () => {
  console.log(`
  ╔════════════════════════════════════════════╗
  ║                                            ║
  ║   🚀 BiznesOS AI Backend                   ║
  ║                                            ║
  ║   📡 Server:  http://localhost:${PORT}        ║
  ║   🌍 Muhit:   ${isDev ? "Development" : "Production "}           ║
  ║   📅 Vaqt:    ${new Date().toLocaleString("uz-UZ")}      ║
  ║                                            ║
  ╚════════════════════════════════════════════╝
  `);

  // Telegram botni ishga tushirish
  const bot = initBot();

  // Production da webhook sozlash
  if (!isDev && bot) {
    await setWebhook(app);
  }
});

module.exports = app;
