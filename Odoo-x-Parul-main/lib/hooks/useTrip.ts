import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTripStore } from "@/store/tripStore";
import { useBudgetStore } from "@/store/budgetStore";
import type { Trip } from "@/types/trip";

export function useTrips() {
  return useQuery({
    queryKey: ["trips"],
    queryFn: async () => {
      const res = await fetch("/api/trips");
      if (!res.ok) throw new Error("Failed to fetch trips");
      return res.json() as Promise<Trip[]>;
    },
  });
}

export function useTrip(tripId: string) {
  const setActiveTrip = useTripStore((s) => s.setActiveTrip);
  const recompute = useBudgetStore((s) => s.recompute);
  const setBudgetTarget = useBudgetStore((s) => s.setBudgetTarget);

  return useQuery({
    queryKey: ["trip", tripId],
    queryFn: async () => {
      const res = await fetch(`/api/trips/${tripId}`);
      if (!res.ok) throw new Error("Failed to fetch trip");
      const trip = (await res.json()) as Trip;

      // Hydrate Zustand stores
      setActiveTrip(trip);
      setBudgetTarget(trip.budgetTarget);

      // Compute budget
      const allActivities = trip.stops?.flatMap((s) => s.activities) || [];
      recompute(allActivities, trip.expenses || [], trip.startDate, trip.endDate);

      return trip;
    },
    staleTime: 60_000,
  });
}

export function useCreateTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description?: string;
      startDate?: string;
      endDate?: string;
      coverImage?: string;
    }) => {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create trip");
      }
      return res.json() as Promise<Trip>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });
}

export function useUpdateTrip(tripId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await fetch(`/api/trips/${tripId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update trip");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });
}

export function useDeleteTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tripId: string) => {
      const res = await fetch(`/api/trips/${tripId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete trip");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });
}
