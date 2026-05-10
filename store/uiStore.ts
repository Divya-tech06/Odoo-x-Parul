import { create } from "zustand";

type RightPanelTab = "activities" | "budget" | "weather" | "notes";
type TransportMethod = "flight" | "train" | "bus" | "car";

interface TransitionInfo {
  method: TransportMethod;
  duration: string;
  cost: number;
}

interface UIState {
  // Right panel
  rightPanelTab: RightPanelTab;
  setRightPanelTab: (tab: RightPanelTab) => void;

  // Selected stop
  selectedStopId: string | null;
  setSelectedStop: (id: string | null) => void;

  // Modals
  isAddCityModalOpen: boolean;
  isAddActivityModalOpen: boolean;
  isCreateTripModalOpen: boolean;
  activeActivityDayContext: string | null;
  activeActivityStopId: string | null;

  openAddCity: () => void;
  closeAddCity: () => void;
  openAddActivity: (stopId: string, dayContext: string | null) => void;
  closeAddActivity: () => void;
  openCreateTrip: () => void;
  closeCreateTrip: () => void;

  // City transitions (not persisted to DB in MVP)
  transitions: Record<string, TransitionInfo>;
  setTransition: (key: string, info: TransitionInfo) => void;

  // Mobile
  mobileView: "timeline" | "budget" | "details";
  setMobileView: (view: "timeline" | "budget" | "details") => void;

  // Right panel drawer (tablet)
  isRightDrawerOpen: boolean;
  toggleRightDrawer: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  rightPanelTab: "budget",
  setRightPanelTab: (tab) => set({ rightPanelTab: tab }),

  selectedStopId: null,
  setSelectedStop: (id) => set({ selectedStopId: id }),

  isAddCityModalOpen: false,
  isAddActivityModalOpen: false,
  isCreateTripModalOpen: false,
  activeActivityDayContext: null,
  activeActivityStopId: null,

  openAddCity: () => set({ isAddCityModalOpen: true }),
  closeAddCity: () => set({ isAddCityModalOpen: false }),
  openAddActivity: (stopId, dayContext) =>
    set({
      isAddActivityModalOpen: true,
      activeActivityStopId: stopId,
      activeActivityDayContext: dayContext,
    }),
  closeAddActivity: () =>
    set({
      isAddActivityModalOpen: false,
      activeActivityStopId: null,
      activeActivityDayContext: null,
    }),
  openCreateTrip: () => set({ isCreateTripModalOpen: true }),
  closeCreateTrip: () => set({ isCreateTripModalOpen: false }),

  transitions: {},
  setTransition: (key, info) =>
    set((state) => ({
      transitions: { ...state.transitions, [key]: info },
    })),

  mobileView: "timeline",
  setMobileView: (view) => set({ mobileView: view }),

  isRightDrawerOpen: false,
  toggleRightDrawer: () =>
    set((state) => ({ isRightDrawerOpen: !state.isRightDrawerOpen })),
}));
