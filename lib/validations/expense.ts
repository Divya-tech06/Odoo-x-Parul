import { z } from "zod";

const expenseCategoryEnum = z.enum([
  "hotels",
  "transport",
  "activities",
  "food",
  "miscellaneous",
]);

export const createExpenseSchema = z.object({
  category: expenseCategoryEnum,
  amount: z.number().min(0, "Amount cannot be negative"),
  currency: z.string().length(3).default("USD"),
  description: z.string().max(300).optional(),
  date: z.string().datetime().optional(),
});

export const updateExpenseSchema = z.object({
  category: expenseCategoryEnum.optional(),
  amount: z.number().min(0).optional(),
  currency: z.string().length(3).optional(),
  description: z.string().max(300).optional().nullable(),
  date: z.string().datetime().optional().nullable(),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
