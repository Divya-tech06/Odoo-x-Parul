import { NextRequest, NextResponse } from "next/server";
import { searchFallbackCities } from "@/lib/data/fallbackCities";
import { getCached, setCached, CACHE_TTL } from "@/lib/utils/cache";
import type { CitySearchResult } from "@/types/api";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const limit = parseInt(searchParams.get("limit") || "8", 10);

    if (query.length < 2) {
      return NextResponse.json({ cities: [] });
    }

    // Check cache
    const cacheKey = `cities:${query}:${limit}`;
    const cached = getCached<CitySearchResult[]>(cacheKey);
    if (cached) {
      return NextResponse.json({ cities: cached });
    }

    const apiKey = process.env.RAPIDAPI_KEY;
    const apiHost = process.env.RAPIDAPI_HOST || "wft-geo-db.p.rapidapi.com";

    // Use fallback if no API key
    if (!apiKey) {
      const cities = searchFallbackCities(query, limit);
      return NextResponse.json({ cities });
    }

    const res = await fetch(
      `https://${apiHost}/v1/geo/cities?namePrefix=${encodeURIComponent(query)}&limit=${limit}&sort=-population`,
      {
        headers: {
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": apiHost,
        },
      }
    );

    if (!res.ok) {
      // Fallback to hardcoded cities on API error
      const cities = searchFallbackCities(query, limit);
      return NextResponse.json({ cities });
    }

    const data = await res.json();
    const cities: CitySearchResult[] = (data.data || []).map((c: Record<string, unknown>) => ({
      id: String(c.id),
      name: String(c.city || c.name),
      country: String(c.country),
      countryCode: String(c.countryCode),
      latitude: Number(c.latitude),
      longitude: Number(c.longitude),
    }));

    setCached(cacheKey, cities, CACHE_TTL.CITIES);
    return NextResponse.json({ cities });
  } catch (error) {
    console.error("City search error:", error);
    const query = new URL(req.url).searchParams.get("query") || "";
    const cities = searchFallbackCities(query, 8);
    return NextResponse.json({ cities });
  }
}
