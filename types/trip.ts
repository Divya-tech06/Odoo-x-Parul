import type { Activity } from "./activity";
import type { Expense } from "./expense";
import type { Note } from "./api";

export type TripVisibility = "PUBLIC" | "PRIVATE";

export interface TripBase {
  id: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  startDate: string | null;
  endDate: string | null;
  visibility: TripVisibility;
  shareToken: string | null;
  budgetTarget: number | null;
  budgetCurrency: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Trip extends TripBase {
  userId: string;
  stops: TripStop[];
  expenses: Expense[];
  notes: Note[];
}

export interface TripSummary extends TripBase {
  stopCount: number;
  totalCost: number;
  status: "upcoming" | "ongoing" | "completed";
}

export interface TripStop {
  id: string;
  tripId: string;
  city: string;
  country: string;
  countryCode: string | null;
  latitude: number | null;
  longitude: number | null;
  arrivalDate: string | null;
  departureDate: string | null;
  orderIndex: number;
  coverImage: string | null;
  createdAt: string;
  activities: Activity[];
}

export interface CreateTripInput {
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  coverImage?: string;
}

export interface UpdateTripInput {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  coverImage?: string;
  visibility?: TripVisibility;
  budgetTarget?: number | null;
  budgetCurrency?: string;
}

export interface CreateStopInput {
  city: string;
  country: string;
  countryCode?: string;
  latitude?: number;
  longitude?: number;
  arrivalDate?: string;
  departureDate?: string;
  coverImage?: string;
  orderIndex: number;
}

export interface UpdateStopInput {
  city?: string;
  country?: string;
  countryCode?: string;
  latitude?: number;
  longitude?: number;
  arrivalDate?: string;
  departureDate?: string;
  coverImage?: string;
  orderIndex?: number;
}
