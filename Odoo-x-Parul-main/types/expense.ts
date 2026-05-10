export type ExpenseCategory =
  | "hotels"
  | "transport"
  | "activities"
  | "food"
  | "miscellaneous";

export interface Expense {
  id: string;
  tripId: string;
  category: ExpenseCategory;
  amount: number;
  currency: string;
  description: string | null;
  date: string | null;
  createdAt: string;
}

export interface CreateExpenseInput {
  category: ExpenseCategory;
  amount: number;
  currency?: string;
  description?: string;
  date?: string;
}

export interface UpdateExpenseInput {
  category?: ExpenseCategory;
  amount?: number;
  currency?: string;
  description?: string;
  date?: string;
}

export interface BudgetSummary {
  hotels: number;
  transport: number;
  activities: number;
  food: number;
  miscellaneous: number;
}

export const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string; color: string }[] = [
  { value: "hotels", label: "Hotels", color: "#3b82f6" },
  { value: "transport", label: "Transport", color: "#f97316" },
  { value: "activities", label: "Activities", color: "#14b8a6" },
  { value: "food", label: "Food", color: "#22c55e" },
  { value: "miscellaneous", label: "Miscellaneous", color: "#6b7280" },
];
