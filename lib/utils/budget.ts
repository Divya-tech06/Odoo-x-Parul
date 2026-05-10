import type { Activity } from "@/types/activity";
import type { Expense, BudgetSummary } from "@/types/expense";

/**
 * Maps Activity.category → BudgetSummary key
 */
const ACTIVITY_TO_BUDGET_MAP: Record<string, keyof BudgetSummary> = {
  hotel: "hotels",
  transport: "transport",
  food: "food",
  sightseeing: "activities",
  adventure: "activities",
  culture: "activities",
  shopping: "miscellaneous",
  other: "miscellaneous",
};

/**
 * Maps Expense.category → BudgetSummary key (1:1)
 */
const EXPENSE_TO_BUDGET_MAP: Record<string, keyof BudgetSummary> = {
  hotels: "hotels",
  transport: "transport",
  activities: "activities",
  food: "food",
  miscellaneous: "miscellaneous",
};

/**
 * Convert an amount from one currency to another using exchange rates
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>
): number {
  if (fromCurrency === toCurrency) return amount;

  const fromRate = rates[fromCurrency];
  const toRate = rates[toCurrency];

  if (!fromRate || !toRate) return amount;

  // Convert through base: amount / fromRate * toRate
  return (amount / fromRate) * toRate;
}

/**
 * Compute total cost of all activities + expenses, converted to base currency
 */
export function computeTotalCost(
  activities: Activity[],
  expenses: Expense[],
  baseCurrency: string,
  rates: Record<string, number>
): number {
  let total = 0;

  for (const activity of activities) {
    total += convertCurrency(activity.cost, activity.currency, baseCurrency, rates);
  }

  for (const expense of expenses) {
    total += convertCurrency(expense.amount, expense.currency, baseCurrency, rates);
  }

  return Math.round(total * 100) / 100;
}

/**
 * Compute budget breakdown by category
 */
export function computeBudgetByCategory(
  activities: Activity[],
  expenses: Expense[],
  baseCurrency: string,
  rates: Record<string, number>
): BudgetSummary {
  const summary: BudgetSummary = {
    hotels: 0,
    transport: 0,
    activities: 0,
    food: 0,
    miscellaneous: 0,
  };

  for (const activity of activities) {
    const budgetKey = ACTIVITY_TO_BUDGET_MAP[activity.category] || "miscellaneous";
    summary[budgetKey] += convertCurrency(activity.cost, activity.currency, baseCurrency, rates);
  }

  for (const expense of expenses) {
    const budgetKey = EXPENSE_TO_BUDGET_MAP[expense.category] || "miscellaneous";
    summary[budgetKey] += convertCurrency(expense.amount, expense.currency, baseCurrency, rates);
  }

  // Round everything
  for (const key of Object.keys(summary) as (keyof BudgetSummary)[]) {
    summary[key] = Math.round(summary[key] * 100) / 100;
  }

  return summary;
}

/**
 * Compute per-day average cost
 */
export function computePerDayAverage(
  totalCost: number,
  startDate: string | null | undefined,
  endDate: string | null | undefined
): number {
  if (!startDate || !endDate) return totalCost;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

  return Math.round((totalCost / days) * 100) / 100;
}

/**
 * Compute remaining budget
 */
export function computeRemaining(
  totalCost: number,
  budgetTarget: number | null | undefined
): number | null {
  if (budgetTarget == null) return null;
  return Math.round((budgetTarget - totalCost) * 100) / 100;
}

/**
 * Compute cost for a single stop
 */
export function computeStopCost(
  activities: Activity[],
  baseCurrency: string,
  rates: Record<string, number>
): number {
  let total = 0;
  for (const activity of activities) {
    total += convertCurrency(activity.cost, activity.currency, baseCurrency, rates);
  }
  return Math.round(total * 100) / 100;
}
