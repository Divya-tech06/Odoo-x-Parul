import { useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "./useDebouncedValue";
import type { CitySearchResult } from "@/types/api";

export function useCitySearch(query: string) {
  const debouncedQuery = useDebouncedValue(query, 300);

  return useQuery({
    queryKey: ["citySearch", debouncedQuery],
    queryFn: async () => {
      const res = await fetch(
        `/api/external/cities?query=${encodeURIComponent(debouncedQuery)}&limit=8`
      );
      if (!res.ok) throw new Error("Failed to search cities");
      const data = await res.json();
      return data.cities as CitySearchResult[];
    },
    enabled: debouncedQuery.length >= 2,
    staleTime: 300_000, // 5 minutes
  });
}
