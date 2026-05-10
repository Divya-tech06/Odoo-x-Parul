export type ActivityCategory =
  | "sightseeing"
  | "food"
  | "transport"
  | "hotel"
  | "adventure"
  | "culture"
  | "shopping"
  | "other";

export interface Activity {
  id: string;
  stopId: string;
  title: string;
  category: ActivityCategory;
  cost: number;
  currency: string;
  duration: number | null;
  date: string | null;
  notes: string | null;
  imageUrl: string | null;
  sortOrder: number;
  createdAt: string;
}

export interface CreateActivityInput {
  title: string;
  category: ActivityCategory;
  cost?: number;
  currency?: string;
  duration?: number;
  date?: string;
  notes?: string;
  imageUrl?: string;
}

export interface UpdateActivityInput {
  title?: string;
  category?: ActivityCategory;
  cost?: number;
  currency?: string;
  duration?: number;
  date?: string;
  notes?: string;
  imageUrl?: string;
  sortOrder?: number;
}

export const ACTIVITY_CATEGORIES: { value: ActivityCategory; label: string; emoji: string }[] = [
  { value: "sightseeing", label: "Sightseeing", emoji: "🏛" },
  { value: "food", label: "Food & Dining", emoji: "🍕" },
  { value: "transport", label: "Transport", emoji: "🚌" },
  { value: "hotel", label: "Hotel", emoji: "🏨" },
  { value: "adventure", label: "Adventure", emoji: "🎭" },
  { value: "culture", label: "Culture", emoji: "🎨" },
  { value: "shopping", label: "Shopping", emoji: "🛍" },
  { value: "other", label: "Other", emoji: "📌" },
];

export const CATEGORY_EMOJI_MAP: Record<string, string> = {
  sightseeing: "🏛",
  food: "🍕",
  transport: "🚌",
  hotel: "🏨",
  adventure: "🎭",
  culture: "🎨",
  shopping: "🛍",
  other: "📌",
};
