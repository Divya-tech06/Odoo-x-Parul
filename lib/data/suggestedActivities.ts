export interface SuggestedActivity {
  id: string;
  title: string;
  category: "sightseeing" | "food" | "transport" | "hotel" | "adventure" | "culture" | "shopping";
  estimatedCost: number;
  currency: string;
  duration: number; // minutes
  description: string;
  emoji: string;
}

export const SUGGESTED_ACTIVITIES: SuggestedActivity[] = [
  // ── Sightseeing (7) ──
  { id: "s1", title: "Visit the Main Cathedral", category: "sightseeing", estimatedCost: 1200, currency: "INR", duration: 120, description: "Explore the city's iconic cathedral and its stunning architecture", emoji: "⛪" },
  { id: "s2", title: "Historical Walking Tour", category: "sightseeing", estimatedCost: 2000, currency: "INR", duration: 180, description: "Guided walking tour through the historic city center", emoji: "🚶" },
  { id: "s3", title: "Sunset Viewpoint Visit", category: "sightseeing", estimatedCost: 0, currency: "INR", duration: 60, description: "Watch the sunset from the city's best panoramic viewpoint", emoji: "🌅" },
  { id: "s4", title: "River or Harbor Cruise", category: "sightseeing", estimatedCost: 1600, currency: "INR", duration: 90, description: "See the city from the water on a scenic boat cruise", emoji: "🚤" },
  { id: "s5", title: "Landmark Photo Tour", category: "sightseeing", estimatedCost: 0, currency: "INR", duration: 120, description: "Visit and photograph the most iconic landmarks", emoji: "📸" },
  { id: "s6", title: "Observation Deck Visit", category: "sightseeing", estimatedCost: 1440, currency: "INR", duration: 60, description: "Get a bird's eye view from the tallest building", emoji: "🏙" },
  { id: "s7", title: "Old Town Exploration", category: "sightseeing", estimatedCost: 0, currency: "INR", duration: 150, description: "Wander through cobblestone streets in the historic quarter", emoji: "🏘" },

  // ── Food & Dining (7) ──
  { id: "f1", title: "Street Food Tour", category: "food", estimatedCost: 2400, currency: "INR", duration: 180, description: "Sample the best local street food with a guide", emoji: "🥘" },
  { id: "f2", title: "Cooking Class", category: "food", estimatedCost: 3600, currency: "INR", duration: 180, description: "Learn to cook traditional dishes from a local chef", emoji: "👨‍🍳" },
  { id: "f3", title: "Fine Dining Experience", category: "food", estimatedCost: 6400, currency: "INR", duration: 120, description: "Dinner at a highly-rated restaurant", emoji: "🍽" },
  { id: "f4", title: "Local Market Visit", category: "food", estimatedCost: 1200, currency: "INR", duration: 90, description: "Browse fresh produce and local delicacies at the market", emoji: "🧺" },
  { id: "f5", title: "Wine or Beer Tasting", category: "food", estimatedCost: 2800, currency: "INR", duration: 120, description: "Sample local wines or craft beers at a tasting room", emoji: "🍷" },
  { id: "f6", title: "Café Hopping", category: "food", estimatedCost: 1600, currency: "INR", duration: 120, description: "Visit the most instagrammable and cozy cafés", emoji: "☕" },
  { id: "f7", title: "Food Hall Visit", category: "food", estimatedCost: 2000, currency: "INR", duration: 90, description: "Explore a vibrant food hall with diverse cuisine options", emoji: "🍕" },

  // ── Adventure (5) ──
  { id: "a1", title: "Hiking Trail", category: "adventure", estimatedCost: 800, currency: "INR", duration: 240, description: "Day hike on a scenic trail with panoramic views", emoji: "🥾" },
  { id: "a2", title: "Water Sports", category: "adventure", estimatedCost: 4000, currency: "INR", duration: 180, description: "Kayaking, snorkeling, or surfing experience", emoji: "🏄" },
  { id: "a3", title: "Zip Line Adventure", category: "adventure", estimatedCost: 3200, currency: "INR", duration: 90, description: "Soar through the air on an exciting zip line course", emoji: "🪂" },
  { id: "a4", title: "Cycling Tour", category: "adventure", estimatedCost: 2000, currency: "INR", duration: 180, description: "Explore the city or countryside by bicycle", emoji: "🚴" },
  { id: "a5", title: "Rock Climbing", category: "adventure", estimatedCost: 2800, currency: "INR", duration: 120, description: "Indoor or outdoor climbing experience for all levels", emoji: "🧗" },

  // ── Culture (5) ──
  { id: "c1", title: "Museum Visit", category: "culture", estimatedCost: 1200, currency: "INR", duration: 180, description: "Explore world-class art and history collections", emoji: "🏛" },
  { id: "c2", title: "Live Music Performance", category: "culture", estimatedCost: 2400, currency: "INR", duration: 120, description: "Enjoy traditional or contemporary live music", emoji: "🎵" },
  { id: "c3", title: "Theater or Opera Show", category: "culture", estimatedCost: 4000, currency: "INR", duration: 150, description: "Watch a captivating live performance", emoji: "🎭" },
  { id: "c4", title: "Art Gallery Tour", category: "culture", estimatedCost: 800, currency: "INR", duration: 120, description: "Browse contemporary and classical art galleries", emoji: "🎨" },
  { id: "c5", title: "Temple or Mosque Visit", category: "culture", estimatedCost: 400, currency: "INR", duration: 90, description: "Explore sacred sites and learn about local spirituality", emoji: "🕌" },

  // ── Shopping (5) ──
  { id: "sh1", title: "Local Souvenirs", category: "shopping", estimatedCost: 2400, currency: "INR", duration: 90, description: "Browse artisan shops for unique handcrafted souvenirs", emoji: "🎁" },
  { id: "sh2", title: "Flea Market Browse", category: "shopping", estimatedCost: 1600, currency: "INR", duration: 120, description: "Hunt for vintage treasures at the local flea market", emoji: "🛍" },
  { id: "sh3", title: "Designer District", category: "shopping", estimatedCost: 8000, currency: "INR", duration: 180, description: "Window shop or splurge at luxury boutiques", emoji: "👗" },
  { id: "sh4", title: "Night Market", category: "shopping", estimatedCost: 2000, currency: "INR", duration: 120, description: "Experience the vibrant atmosphere of a night market", emoji: "🏮" },
  { id: "sh5", title: "Bookshop Crawl", category: "shopping", estimatedCost: 1200, currency: "INR", duration: 90, description: "Visit charming independent bookstores", emoji: "📚" },

  // ── Transport (5) ──
  { id: "t1", title: "Hop-on Hop-off Bus", category: "transport", estimatedCost: 1600, currency: "INR", duration: 240, description: "See the city highlights from an open-top bus", emoji: "🚌" },
  { id: "t2", title: "Tuk-Tuk Ride", category: "transport", estimatedCost: 800, currency: "INR", duration: 60, description: "Zip through the streets in a fun tuk-tuk", emoji: "🛺" },
  { id: "t3", title: "Scenic Train Ride", category: "transport", estimatedCost: 2400, currency: "INR", duration: 180, description: "Journey through stunning landscapes by train", emoji: "🚆" },
  { id: "t4", title: "Ferry or Water Taxi", category: "transport", estimatedCost: 1200, currency: "INR", duration: 45, description: "Cross the harbor or river in style", emoji: "⛴" },
  { id: "t5", title: "Airport Transfer", category: "transport", estimatedCost: 2000, currency: "INR", duration: 60, description: "Private or shared transfer to/from the airport", emoji: "✈" },

  // ── Hotel (2) ──
  { id: "h1", title: "Boutique Hotel Stay", category: "hotel", estimatedCost: 9600, currency: "INR", duration: 1440, description: "Night in a stylish boutique hotel in the city center", emoji: "🏨" },
  { id: "h2", title: "Hostel Night", category: "hotel", estimatedCost: 2000, currency: "INR", duration: 1440, description: "Budget-friendly hostel in a social atmosphere", emoji: "🛏" },
];
