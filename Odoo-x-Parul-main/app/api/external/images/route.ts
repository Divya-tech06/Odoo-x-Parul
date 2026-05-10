import { NextRequest, NextResponse } from "next/server";
import { getCached, setCached, CACHE_TTL } from "@/lib/utils/cache";
import { getFallbackImage } from "@/lib/data/fallbackImages";
import type { UnsplashImage } from "@/types/api";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const count = parseInt(searchParams.get("count") || "6", 10);

    if (!query) {
      return NextResponse.json({ images: [] });
    }

    const cacheKey = `images:${query}:${count}`;
    const cached = getCached<UnsplashImage[]>(cacheKey);
    if (cached) {
      return NextResponse.json({ images: cached });
    }

    const apiKey = process.env.UNSPLASH_ACCESS_KEY;

    // Fallback to curated images
    if (!apiKey) {
      const fallbackUrl = getFallbackImage(query);
      const images: UnsplashImage[] = [
        {
          id: `fallback-${query}`,
          url: fallbackUrl,
          thumbUrl: fallbackUrl.replace("w=800", "w=400"),
          blurHash: null,
          alt: `${query} cityscape`,
          credit: "Unsplash",
        },
      ];
      return NextResponse.json({ images });
    }

    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${apiKey}`,
        },
      }
    );

    if (!res.ok) {
      const fallbackUrl = getFallbackImage(query);
      return NextResponse.json({
        images: [
          {
            id: `fallback-${query}`,
            url: fallbackUrl,
            thumbUrl: fallbackUrl,
            blurHash: null,
            alt: `${query}`,
            credit: "Unsplash",
          },
        ],
      });
    }

    const data = await res.json();
    const images: UnsplashImage[] = (data.results || []).map(
      (photo: Record<string, unknown>) => {
        const urls = photo.urls as Record<string, string>;
        const user = photo.user as Record<string, string>;
        return {
          id: String(photo.id),
          url: urls.regular,
          thumbUrl: urls.thumb,
          blurHash: photo.blur_hash ? String(photo.blur_hash) : null,
          alt: photo.alt_description ? String(photo.alt_description) : String(query),
          credit: user.name || "Unsplash",
        };
      }
    );

    setCached(cacheKey, images, CACHE_TTL.IMAGES);
    return NextResponse.json({ images });
  } catch (error) {
    console.error("Unsplash proxy error:", error);
    const query = new URL(req.url).searchParams.get("query") || "";
    return NextResponse.json({
      images: [
        {
          id: "fallback",
          url: getFallbackImage(query),
          thumbUrl: getFallbackImage(query),
          blurHash: null,
          alt: query,
          credit: "Unsplash",
        },
      ],
    });
  }
}
