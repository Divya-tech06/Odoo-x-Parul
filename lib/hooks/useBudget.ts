import { useCallback, useEffect } from "react";
import { useBudgetStore } from "@/store/budgetStore";
import { useTripStore } from "@/store/tripStore";

/**
 * Hook that keeps the budget store in sync with trip data.
 * Call this in the workspace layout to ensure budget auto-recomputes.
 */
export function useBudget() {
  const stops = useTripStore((s) => s.stops);
  const expenses = useTripStore((s) => s.expenses);
  const activeTrip = useTripStore((s) => s.activeTrip);
  const recompute = useBudgetStore((s) => s.recompute);
  const budgetStore = useBudgetStore();

  // Recompute whenever activities or expenses change
  useEffect(() => {
    const allActivities = stops.flatMap((s) => s.activities);
    recompute(
      allActivities,
      expenses,
      activeTrip?.startDate,
      activeTrip?.endDate
    );
  }, [stops, expenses, activeTrip?.startDate, activeTrip?.endDate, recompute]);

  const fetchExchangeRates = useCallback(async (baseCurrency: string) => {
    try {
      const res = await fetch(`/api/external/exchange?base=${baseCurrency}`);
      if (res.ok) {
        const data = await res.json();
        budgetStore.setExchangeRates(data.rates);
        budgetStore.setBaseCurrency(baseCurrency);
        // Trigger recompute with new rates
        const allActivities = stops.flatMap((s) => s.activities);
        recompute(
          allActivities,
          expenses,
          activeTrip?.startDate,
          activeTrip?.endDate
        );
      }
    } catch {
      // Keep fallback rates
    }
  }, [stops, expenses, activeTrip, budgetStore, recompute]);

  return {
    ...budgetStore,
    fetchExchangeRates,
  };
}
