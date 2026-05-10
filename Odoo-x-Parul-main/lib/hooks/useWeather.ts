import { useQuery } from "@tanstack/react-query";
import type { WeatherData } from "@/types/api";

export function useWeather(city: string, lat?: number | null, lon?: number | null) {
  return useQuery({
    queryKey: ["weather", city, lat, lon],
    queryFn: async () => {
      const params = new URLSearchParams({ city });
      if (lat != null) params.set("lat", lat.toString());
      if (lon != null) params.set("lon", lon.toString());

      const res = await fetch(`/api/external/weather?${params}`);
      if (!res.ok) throw new Error("Failed to fetch weather");
      return res.json() as Promise<WeatherData>;
    },
    staleTime: 300_000, // 5 minutes
    enabled: !!city,
  });
}
