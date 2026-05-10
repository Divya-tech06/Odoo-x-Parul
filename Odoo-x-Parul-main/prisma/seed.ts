import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Upsert demo user (idempotent)
  const hashedPassword = await bcrypt.hash("Demo1234", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@traveloop.com" },
    update: {},
    create: {
      name: "Alex Wanderer",
      email: "demo@traveloop.com",
      password: hashedPassword,
      image: null,
    },
  });

  console.log(`✅ Demo user: ${user.email}`);

  // Clean existing demo trips for this user
  await prisma.trip.deleteMany({ where: { userId: user.id } });

  // ── Trip 1: European Summer 2025 ──
  const euroTrip = await prisma.trip.create({
    data: {
      userId: user.id,
      title: "European Summer 2025",
      description: "A magical journey through Europe's most iconic cities — from the romance of Paris to the history of Rome and the vibrance of Barcelona.",
      coverImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
      startDate: new Date("2025-06-15"),
      endDate: new Date("2025-06-26"),
      visibility: "PUBLIC",
      shareToken: "euro2025",
      budgetTarget: 3000,
      budgetCurrency: "EUR",
    },
  });

  // Paris stop
  const paris = await prisma.tripStop.create({
    data: {
      tripId: euroTrip.id,
      city: "Paris",
      country: "France",
      countryCode: "FR",
      latitude: 48.8566,
      longitude: 2.3522,
      arrivalDate: new Date("2025-06-15"),
      departureDate: new Date("2025-06-19"),
      orderIndex: 0,
      coverImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    },
  });

  await prisma.activity.createMany({
    data: [
      {
        stopId: paris.id,
        title: "Eiffel Tower Visit",
        category: "sightseeing",
        cost: 25,
        currency: "EUR",
        duration: 180,
        date: new Date("2025-06-15"),
        notes: "Book skip-the-line tickets in advance",
        sortOrder: 0,
      },
      {
        stopId: paris.id,
        title: "Seine River Cruise",
        category: "sightseeing",
        cost: 15,
        currency: "EUR",
        duration: 120,
        date: new Date("2025-06-16"),
        notes: "Evening cruise for sunset views",
        sortOrder: 1,
      },
      {
        stopId: paris.id,
        title: "Louvre Museum",
        category: "culture",
        cost: 17,
        currency: "EUR",
        duration: 240,
        date: new Date("2025-06-17"),
        notes: "Must-see: Mona Lisa, Winged Victory",
        sortOrder: 2,
      },
      {
        stopId: paris.id,
        title: "Montmartre Food Tour",
        category: "food",
        cost: 45,
        currency: "EUR",
        duration: 180,
        date: new Date("2025-06-18"),
        notes: "Includes wine and cheese tasting",
        sortOrder: 3,
      },
    ],
  });

  // Rome stop
  const rome = await prisma.tripStop.create({
    data: {
      tripId: euroTrip.id,
      city: "Rome",
      country: "Italy",
      countryCode: "IT",
      latitude: 41.9028,
      longitude: 12.4964,
      arrivalDate: new Date("2025-06-20"),
      departureDate: new Date("2025-06-23"),
      orderIndex: 1,
      coverImage: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80",
    },
  });

  await prisma.activity.createMany({
    data: [
      {
        stopId: rome.id,
        title: "Colosseum Tour",
        category: "sightseeing",
        cost: 18,
        currency: "EUR",
        duration: 120,
        date: new Date("2025-06-20"),
        notes: "Guided tour with underground access",
        sortOrder: 0,
      },
      {
        stopId: rome.id,
        title: "Vatican Museums",
        category: "culture",
        cost: 20,
        currency: "EUR",
        duration: 180,
        date: new Date("2025-06-21"),
        notes: "Sistine Chapel included",
        sortOrder: 1,
      },
      {
        stopId: rome.id,
        title: "Trastevere Food Tour",
        category: "food",
        cost: 35,
        currency: "EUR",
        duration: 180,
        date: new Date("2025-06-22"),
        notes: "Authentic Roman cuisine walk",
        sortOrder: 2,
      },
    ],
  });

  // Barcelona stop
  const barcelona = await prisma.tripStop.create({
    data: {
      tripId: euroTrip.id,
      city: "Barcelona",
      country: "Spain",
      countryCode: "ES",
      latitude: 41.3874,
      longitude: 2.1686,
      arrivalDate: new Date("2025-06-24"),
      departureDate: new Date("2025-06-26"),
      orderIndex: 2,
      coverImage: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80",
    },
  });

  await prisma.activity.createMany({
    data: [
      {
        stopId: barcelona.id,
        title: "Sagrada Familia",
        category: "sightseeing",
        cost: 26,
        currency: "EUR",
        duration: 120,
        date: new Date("2025-06-24"),
        notes: "Gaudí's masterpiece",
        sortOrder: 0,
      },
      {
        stopId: barcelona.id,
        title: "Gothic Quarter Walk",
        category: "sightseeing",
        cost: 0,
        currency: "EUR",
        duration: 120,
        date: new Date("2025-06-25"),
        notes: "Free self-guided exploration",
        sortOrder: 1,
      },
    ],
  });

  // Euro trip expenses
  await prisma.expense.createMany({
    data: [
      {
        tripId: euroTrip.id,
        category: "transport",
        amount: 120,
        currency: "EUR",
        description: "Flight Paris → Rome",
        date: new Date("2025-06-19"),
      },
      {
        tripId: euroTrip.id,
        category: "transport",
        amount: 89,
        currency: "EUR",
        description: "Train Rome → Barcelona",
        date: new Date("2025-06-23"),
      },
      {
        tripId: euroTrip.id,
        category: "hotels",
        amount: 450,
        currency: "EUR",
        description: "Paris hotel (4 nights)",
        date: new Date("2025-06-15"),
      },
      {
        tripId: euroTrip.id,
        category: "hotels",
        amount: 320,
        currency: "EUR",
        description: "Rome hotel (3 nights)",
        date: new Date("2025-06-20"),
      },
    ],
  });

  // Euro trip notes
  await prisma.note.create({
    data: {
      tripId: euroTrip.id,
      content: "Remember to pack light — we'll be moving between cities! Also check travel insurance before departure.",
    },
  });

  console.log(`✅ Trip 1: "${euroTrip.title}" (${euroTrip.shareToken})`);

  // ── Trip 2: Southeast Asia Backpacking ──
  const asiaTrip = await prisma.trip.create({
    data: {
      userId: user.id,
      title: "Southeast Asia Backpacking",
      description: "Budget-friendly adventure through Thailand, Indonesia, and Singapore.",
      coverImage: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80",
      startDate: new Date("2025-09-01"),
      endDate: new Date("2025-09-10"),
      visibility: "PRIVATE",
      shareToken: "asia2025",
      budgetTarget: 2000,
      budgetCurrency: "USD",
    },
  });

  const bangkok = await prisma.tripStop.create({
    data: {
      tripId: asiaTrip.id,
      city: "Bangkok",
      country: "Thailand",
      countryCode: "TH",
      latitude: 13.7563,
      longitude: 100.5018,
      arrivalDate: new Date("2025-09-01"),
      departureDate: new Date("2025-09-03"),
      orderIndex: 0,
      coverImage: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80",
    },
  });

  await prisma.activity.createMany({
    data: [
      {
        stopId: bangkok.id,
        title: "Grand Palace Visit",
        category: "sightseeing",
        cost: 15,
        currency: "USD",
        duration: 180,
        date: new Date("2025-09-01"),
        sortOrder: 0,
      },
      {
        stopId: bangkok.id,
        title: "Street Food Tour",
        category: "food",
        cost: 20,
        currency: "USD",
        duration: 180,
        date: new Date("2025-09-02"),
        sortOrder: 1,
      },
    ],
  });

  const bali = await prisma.tripStop.create({
    data: {
      tripId: asiaTrip.id,
      city: "Bali",
      country: "Indonesia",
      countryCode: "ID",
      latitude: -8.3405,
      longitude: 115.092,
      arrivalDate: new Date("2025-09-04"),
      departureDate: new Date("2025-09-08"),
      orderIndex: 1,
      coverImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    },
  });

  await prisma.activity.createMany({
    data: [
      {
        stopId: bali.id,
        title: "Ubud Rice Terraces",
        category: "sightseeing",
        cost: 10,
        currency: "USD",
        duration: 240,
        date: new Date("2025-09-05"),
        sortOrder: 0,
      },
      {
        stopId: bali.id,
        title: "Surfing Lesson",
        category: "adventure",
        cost: 30,
        currency: "USD",
        duration: 120,
        date: new Date("2025-09-06"),
        sortOrder: 1,
      },
      {
        stopId: bali.id,
        title: "Temple Visit",
        category: "culture",
        cost: 5,
        currency: "USD",
        duration: 120,
        date: new Date("2025-09-07"),
        sortOrder: 2,
      },
    ],
  });

  const singapore = await prisma.tripStop.create({
    data: {
      tripId: asiaTrip.id,
      city: "Singapore",
      country: "Singapore",
      countryCode: "SG",
      latitude: 1.3521,
      longitude: 103.8198,
      arrivalDate: new Date("2025-09-09"),
      departureDate: new Date("2025-09-10"),
      orderIndex: 2,
      coverImage: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80",
    },
  });

  await prisma.activity.createMany({
    data: [
      {
        stopId: singapore.id,
        title: "Gardens by the Bay",
        category: "sightseeing",
        cost: 20,
        currency: "SGD",
        duration: 180,
        date: new Date("2025-09-09"),
        sortOrder: 0,
      },
      {
        stopId: singapore.id,
        title: "Hawker Center Food Tour",
        category: "food",
        cost: 15,
        currency: "SGD",
        duration: 120,
        date: new Date("2025-09-10"),
        sortOrder: 1,
      },
    ],
  });

  await prisma.expense.createMany({
    data: [
      {
        tripId: asiaTrip.id,
        category: "transport",
        amount: 150,
        currency: "USD",
        description: "Flight Bangkok → Bali",
      },
      {
        tripId: asiaTrip.id,
        category: "transport",
        amount: 80,
        currency: "USD",
        description: "Flight Bali → Singapore",
      },
    ],
  });

  console.log(`✅ Trip 2: "${asiaTrip.title}"`);
  console.log("\n🎉 Seeding complete!");
  console.log("Login with: demo@traveloop.com / Demo1234");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
