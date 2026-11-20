// ============================================
// BiznesOS AI — Database Seed
// ============================================

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Test foydalanuvchi yaratish
  const user = await prisma.user.upsert({
    where: { telegramId: BigInt(123456789) },
    update: {},
    create: {
      telegramId: BigInt(123456789),
      name: "Test Foydalanuvchi",
      username: "test_user",
      businessProfile: {
        create: {
          businessType: "barber",
          name: "Premium Barbershop",
          address: "Toshkent, Chilonzor tumani",
          workingHours: "09:00 - 21:00",
          description: "Zamonaviy erkaklar sartaroshxonasi",
        },
      },
      subscription: {
        create: {
          plan: "free",
          status: "active",
          expiresAt: null,
        },
      },
    },
  });

  console.log("✅ Seed completed:", { userId: user.id });
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
