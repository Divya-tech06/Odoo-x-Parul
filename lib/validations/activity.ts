import { z } from "zod";

const activityCategoryEnum = z.enum([
  "sightseeing",
  "food",
  "transport",
  "hotel",
  "adventure",
  "culture",
  "shopping",
  "other",
]);

export const createActivitySchema = z.object({
  title: z.string().min(1, "Activity title is required").max(200),
  category: activityCategoryEnum,
  cost: z.number().min(0, "Cost cannot be negative").default(0),
  currency: z.string().length(3).default("INR"),
  duration: z.number().int().min(0).optional(),
  date: z.string().datetime().optional(),
  notes: z.string().max(1000).optional(),
  imageUrl: z.string().url().optional(),
});

export const updateActivitySchema = z.object({
  title: z.string().min(1).max(200).optional(),
  category: activityCategoryEnum.optional(),
  cost: z.number().min(0).optional(),
  currency: z.string().length(3).optional(),
  duration: z.number().int().min(0).optional().nullable(),
  date: z.string().datetime().optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  sortOrder: z.number().int().min(0).optional(),
});

export type CreateActivityInput = z.infer<typeof createActivitySchema>;
export type UpdateActivityInput = z.infer<typeof updateActivitySchema>;
