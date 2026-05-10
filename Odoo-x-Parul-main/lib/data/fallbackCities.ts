import type { CitySearchResult } from "@/types/api";

export const FALLBACK_CITIES: CitySearchResult[] = [
  { id: "paris", name: "Paris", country: "France", countryCode: "FR", latitude: 48.8566, longitude: 2.3522 },
  { id: "tokyo", name: "Tokyo", country: "Japan", countryCode: "JP", latitude: 35.6762, longitude: 139.6503 },
  { id: "rome", name: "Rome", country: "Italy", countryCode: "IT", latitude: 41.9028, longitude: 12.4964 },
  { id: "barcelona", name: "Barcelona", country: "Spain", countryCode: "ES", latitude: 41.3874, longitude: 2.1686 },
  { id: "bali", name: "Bali", country: "Indonesia", countryCode: "ID", latitude: -8.3405, longitude: 115.092 },
  { id: "dubai", name: "Dubai", country: "United Arab Emirates", countryCode: "AE", latitude: 25.2048, longitude: 55.2708 },
  { id: "new-york", name: "New York", country: "United States", countryCode: "US", latitude: 40.7128, longitude: -74.006 },
  { id: "london", name: "London", country: "United Kingdom", countryCode: "GB", latitude: 51.5074, longitude: -0.1278 },
  { id: "singapore", name: "Singapore", country: "Singapore", countryCode: "SG", latitude: 1.3521, longitude: 103.8198 },
  { id: "bangkok", name: "Bangkok", country: "Thailand", countryCode: "TH", latitude: 13.7563, longitude: 100.5018 },
  { id: "amsterdam", name: "Amsterdam", country: "Netherlands", countryCode: "NL", latitude: 52.3676, longitude: 4.9041 },
  { id: "prague", name: "Prague", country: "Czech Republic", countryCode: "CZ", latitude: 50.0755, longitude: 14.4378 },
  { id: "istanbul", name: "Istanbul", country: "Turkey", countryCode: "TR", latitude: 41.0082, longitude: 28.9784 },
  { id: "sydney", name: "Sydney", country: "Australia", countryCode: "AU", latitude: -33.8688, longitude: 151.2093 },
  { id: "cape-town", name: "Cape Town", country: "South Africa", countryCode: "ZA", latitude: -33.9249, longitude: 18.4241 },
  { id: "mumbai", name: "Mumbai", country: "India", countryCode: "IN", latitude: 19.076, longitude: 72.8777 },
  { id: "mexico-city", name: "Mexico City", country: "Mexico", countryCode: "MX", latitude: 19.4326, longitude: -99.1332 },
  { id: "lisbon", name: "Lisbon", country: "Portugal", countryCode: "PT", latitude: 38.7223, longitude: -9.1393 },
  { id: "vienna", name: "Vienna", country: "Austria", countryCode: "AT", latitude: 48.2082, longitude: 16.3738 },
  { id: "seoul", name: "Seoul", country: "South Korea", countryCode: "KR", latitude: 37.5665, longitude: 126.978 },
];

/**
 * Search fallback cities by prefix match on city name
 */
export function searchFallbackCities(query: string, limit: number = 8): CitySearchResult[] {
  const q = query.toLowerCase();
  return FALLBACK_CITIES
    .filter((c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q))
    .slice(0, limit);
}
