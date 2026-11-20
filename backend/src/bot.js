// ============================================
// BiznesOS — Telegram Bot & Webhook Handler
// ============================================

const TelegramBot = require("node-telegram-bot-api");

let bot = null;

function initBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token || token === "your_telegram_bot_token_here") {
    console.warn("⚠️  TELEGRAM_BOT_TOKEN sozlanmagan. Bot polling ishga tushmadi.");
    return null;
  }

  const isProduction = process.env.NODE_ENV === "production";

  // Development rejimida polling, production rejimida webhook
  bot = new TelegramBot(token, {
    polling: !isProduction,
  });

  const miniAppUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  // --- /start ---
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const name = msg.from.first_name || "Hurmatli tadbirkor";

    const text = `
✨ <b>Assalomu alaykum, ${name}!</b>

<b>BiznesOS AI</b> — bu O'zbekistondagi kichik bizneslar uchun mo'ljallangan sun'iy intellekt marketing va boshqaruv platformasi.

🎯 <b>Imkoniyatlar:</b>
• SMM postlar (Instagram & Telegram) generatsiyasi
• Har bir soha uchun moslashtirilgan fotogalereya va didli dizayn
• Bir marta bosishda nusxalash va ulashish
• Qaymoq rangli zamonaviy mobil interfeys

Boshlash uchun quyidagi tugmani bosing 👇
`.trim();

    try {
      await bot.sendMessage(chatId, text, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🚀 BiznesOS ilovasini ochish",
                web_app: { url: miniAppUrl },
              },
            ],
            [
              {
                text: "✍️ Post yaratish studio",
                web_app: { url: `${miniAppUrl}/content` },
              },
            ],
            [
              {
                text: "💎 Obuna tariflari",
                web_app: { url: `${miniAppUrl}/subscription` },
              },
            ],
          ],
        },
      });
    } catch (e) {
      console.error("Bot /start send error:", e.message);
    }
  });

  // --- /post ---
  bot.onText(/\/post/, async (msg) => {
    const chatId = msg.chat.id;
    try {
      await bot.sendMessage(
        chatId,
        "✍️ <b>Yangi post yaratish</b>\n\nAI yordamida bir necha soniyada Instagram va Telegram uchun post yozing:",
        {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "🎨 Content Studio ni ochish",
                  web_app: { url: `${miniAppUrl}/content` },
                },
              ],
            ],
          },
        }
      );
    } catch (e) {
      console.error("Bot /post send error:", e.message);
    }
  });

  // --- /tarif ---
  bot.onText(/\/tarif/, async (msg) => {
    const chatId = msg.chat.id;
    const text = `
💎 <b>BiznesOS AI Tariflari:</b>

🌱 <b>Boshlang'ich (Bepul)</b>
• Oyiga 10 ta AI post
• 1 ta biznes profili
• Standart fotogalereya

⚡ <b>Pro Biznes (149 000 so'm/oy)</b>
• Cheksiz AI postlar
• Barcha 10 ta soha shablonlari
• HD fotolar to'plami
• Tezkor generatsiya

👑 <b>Ultra SaaS (349 000 so'm/oy)</b>
• Bir nechta filiallar
• Shaxsiy brend ohangi
• VIP qo'llab-quvvatlash
`.trim();

    try {
      await bot.sendMessage(chatId, text, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Obunani faollashtirish",
                web_app: { url: `${miniAppUrl}/subscription` },
              },
            ],
          ],
        },
      });
    } catch (e) {
      console.error("Bot /tarif send error:", e.message);
    }
  });

  // --- /help ---
  bot.onText(/\/help/, async (msg) => {
    const chatId = msg.chat.id;
    const text = `
ℹ️ <b>BiznesOS AI yordamchi qo'llanma:</b>

1. <b>Mini-App'ga kirish:</b> "BiznesOS ilovasini ochish" tugmasini bosing.
2. <b>Biznesni sozlash:</b> Sohangiz (sartaroshxona, kofe, o'quv markaz va b.) va nomingizni kiriting.
3. <b>Post yaratish:</b> Mavzuni yozing va yo'nalishni (Aksiya, Maslahat, Sharh, Yangilik) tanlang.
4. <b>Ulashish:</b> Tayyor bo'lgan postni bir tugma bilan Instagram yoki Telegram kanalingizga yuboring!

Savollar yoki texnik yordam uchun: @BiznesOS_Support
`.trim();

    try {
      await bot.sendMessage(chatId, text, {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "📱 Ilovani ochish",
                web_app: { url: miniAppUrl },
              },
            ],
          ],
        },
      });
    } catch (e) {
      console.error("Bot /help send error:", e.message);
    }
  });

  return bot;
}

/**
 * Production da Telegram Webhook o'rnatish
 */
async function setWebhook(app) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const webhookUrl = process.env.WEBHOOK_URL;

  if (!bot || !token || !webhookUrl) {
    console.log("ℹ️ Webhook sozlanmadi (WEBHOOK_URL yoki BOT_TOKEN mavjud emas). Polling yoki Mini-App rejimida davom etmoqda.");
    return;
  }

  try {
    const fullWebhookUrl = `${webhookUrl.replace(/\/$/, "")}/api/telegram/webhook`;
    await bot.setWebHook(fullWebhookUrl);
    console.log(`✅ Telegram webhook sozlandi: ${fullWebhookUrl}`);

    // Webhook POST endpointi
    app.post("/api/telegram/webhook", (req, res) => {
      bot.processUpdate(req.body);
      res.sendStatus(200);
    });
  } catch (error) {
    console.error("Webhook o'rnatishda xatolik:", error.message);
  }
}

module.exports = { initBot, setWebhook };
