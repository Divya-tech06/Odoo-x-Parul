import { create } from "zustand";
import type { Trip, TripStop } from "@/types/trip";
import type { Activity } from "@/types/activity";
import type { Expense } from "@/types/expense";
import type { Note } from "@/types/api";

interface TripState {
  activeTrip: Trip | null;
  stops: TripStop[];
  expenses: Expense[];
  notes: Note[];

  setActiveTrip: (trip: Trip) => void;
  clearActiveTrip: () => void;

  // Stops
  setStops: (stops: TripStop[]) => void;
  addStop: (stop: TripStop) => void;
  updateStop: (stopId: string, data: Partial<TripStop>) => void;
  removeStop: (stopId: string) => void;
  reorderStops: (stops: TripStop[]) => void;

  // Activities
  addActivity: (stopId: string, activity: Activity) => void;
  updateActivity: (stopId: string, activityId: string, data: Partial<Activity>) => void;
  removeActivity: (stopId: string, activityId: string) => void;

  // Expenses
  setExpenses: (expenses: Expense[]) => void;
  addExpense: (expense: Expense) => void;
  updateExpense: (expenseId: string, data: Partial<Expense>) => void;
  removeExpense: (expenseId: string) => void;

  // Notes
  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  updateNote: (noteId: string, data: Partial<Note>) => void;
  removeNote: (noteId: string) => void;

  // Computed
  getAllActivities: () => Activity[];
}

export const useTripStore = create<TripState>((set, get) => ({
  activeTrip: null,
  stops: [],
  expenses: [],
  notes: [],

  setActiveTrip: (trip) => set({
    activeTrip: trip,
    stops: trip.stops || [],
    expenses: trip.expenses || [],
    notes: trip.notes || [],
  }),

  clearActiveTrip: () => set({
    activeTrip: null,
    stops: [],
    expenses: [],
    notes: [],
  }),

  // ── Stops ──
  setStops: (stops) => set({ stops }),

  addStop: (stop) => set((state) => ({
    stops: [...state.stops, stop].sort((a, b) => a.orderIndex - b.orderIndex),
  })),

  updateStop: (stopId, data) => set((state) => ({
    stops: state.stops.map((s) =>
      s.id === stopId ? { ...s, ...data } : s
    ),
  })),

  removeStop: (stopId) => set((state) => ({
    stops: state.stops
      .filter((s) => s.id !== stopId)
      .map((s, idx) => ({ ...s, orderIndex: idx })),
  })),

  reorderStops: (stops) => set({ stops }),

  // ── Activities ──
  addActivity: (stopId, activity) => set((state) => ({
    stops: state.stops.map((s) =>
      s.id === stopId
        ? { ...s, activities: [...s.activities, activity] }
        : s
    ),
  })),

  updateActivity: (stopId, activityId, data) => set((state) => ({
    stops: state.stops.map((s) =>
      s.id === stopId
        ? {
            ...s,
            activities: s.activities.map((a) =>
              a.id === activityId ? { ...a, ...data } : a
            ),
          }
        : s
    ),
  })),

  removeActivity: (stopId, activityId) => set((state) => ({
    stops: state.stops.map((s) =>
      s.id === stopId
        ? { ...s, activities: s.activities.filter((a) => a.id !== activityId) }
        : s
    ),
  })),

  // ── Expenses ──
  setExpenses: (expenses) => set({ expenses }),
  addExpense: (expense) => set((state) => ({ expenses: [...state.expenses, expense] })),
  updateExpense: (expenseId, data) => set((state) => ({
    expenses: state.expenses.map((e) => (e.id === expenseId ? { ...e, ...data } : e)),
  })),
  removeExpense: (expenseId) => set((state) => ({
    expenses: state.expenses.filter((e) => e.id !== expenseId),
  })),

  // ── Notes ──
  setNotes: (notes) => set({ notes }),
  addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),
  updateNote: (noteId, data) => set((state) => ({
    notes: state.notes.map((n) => (n.id === noteId ? { ...n, ...data } : n)),
  })),
  removeNote: (noteId) => set((state) => ({
    notes: state.notes.filter((n) => n.id !== noteId),
  })),

  // ── Computed ──
  getAllActivities: () => {
    const state = get();
    return state.stops.flatMap((s) => s.activities);
  },
}));
