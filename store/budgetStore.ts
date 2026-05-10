import { create } from "zustand";
import type { Activity } from "@/types/activity";
import type { Expense, BudgetSummary } from "@/types/expense";
import {
  computeTotalCost,
  computeBudgetByCategory,
  computePerDayAverage,
  computeRemaining,
} from "@/lib/utils/budget";
import { FALLBACK_EXCHANGE_RATES } from "@/lib/data/fallbackRates";

interface BudgetState {
  baseCurrency: string;
  exchangeRates: Record<string, number>;
  totalCost: number;
  budgetByCategory: BudgetSummary;
  perDayAverage: number;
  remaining: number | null;
  budgetTarget: number | null;

  setBaseCurrency: (currency: string) => void;
  setExchangeRates: (rates: Record<string, number>) => void;
  setBudgetTarget: (target: number | null) => void;
  recompute: (
    activities: Activity[],
    expenses: Expense[],
    startDate?: string | null,
    endDate?: string | null
  ) => void;
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  baseCurrency: "USD",
  exchangeRates: FALLBACK_EXCHANGE_RATES,
  totalCost: 0,
  budgetByCategory: {
    hotels: 0,
    transport: 0,
    activities: 0,
    food: 0,
    miscellaneous: 0,
  },
  perDayAverage: 0,
  remaining: null,
  budgetTarget: null,

  setBaseCurrency: (currency) => set({ baseCurrency: currency }),

  setExchangeRates: (rates) => set({ exchangeRates: rates }),

  setBudgetTarget: (target) => {
    const state = get();
    set({
      budgetTarget: target,
      remaining: computeRemaining(state.totalCost, target),
    });
  },

  recompute: (activities, expenses, startDate, endDate) => {
    const state = get();
    const totalCost = computeTotalCost(
      activities,
      expenses,
      state.baseCurrency,
      state.exchangeRates
    );
    const budgetByCategory = computeBudgetByCategory(
      activities,
      expenses,
      state.baseCurrency,
      state.exchangeRates
    );
    const perDayAverage = computePerDayAverage(totalCost, startDate, endDate);
    const remaining = computeRemaining(totalCost, state.budgetTarget);

    set({ totalCost, budgetByCategory, perDayAverage, remaining });
  },
}));
