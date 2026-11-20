// ============================================
// BiznesOS — SMM Post Yaratish
// ============================================

const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

let genAI = null;

function getGeminiClient() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      genAI = new GoogleGenerativeAI(apiKey);
    }
  }
  return genAI;
}

const BUSINESS_NAMES = {
  barber: "Sartaroshxona & Barbershop",
  cafe: "Kofe shop & Kafe",
  education: "O'quv markazi",
  beauty: "Go'zallik saloni",
  gym: "Fitness & Sport zal",
  restaurant: "Restoran",
  shop: "Do'kon",
  clinic: "Klinika",
  auto: "Avtoservis",
  other: "Xizmat ko'rsatish",
};

const POST_TYPES = {
  promo: "Aksiya va maxsus taklif",
  info: "Foydali ma'lumot yoki maslahat",
  story: "Mijoz fikri va sharh",
  announce: "Yangilik va e'lon",
};

async function generateWithRetry(client, systemPrompt, maxRetries = 2) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const model = client.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          temperature: 0.75,
          maxOutputTokens: 900,
        },
      });

      const response = await model.generateContent(systemPrompt);
      const text = response.response.text().trim();
      return { success: true, text };
    } catch (err) {
      console.warn(`Gemini attempt ${attempt} failed: ${err.message}`);
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 1000));
      } else {
        throw err;
      }
    }
  }
}

router.post("/", async (req, res) => {
  try {
    const {
      businessType = "other",
      businessName = "Biznes",
      topic = "",
      postType = "promo",
      platform = "both",
      address = "",
      workingHours = "",
      imageUrl = null,
    } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({
        success: false,
        error: "Mavzu kiritilishi shart",
      });
    }

    const client = getGeminiClient();

    let generatedText = "";
    let isDemo = false;

    if (!client) {
      generatedText = generateFallbackPost(req.body);
      isDemo = true;
    } else {
      const bizTypeName = BUSINESS_NAMES[businessType] || "Kichik biznes";
      const postTypeName = POST_TYPES[postType] || "Post";

      const systemPrompt = `
Sen tajribali, didli va professional o'zbek SMM mutaxassisisan.
Kichik biznes egalari uchun Instagram va Telegramga qo'yishga tayyor, samimiy va jonli post yozasan.

MUHIM USLUB QOIDALARI:
1. Ortiqcha shovqin-suronsiz, baqirmasdan ("DIQQAT!", "MEGA AKSIYA!" deb yozma). Matn samimiy, tushunarli va insoniy bo'lsin.
2. Hech qanday kirish so'zlarsiz ("Mana sizga post", "Marhamat" demasdan) darhol tayyor post matnini boshla.
3. Strukturasi:
   - Qiziqarli, chiroyli bosh sarlavha.
   - Asosiy mazmun: 2-3 ta qisqa, o'qilishi oson xatboshi yoki qulay ro'yxat.
   - Aniqlik: manzil, ish vaqti yoki bog'lanish usuli.
   - Oxirida 4-6 ta biznesga mos hashtag.
4. Biznes:
   - Nomi: ${businessName}
   - Soha: ${bizTypeName}
   ${address ? `- Manzil: ${address}` : ""}
   ${workingHours ? `- Ish vaqti: ${workingHours}` : ""}
5. Mavzu: ${topic}
6. Post yo'nalishi: ${postTypeName}
`.trim();

      try {
        const genResult = await generateWithRetry(client, systemPrompt, 2);
        generatedText = genResult.text;
      } catch (genErr) {
        console.warn("Gemini generation failed, using fallback:", genErr.message);
        generatedText = generateFallbackPost(req.body);
        isDemo = true;
      }
    }

    // Postni bazaga avtomatik saqlash (foydalanuvchi mavjud bo'lsa)
    let savedPost = null;
    if (req.user && req.user.id) {
      try {
        savedPost = await prisma.post.create({
          data: {
            userId: req.user.id,
            businessType,
            topic: topic.trim(),
            postType,
            platform,
            content: generatedText,
            imageUrl: imageUrl || null,
          },
        });
      } catch (dbErr) {
        console.warn("Could not save post to DB:", dbErr.message);
      }
    }

    return res.json({
      success: true,
      data: {
        id: savedPost ? savedPost.id : null,
        content: generatedText,
        platform,
        type: postType,
        isDemo,
        createdAt: savedPost ? savedPost.createdAt : new Date().toISOString(),
      },
      message: "Post muvaffaqiyatli tayyorlandi",
    });
  } catch (error) {
    console.error("Generate Post error:", error);
    const fallbackText = generateFallbackPost(req.body);
    return res.json({
      success: true,
      data: {
        content: fallbackText,
        platform: req.body.platform || "both",
        type: req.body.postType || "promo",
        isDemo: true,
      },
    });
  }
});

function generateFallbackPost(body) {
  const { businessName = "Biznes", topic = "Yangi taklif" } = body;
  return `${businessName} dan yangilik

${topic}

Qo'shimcha ma'lumot va buyurtma uchun biz bilan bog'laning.
Biz sizni kutib qolamiz!

#${businessName.replace(/\s+/g, "")} #biznes #toshkent`;
}

module.exports = router;
