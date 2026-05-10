import { z } from "zod";

export const createStopSchema = z.object({
  city: z.string().min(1, "City name is required"),
  country: z.string().min(1, "Country is required"),
  countryCode: z.string().max(3).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  arrivalDate: z.string().datetime().optional(),
  departureDate: z.string().datetime().optional(),
  coverImage: z.string().url().optional(),
  orderIndex: z.number().int().min(0),
}).refine(
  (data) => {
    if (data.arrivalDate && data.departureDate) {
      return new Date(data.departureDate) >= new Date(data.arrivalDate);
    }
    return true;
  },
  { message: "Departure date must be after arrival date", path: ["departureDate"] }
);

export const updateStopSchema = z.object({
  city: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
  countryCode: z.string().max(3).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  arrivalDate: z.string().datetime().optional().nullable(),
  departureDate: z.string().datetime().optional().nullable(),
  coverImage: z.string().url().optional().nullable(),
  orderIndex: z.number().int().min(0).optional(),
});

export type CreateStopInput = z.infer<typeof createStopSchema>;
export type UpdateStopInput = z.infer<typeof updateStopSchema>;
