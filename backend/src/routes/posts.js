// ============================================
// BiznesOS — Postlar Tarixi Route
// ============================================

const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// --- Foydalanuvchining barcha postlarini olish ---
router.get("/", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return res.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return res.status(500).json({
      success: false,
      error: "Postlarni yuklashda xatolik yuz berdi",
    });
  }
});

// --- Yangi postni saqlash ---
router.post("/", async (req, res) => {
  try {
    const {
      businessType = "other",
      topic = "",
      postType = "promo",
      platform = "both",
      content,
      imageUrl = null,
    } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        error: "Post matni bo'sh bo'lishi mumkin emas",
      });
    }

    const post = await prisma.post.create({
      data: {
        userId: req.user.id,
        businessType,
        topic: topic || "Post",
        postType,
        platform,
        content: content.trim(),
        imageUrl,
      },
    });

    return res.json({
      success: true,
      data: post,
      message: "Post muvaffaqiyatli saqlandi",
    });
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return res.status(500).json({
      success: false,
      error: "Postni saqlashda xatolik yuz berdi",
    });
  }
});

// --- Postni o'chirish ---
router.delete("/:id", async (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    if (isNaN(postId)) {
      return res.status(400).json({
        success: false,
        error: "Noto'g'ri post ID",
      });
    }

    // Post foydalanuvchiga tegishli ekanini tekshirish
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        userId: req.user.id,
      },
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        error: "Post topilmadi yoki sizga tegishli emas",
      });
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    return res.json({
      success: true,
      message: "Post o'chirildi",
    });
  } catch (error) {
    console.error("DELETE /api/posts/:id error:", error);
    return res.status(500).json({
      success: false,
      error: "Postni o'chirishda xatolik",
    });
  }
});

module.exports = router;
