// ============================================
// BiznesOS — Biznes turlari, Rasmlar va Shablonlar
// ============================================

export interface BusinessCategory {
  id: string;
  name: string;
  tagline: string;
  emoji: string;
  imageUrl: string;
  galleryImages: string[];
  defaultWorkingHours: string;
  sampleAddress: string;
  sampleDescription: string;
  serviceTags: string[];
  postIdeas: {
    title: string;
    topic: string;
    type: "promo" | "info" | "story" | "announce" | "engagement" | "seasonal";
  }[];
}

export const BUSINESS_CATEGORIES: Record<string, BusinessCategory> = {
  barber: {
    id: "barber",
    name: "Sartaroshxona & Barbershop",
    tagline: "Erkaklar soch va soqol parvarishi",
    emoji: "💈",
    imageUrl:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80",
    ],
    defaultWorkingHours: "09:00 — 21:00 (Har kuni)",
    sampleAddress: "Toshkent sh., Chilonzor tumani, 9-mavze",
    sampleDescription:
      "Zamonaviy uslub, tajribali masterlar va individual yondashuv. Erkaklar uchun haqiqiy qulay muhit va sifatli xizmat.",
    serviceTags: [
      "Fade soch turmagi",
      "Soqol korreksiyasi",
      "Klassik qirqish",
      "Issiq sochiq muolajasi",
      "Yuz parvarishi (Black mask)",
      "VIP xona",
    ],
    postIdeas: [
      {
        title: "🔥 Yangi mijozlarga 20% aksiya",
        topic: "Birinchi marta tashrif buyurgan barcha yangi mijozlar uchun soch va soqol paketiga 20% chegirma!",
        type: "promo",
      },
      {
        title: "💡 Soqol parvarishi bo'yicha 3 qoida",
        topic: "Soqolni zich va tekis o'stirish uchun uy sharoitida amal qilish kerak bo'lgan eng muhim 3 ta qoida.",
        type: "info",
      },
      {
        title: "⭐ O'zgarish (Before / After)",
        topic: "Doimiy mijozimizning yangi fasl uchun zamonaviy imidj o'zgarishi. Baho bering!",
        type: "story",
      },
      {
        title: "⏰ Hafta oxiri yozilish",
        topic: "Dam olish kunlarida joylar cheklangan! Hoziroq vaqtingizni bron qilib qo'ying.",
        type: "announce",
      },
    ],
  },
  cafe: {
    id: "cafe",
    name: "Kofe shop & Kafe",
    tagline: "Shinam muhit va sara kofe donalari",
    emoji: "☕",
    imageUrl:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    ],
    defaultWorkingHours: "08:00 — 23:00 (Dam olishsiz)",
    sampleAddress: "Toshkent sh., Mirzo Ulug'bek tumani, Markaz-1",
    sampleDescription:
      "100% Arabica kofesi, yangi pishirilgan shirinliklar, tezkor Wi-Fi va ishlash hamda do'stlar bilan uchrashish uchun eng shinam go'sha.",
    serviceTags: [
      "Specialty Coffee",
      "Nonushta menyusi",
      "Yangi desertlar",
      "Takeaway (Olib ketish)",
      "Coworking & Wi-Fi",
      "Sutli va vegansiz kofelar",
    ],
    postIdeas: [
      {
        title: "🥐 Ertalabki kofe + desert sovg'a",
        topic: "Har kuni 08:00 dan 11:00 gacha har qanday katta latte yoki cappuccino xarid qilganingizda yangi pishgan kruassan bepul!",
        type: "promo",
      },
      {
        title: "💡 To'g'ri kofe tanlash siri",
        topic: "Arabica va Robusta o'rtasidagi farq nima? Qaysi biri ko'proq energiya va xushbo'y hid beradi?",
        type: "info",
      },
      {
        title: "🌧️ Yomg'irli kun uchun iliq choy & kofe",
        topic: "Sovuq havoda bizning dolchinli karamel latemiz sizga iliqlik va yaxshi kayfiyat bag'ishlaydi.",
        type: "seasonal",
      },
    ],
  },
  education: {
    id: "education",
    name: "O'quv markaz & Kurslar",
    tagline: "Zamonaviy kasblar va chet tillari",
    emoji: "📚",
    imageUrl:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    ],
    defaultWorkingHours: "08:30 — 20:30 (Dush - Shan)",
    sampleAddress: "Toshkent sh., Yunusobod tumani, Amir Temur ko'chasi",
    sampleDescription:
      "Amaliyotga asoslangan zamonaviy ta'lim. Tajribali ustozlar, qulay auditoriyalar va kafolatlangan natija.",
    serviceTags: [
      "IELTS & General English",
      "Frontend & Backend dasturlash",
      "Kichik yoshdagilar uchun robototexnika",
      "Mental arifmetika",
      "Bepul sinov darsi",
      "Sertifikat",
    ],
    postIdeas: [
      {
        title: "🎯 Yangi guruhga qabul: 1-dars bepul",
        topic: "Kelgusi dushanbadan boshlanuvchi IELTS intensiv guruhiga qabul ochildi! Dastlabki sinov darsi mutlaqo bepul.",
        type: "announce",
      },
      {
        title: "🏆 O'quvchimizning 8.0 natijasi",
        topic: "3 oylik intensiv tayyorgarlikdan so'ng birinchi urinishda IELTS 8.0 ball olgan talabamiz siri bilan bo'lishamiz.",
        type: "story",
      },
      {
        title: "💡 Lug'at yodlashning 4 samarali usuli",
        topic: "Chet tili so'zlarini tezda unutib qo'ymaslik uchun xotira mashqlari va interval takrorlash metodikasi.",
        type: "info",
      },
    ],
  },
  beauty: {
    id: "beauty",
    name: "Go'zallik saloni & Spa",
    tagline: "Nafislik, yoshlik va o'zingizga e'tibor",
    emoji: "💅",
    imageUrl:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=800&q=80",
    ],
    defaultWorkingHours: "09:00 — 20:00 (Har kuni)",
    sampleAddress: "Toshkent sh., Yakkasaroy tumani, Shota Rustaveli ko'chasi",
    sampleDescription:
      "Sterillangan asboblar, premium kosmetika brendlari va malakali stilistlar xizmati. O'zingizni malikalardek his qiling.",
    serviceTags: [
      "Smart Manikyur & Pedikyur",
      "To'y va oqshom makiyaji",
      "Soch laminatsiyasi & Botox",
      "Kiprik va qosh laminatsiyasi",
      "Yuz tozalash & Gidropiling",
    ],
    postIdeas: [
      {
        title: "✨ Kompleks parvarishga 25% chegirma",
        topic: "Manikyur + Pedikyur + Qosh laminatsiyasi xizmatlarini birgalikda tanlasangiz 25% tejang!",
        type: "promo",
      },
      {
        title: "🌸 Kuzgi/Bahorgi terini namlantirish",
        topic: "Ob-havo o'zgarganda quruq terini tiklash uchun kosmetolog maslahatlari.",
        type: "info",
      },
      {
        title: "💅 Trenddagi nafis dizaynlar",
        topic: "Bu mavsumning eng ommabop 5 ta tirnoq rangi va minimalist uslublari.",
        type: "engagement",
      },
    ],
  },
  gym: {
    id: "gym",
    name: "Fitness & Sport zal",
    tagline: "Kuch, salomatlik va yangi natijalar",
    emoji: "🏋️",
    imageUrl:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=800&q=80",
    ],
    defaultWorkingHours: "07:00 — 23:00 (Dam olishsiz)",
    sampleAddress: "Toshkent sh., Shayxontohur tumani, Navoiy ko'chasi",
    sampleDescription:
      "Zamonaviy trenajyorlar, professional murabbiylar, krossfit zona, sauna va fitness bar. Sog'lom hayot tarzini bugun boshlang.",
    serviceTags: [
      "Shaxsiy murabbiy",
      "Kardio & Og'ir atletika",
      "Krossfit & TRX",
      "Ayollar uchun alohida guruhlar",
      "Fin saunasi",
      "Fitobar",
    ],
    postIdeas: [
      {
        title: "🔥 Yillik abonementga 35% aksiya",
        topic: "Yil boshlanishida o'z sog'lig'ingizga sarmoya qiling: 12 oylik cheksiz abonement maxsus chegirmada!",
        type: "promo",
      },
      {
        title: "🥗 Treningdan keyin nima yeyish kerak?",
        topic: "Mushaklarni tez tiklash va ortiqcha yog'larni yo'qotish uchun oqsil va uglevodlar nisbati.",
        type: "info",
      },
      {
        title: "💪 3 oyda -14 kg: Mijoz natijasi",
        topic: "Shaxsiy trener nazoratida sog'lom parhez va muntazam mashg'ulotlar natijasi.",
        type: "story",
      },
    ],
  },
  restaurant: {
    id: "restaurant",
    name: "Restoran & Milliy taomlar",
    tagline: "Unutilmas ta'm va mehmondo'stlik",
    emoji: "🍽️",
    imageUrl:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80",
    ],
    defaultWorkingHours: "11:00 — 23:00 (Har kuni)",
    sampleAddress: "Toshkent sh., Mirobod tumani, Taras Shevchenko ko'chasi",
    sampleDescription:
      "Tajribali bosh oshpazdan sharqona va yevropa taomlari. Jonli musiqa, VIP xonalar va tezkor yetkazib berish.",
    serviceTags: [
      "Biznes lanch (12:00-15:00)",
      "Milliy palov & kaboblar",
      "Jonli musiqa oqshomi",
      "Yetkazib berish xizmati",
      "Banket va oilaviy marosimlar",
    ],
    postIdeas: [
      {
        title: "🥩 Oshpazimizdan yangi maxsus steyk",
        topic: "Marmar go'shtidan tayyorlangan xushbo'y steyk va sabzavotli garnir. Bu ta'mni tatib ko'rishingiz shart!",
        type: "announce",
      },
      {
        title: "🎉 Hafta oxiri jonli musiqa oqshomi",
        topic: "Juma va shanba oqshomida sevimli musiqalar ostida shinam kechki ovqat. Joylarni band qiling.",
        type: "promo",
      },
    ],
  },
  shop: {
    id: "shop",
    name: "Do'kon & Chakana savdo",
    tagline: "Sifatli mahsulotlar va qulay xarid",
    emoji: "🛍️",
    imageUrl:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=800&q=80",
    ],
    defaultWorkingHours: "09:00 — 21:00 (Har kuni)",
    sampleAddress: "Toshkent sh., Sergeli tumani, Yangi Sergeli ko'chasi",
    sampleDescription:
      "Keng assortiment, eng yangi kolleksiyalar va doimiy hamyonbop narxlar. O'zbekiston bo'ylab tez yetkazish.",
    serviceTags: [
      "Yangi kolleksiya",
      "Butun O'zbekistonga yetkazish",
      "Kafolatlangan sifat",
      "Qulay to'lov turlari (Payme/Click)",
      "Doimiy chegirmalar",
    ],
    postIdeas: [
      {
        title: "⚡ 1+1 aksiyasi: Ikkinchi mahsulot bepul",
        topic: "Mavsum oxiridagi katta tozalash: bitta mahsulot xarid qiling va ikkinchisini sovg'aga oling!",
        type: "promo",
      },
      {
        title: "📦 Bepul yetkazib berish kunlari",
        topic: "300,000 so'mdan ortiq har qanday buyurtma eshigingizgacha mutlaqo tekinga yetkaziladi.",
        type: "announce",
      },
    ],
  },
  clinic: {
    id: "clinic",
    name: "Klinika & Stomatologiya",
    tagline: "Sog'liq, ishonch va og'riqsiz davolash",
    emoji: "🏥",
    imageUrl:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
    ],
    defaultWorkingHours: "09:00 — 19:00 (Dush - Shan)",
    sampleAddress: "Toshkent sh., Shayxontohur tumani, Beruniy ko'chasi",
    sampleDescription:
      "Zamonaviy nemis uskunalari, og'riqsiz texnologiyalar va tajribali shifokorlar jamoasi. Har bir bemorga ehtirom bilan.",
    serviceTags: [
      "Tishlarni og'riqsiz davolash",
      "Estetik oqartirish (Zoom 4)",
      "Keramik vinirlar & implantlar",
      "Bolalar stomatologiyasi",
      "Raqamli rentgen diagnostika",
    ],
    postIdeas: [
      {
        title: "🦷 Bepul konsultatsiya va diagnostika",
        topic: "Bu hafta shifokor ko'rigi va 3D rentgen diagnostikasi barcha yangi murojaatchilar uchun bepul!",
        type: "promo",
      },
      {
        title: "💡 Tish cho'tkasini qanchada almashtirish kerak?",
        topic: "Bakteriyalar to'planmasligi va milklar zararlanmasligi uchun cho'tkani to'g'ri tanlash va yangilash qoidalari.",
        type: "info",
      },
    ],
  },
  auto: {
    id: "auto",
    name: "Avtoservis & Detailing",
    tagline: "Avtomobilingizga professional g'amxo'rlik",
    emoji: "🚗",
    imageUrl:
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80",
    ],
    defaultWorkingHours: "09:00 — 20:00 (Har kuni)",
    sampleAddress: "Toshkent sh., Olmazor tumani, Kichik halqa yo'li",
    sampleDescription:
      "Kuzovni himoyalash, detailing tozalash, keramika va zamonaviy kompyuter diagnostikasi.",
    serviceTags: [
      "Keramika qoplamasi (9H)",
      "Bron plyonka (PPF)",
      "Chuqur kimyoviy tozalash",
      "Kuzov polirovkasi",
      "Kompyuter diagnostikasi",
    ],
    postIdeas: [
      {
        title: "🛡️ Yangi mashinalar uchun himoya paketi",
        topic: "Yangi avtomobilingizni tosh va qum zarbalaridan asrang: old qismiga bron plyonka tortishga 15% chegirma!",
        type: "promo",
      },
      {
        title: "✨ Detailing tozalashdan so'ng salon hidi",
        topic: "Salondagi barcha noxush hidlarni yo'qotuvchi ozonlash va terini maxsus konditsioner bilan to'yintirish.",
        type: "story",
      },
    ],
  },
  other: {
    id: "other",
    name: "Xizmat ko'rsatish & IT",
    tagline: "Innovatsion yechimlar va biznes xizmatlari",
    emoji: "💼",
    imageUrl:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    ],
    defaultWorkingHours: "09:00 — 18:00 (Dush - Juma)",
    sampleAddress: "Toshkent sh., Yashnobod tumani, IT Park",
    sampleDescription:
      "Biznes jarayonlarini avtomatlashtirish, marketing xizmatlari va konsalting. Natijaga yo'naltirilgan hamkorlik.",
    serviceTags: [
      "Biznes konsalting",
      "Veb-sayt va botlar",
      "Target va SMM xizmati",
      "Shartnoma asosida xizmat",
      "24/7 texnik qo'llab-quvvatlash",
    ],
    postIdeas: [
      {
        title: "📈 Biznesingizni avtomatlashtiring",
        topic: "Mijozlar bilan ishlashni Telegram Mini-App orqali 3 barobar tezlashtiring. Bepul demo audit!",
        type: "promo",
      },
    ],
  },
};

export function getCategoryById(id: string): BusinessCategory {
  return BUSINESS_CATEGORIES[id] || BUSINESS_CATEGORIES.other;
}
