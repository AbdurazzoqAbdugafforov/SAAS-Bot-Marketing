// ============================================
// BiznesOS AI — Profile Routes
// ============================================
// Biznes profilini saqlash va olish endpointlari.

const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// --- GET /api/profile — Foydalanuvchi profilini olish ---
router.get("/", async (req, res) => {
  try {
    const user = req.user;

    // BigInt qiymatlarni serializatsiya qilish
    const safeUser = {
      id: user.id,
      telegramId: user.telegramId.toString(),
      name: user.name,
      username: user.username,
      createdAt: user.createdAt,
      businessProfile: user.businessProfile
        ? {
            id: user.businessProfile.id,
            businessType: user.businessProfile.businessType,
            name: user.businessProfile.name,
            address: user.businessProfile.address,
            workingHours: user.businessProfile.workingHours,
            description: user.businessProfile.description,
            createdAt: user.businessProfile.createdAt,
            updatedAt: user.businessProfile.updatedAt,
          }
        : null,
      subscription: user.subscription
        ? {
            id: user.subscription.id,
            plan: user.subscription.plan,
            status: user.subscription.status,
            expiresAt: user.subscription.expiresAt,
            createdAt: user.subscription.createdAt,
          }
        : null,
    };

    return res.json({
      success: true,
      data: safeUser,
    });
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return res.status(500).json({
      success: false,
      error: "Profilni olishda xatolik yuz berdi",
    });
  }
});

// --- POST /api/profile — Biznes profilini yaratish yoki yangilash ---
router.post("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const { businessType, name, address, workingHours, description } = req.body;

    // Validatsiya
    if (!businessType || !name) {
      return res.status(400).json({
        success: false,
        error: "businessType va name maydonlari majburiy",
      });
    }

    // Ruxsat etilgan biznes turlari
    const allowedTypes = [
      "barber",
      "cafe",
      "education",
      "beauty",
      "gym",
      "restaurant",
      "shop",
      "clinic",
      "auto",
      "other",
    ];

    if (!allowedTypes.includes(businessType)) {
      return res.status(400).json({
        success: false,
        error: `Noto'g'ri biznes turi. Ruxsat etilganlar: ${allowedTypes.join(", ")}`,
      });
    }

    // Profil mavjudligini tekshirish
    const existingProfile = await prisma.businessProfile.findUnique({
      where: { userId },
    });

    let profile;

    if (existingProfile) {
      // Mavjud profilni yangilash
      profile = await prisma.businessProfile.update({
        where: { userId },
        data: {
          businessType,
          name,
          address: address || null,
          workingHours: workingHours || null,
          description: description || null,
        },
      });
    } else {
      // Yangi profil yaratish
      profile = await prisma.businessProfile.create({
        data: {
          userId,
          businessType,
          name,
          address: address || null,
          workingHours: workingHours || null,
          description: description || null,
        },
      });
    }

    return res.json({
      success: true,
      data: profile,
      message: existingProfile
        ? "Profil muvaffaqiyatli yangilandi"
        : "Profil muvaffaqiyatli yaratildi",
    });
  } catch (error) {
    console.error("POST /api/profile error:", error);
    return res.status(500).json({
      success: false,
      error: "Profilni saqlashda xatolik yuz berdi",
    });
  }
});

// --- DELETE /api/profile — Biznes profilini o'chirish ---
router.delete("/", async (req, res) => {
  try {
    const userId = req.user.id;

    const existingProfile = await prisma.businessProfile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        error: "Profil topilmadi",
      });
    }

    await prisma.businessProfile.delete({
      where: { userId },
    });

    return res.json({
      success: true,
      message: "Profil muvaffaqiyatli o'chirildi",
    });
  } catch (error) {
    console.error("DELETE /api/profile error:", error);
    return res.status(500).json({
      success: false,
      error: "Profilni o'chirishda xatolik yuz berdi",
    });
  }
});

module.exports = router;
