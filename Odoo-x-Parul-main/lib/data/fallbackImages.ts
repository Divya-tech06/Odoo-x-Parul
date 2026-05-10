/**
 * Curated Unsplash photo URLs for fallback when API key is not available.
 * Using stable direct Unsplash URLs that don't require API access.
 */
export const FALLBACK_IMAGES: Record<string, string> = {
  paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
  tokyo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
  rome: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80",
  barcelona: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80",
  bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
  dubai: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
  "new york": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
  london: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
  singapore: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80",
  bangkok: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80",
  amsterdam: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80",
  prague: "https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&q=80",
  istanbul: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80",
  sydney: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80",
  "cape town": "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80",
  mumbai: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&q=80",
  "mexico city": "https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?w=800&q=80",
  lisbon: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&q=80",
  vienna: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&q=80",
  seoul: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&q=80",
};

/**
 * Get a fallback image URL for a city name.
 * Falls back to a generic travel image if city not found.
 */
export function getFallbackImage(cityName: string): string {
  const key = cityName.toLowerCase();
  return FALLBACK_IMAGES[key] || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80";
}

/**
 * Get inspiration destinations with their images
 */
export function getInspirationDestinations(): { city: string; country: string; image: string }[] {
  return [
    { city: "Tokyo", country: "Japan", image: FALLBACK_IMAGES.tokyo },
    { city: "Paris", country: "France", image: FALLBACK_IMAGES.paris },
    { city: "Bali", country: "Indonesia", image: FALLBACK_IMAGES.bali },
    { city: "Barcelona", country: "Spain", image: FALLBACK_IMAGES.barcelona },
    { city: "Dubai", country: "UAE", image: FALLBACK_IMAGES.dubai },
    { city: "Istanbul", country: "Turkey", image: FALLBACK_IMAGES.istanbul },
  ];
}
