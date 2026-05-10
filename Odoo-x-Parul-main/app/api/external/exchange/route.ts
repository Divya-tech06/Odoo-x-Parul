import { NextRequest, NextResponse } from "next/server";
import { getCached, setCached, CACHE_TTL } from "@/lib/utils/cache";
import { FALLBACK_EXCHANGE_RATES } from "@/lib/data/fallbackRates";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const base = searchParams.get("base") || "USD";

    const cacheKey = `exchange:${base}`;
    const cached = getCached<{ base: string; rates: Record<string, number> }>(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const apiKey = process.env.EXCHANGERATE_API_KEY;

    // Use fallback if no API key
    if (!apiKey) {
      // Convert fallback rates to requested base
      const baseRate = FALLBACK_EXCHANGE_RATES[base] || 1;
      const convertedRates: Record<string, number> = {};
      for (const [currency, rate] of Object.entries(FALLBACK_EXCHANGE_RATES)) {
        convertedRates[currency] = Math.round((rate / baseRate) * 10000) / 10000;
      }
      const result = { base, rates: convertedRates };
      setCached(cacheKey, result, CACHE_TTL.EXCHANGE);
      return NextResponse.json(result);
    }

    const res = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${base}`
    );

    if (!res.ok) {
      const baseRate = FALLBACK_EXCHANGE_RATES[base] || 1;
      const convertedRates: Record<string, number> = {};
      for (const [currency, rate] of Object.entries(FALLBACK_EXCHANGE_RATES)) {
        convertedRates[currency] = Math.round((rate / baseRate) * 10000) / 10000;
      }
      return NextResponse.json({ base, rates: convertedRates });
    }

    const data = await res.json();
    const result = {
      base: data.base_code || base,
      rates: data.conversion_rates || {},
    };

    setCached(cacheKey, result, CACHE_TTL.EXCHANGE);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Exchange rate proxy error:", error);
    return NextResponse.json({ base: "USD", rates: FALLBACK_EXCHANGE_RATES });
  }
}
