import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Settings
  const settings = [
    { key: "site_name", value: "GodGiftShop" },
    { key: "contact_phone", value: "237655957734" },
    { key: "contact_email", value: "nonopascalcaleb@gmail.com" },
    { key: "currency", value: "XAF" },
    { key: "new_badge_days", value: "7" },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }

  // Categories
  const categories = [
    { name: "Bags", slug: "bags", description: "All types of bags" },
    { name: "Shoes", slug: "shoes", description: "All types of shoes" },
  ];

  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  console.log("Seed complete: settings + categories created.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
