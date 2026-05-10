import { z } from "zod";

export const createTripSchema = z.object({
  title: z.string().min(1, "Trip title is required").max(100, "Title too long"),
  description: z.string().max(500).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  coverImage: z.string().url().optional(),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.endDate) >= new Date(data.startDate);
    }
    return true;
  },
  { message: "End date must be after start date", path: ["endDate"] }
);

export const updateTripSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
  coverImage: z.string().url().optional().nullable(),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
  budgetTarget: z.number().min(0).optional().nullable(),
  budgetCurrency: z.string().min(3).max(3).optional(),
});

export type CreateTripInput = z.infer<typeof createTripSchema>;
export type UpdateTripInput = z.infer<typeof updateTripSchema>;
