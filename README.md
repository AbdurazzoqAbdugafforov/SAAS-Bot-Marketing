# 🚀 BiznesOS AI — Telegram Mini-App

> Kichik bizneslar (sartaroshxona, kofe shop, o'quv markaz va boshqalar) uchun mo'ljallangan AI yordamchi platforma.

![BiznesOS AI](https://img.shields.io/badge/BiznesOS_AI-v1.0-8b5cf6?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Express](https://img.shields.io/badge/Express-4-green?style=flat-square&logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?style=flat-square&logo=postgresql)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-orange?style=flat-square&logo=openai)

---

## 📋 Loyiha haqida

**BiznesOS AI** — Telegram Mini-App sifatida ishlaydigan Micro-SaaS platforma. Kichik biznes egalariga quyidagi imkoniyatlarni beradi:

- 🏢 **Biznes profili** yaratish va boshqarish
- 🤖 **AI yordamida** Instagram/Telegram uchun marketing postlari yaratish
- 💎 **Obuna rejalari** (Bepul, Pro, Premium)
- 📊 **Dashboard** orqali biznesni kuzatish

---

## 🛠 Texnologik Stek

| Komponent | Texnologiya |
|-----------|------------|
| **Frontend** | Next.js 14 (App Router), Tailwind CSS, Telegram WebApp SDK |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL, Prisma ORM |
| **AI** | OpenAI API (GPT-4o-mini) |
| **Bot** | node-telegram-bot-api |

---

## 📁 Loyiha Tuzilishi

```
BiznesOS-AI/
├── .env.example                    # Muhit o'zgaruvchilari namunasi
├── README.md                       # Hujjatlar
│
├── backend/                        # Backend API & Bot
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma           # Database schema
│   │   └── seed.js                 # Test ma'lumotlar
│   └── src/
│       ├── index.js                # Express server
│       ├── bot.js                  # Telegram bot
│       ├── middleware/
│       │   └── auth.js             # Telegram auth middleware
│       └── routes/
│           ├── profile.js          # Profil API
│           └── generatePost.js     # AI post generatsiya API
│
└── frontend/                       # Telegram Mini-App
    ├── package.json
    ├── next.config.mjs
    ├── tailwind.config.ts
    ├── postcss.config.mjs
    ├── tsconfig.json
    ├── next-env.d.ts
    ├── lib/
    │   ├── telegram.ts             # Telegram WebApp SDK utility
    │   └── api.ts                  # API client
    └── app/
        ├── globals.css             # Global uslublar
        ├── layout.tsx              # Root layout
        ├── page.tsx                # Dashboard (bosh sahifa)
        ├── onboarding/
        │   └── page.tsx            # Biznes profili wizard
        ├── content/
        │   └── page.tsx            # AI kontent yaratish
        └── subscription/
            └── page.tsx            # Obuna rejalari
```

---

## 🚀 O'rnatish va Ishga Tushirish

### Talablar

- **Node.js** v18 yoki undan yuqori
- **PostgreSQL** v14 yoki undan yuqori
- **npm** yoki **yarn**
- Telegram Bot tokeni (@BotFather orqali olinadi)
- OpenAI API kaliti (ixtiyoriy — demo rejimda ishlaydi)

---

### 1-qadam: Loyihani klonlash

```bash
git clone https://github.com/AbdurazzoqAbdugafforov/SAAS-Bot-Marketing.git
cd SAAS-Bot-Marketing
```

### 2-qadam: Muhit o'zgaruvchilarini sozlash

```bash
# Root .env faylini yarating
cp .env.example .env
```

`.env` faylini oching va quyidagi qiymatlarni to'ldiring:

```env
# Telegram Bot (@BotFather dan oling)
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11

# OpenAI (ixtiyoriy — bo'lmasa demo rejimda ishlaydi)
OPENAI_API_KEY=sk-...

# PostgreSQL
DATABASE_URL=postgresql://postgres:password@localhost:5432/biznesos_ai

# Frontend URL (lokal = http://localhost:3000)
FRONTEND_URL=http://localhost:3000

# Server port
PORT=3001
```

### 3-qadam: PostgreSQL bazasini yaratish

```bash
# PostgreSQL da yangi baza yarating
createdb biznesos_ai

# Yoki psql orqali:
psql -U postgres -c "CREATE DATABASE biznesos_ai;"
```

### 4-qadam: Backend o'rnatish

```bash
cd backend

# Paketlarni o'rnatish
npm install

# .env faylini root dan nusxalash (yoki yangi yaratish)
cp ../.env .env

# Prisma client generatsiya qilish
npm run db:generate

# Database jadvallarini yaratish
npm run db:push

# (Ixtiyoriy) Test ma'lumotlarni qo'shish
npm run db:seed

# Backendni ishga tushirish
npm run dev
```

Backend `http://localhost:3001` da ishga tushadi.

### 5-qadam: Frontend o'rnatish

Yangi terminal oching:

```bash
cd frontend

# Paketlarni o'rnatish
npm install

# Frontendni ishga tushirish
npm run dev
```

Frontend `http://localhost:3000` da ishga tushadi.

---

## 🤖 Telegram Bot Sozlash

### BotFather orqali bot yaratish:

1. Telegram da [@BotFather](https://t.me/BotFather) ni oching
2. `/newbot` buyrug'ini yuboring
3. Bot nomini va username ni kiriting
4. Olingan tokenni `.env` fayliga qo'ying

### Mini-App sozlash:

1. BotFather da `/mybots` → bot tanlash → **Bot Settings** → **Menu Button**
2. **Configure Menu Button** ni bosing
3. URL sifatida frontend manzilini kiriting (masalan: `https://your-domain.com`)
4. Tugma matnini kiriting (masalan: "🏢 Biznesni Boshqarish")

> ⚠️ **Muhim:** Telegram Mini-App faqat HTTPS orqali ishlaydi. Lokal sinovlar uchun [ngrok](https://ngrok.com/) yoki [localtunnel](https://localtunnel.github.io/localtunnel/) dan foydalaning.

### Lokal sinov uchun HTTPS tunnel:

```bash
# ngrok orqali
npx ngrok http 3000

# yoki localtunnel orqali
npx localtunnel --port 3000
```

Olingan HTTPS URL ni `.env` dagi `FRONTEND_URL` ga qo'ying va botni qayta ishga tushiring.

---

## 📡 API Endpointlari

| Metod | Endpoint | Tavsif |
|-------|----------|--------|
| `GET` | `/` | Server holati |
| `GET` | `/health` | Health check |
| `GET` | `/api/profile` | Foydalanuvchi profilini olish |
| `POST` | `/api/profile` | Biznes profilini saqlash/yangilash |
| `DELETE` | `/api/profile` | Biznes profilini o'chirish |
| `POST` | `/api/generate-post` | AI bilan post yaratish |
| `GET` | `/api/generate-post/types` | Post turlarini olish |
| `GET` | `/api/subscription` | Obuna ma'lumotlarini olish |
| `POST` | `/api/subscription/upgrade` | Obuna rejasini yangilash |

### Autentifikatsiya

Barcha `/api/*` endpointlari `x-telegram-init-data` headerini talab qiladi. Development rejimda `x-telegram-init-data: dev-mode` va `x-telegram-id: 123456789` headerlari bilan ishlaydi.

### Post yaratish so'rovi misoli:

```json
POST /api/generate-post
Content-Type: application/json
x-telegram-init-data: dev-mode

{
  "businessType": "barber",
  "businessName": "Premium Barbershop",
  "topic": "Yangi yoz chegirmamiz — 20% skidka!",
  "postType": "promo",
  "platform": "instagram",
  "language": "uz",
  "tone": "energetic"
}
```

---

## 🎨 Sahifalar

### 1. Dashboard (Bosh sahifa)
- Foydalanuvchi salomlashish kartochkasi
- Biznes profili ko'rinishi
- Obuna holati
- Tezkor amallar: AI Post, Profil, Obuna, Yordam

### 2. Onboarding (Biznes profili)
- 3 bosqichli wizard
- 10 ta biznes turi (sartaroshxona, kafe, o'quv markaz va h.k.)
- Biznes nomi, manzil, ish vaqti va tavsif

### 3. AI Kontent Yaratish
- 6 ta post turi (aksiya, maslahat, hikoya, e'lon, savol-javob, bayram)
- 3 ta platforma (Instagram, Telegram, ikkalasi)
- 6 ta ohang sozlamasi
- Nusxalash va qayta yaratish

### 4. Obuna Rejalari
- 3 ta reja: Bepul, Pro (49,000 so'm/oy), Premium (99,000 so'm/oy)
- Xususiyatlar taqqoslash
- FAQ bo'limi

---

## 🌐 Ishlab Chiqarishga Chiqarish (Deployment)

### Backend (Railway / Render / VPS):

```bash
cd backend
npm install
npm run db:generate
npm run db:push
NODE_ENV=production npm start
```

### Frontend (Vercel):

```bash
cd frontend
npm install
npm run build
# Vercel ga deploy qilish
npx vercel --prod
```

### Muhit o'zgaruvchilari (Production):

```env
NODE_ENV=production
TELEGRAM_BOT_TOKEN=your_production_token
OPENAI_API_KEY=your_production_key
DATABASE_URL=postgresql://user:pass@host:5432/biznesos_ai
FRONTEND_URL=https://your-production-domain.com
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

---

## 📝 Litsenziya

MIT License — erkin foydalanishingiz mumkin.

---

## 📞 Aloqa

- 💬 Telegram: [@biznesos_support](https://t.me/biznesos_support)
- 📧 Email: support@biznesos.uz

---

**BiznesOS AI** bilan biznesingizni yangi bosqichga olib chiqing! 🚀
