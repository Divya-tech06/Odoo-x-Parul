"use client";

import { useTripStore } from "@/store/tripStore";
import { useUIStore } from "@/store/uiStore";
import { motion } from "framer-motion";
import { useState } from "react";
import { PanelRightOpen, MapPin, DollarSign, List } from "lucide-react";
import LeftSidebar from "./LeftSidebar";
import CenterTimeline from "./CenterTimeline";
import RightPanel from "./RightPanel";
import AddCityModal from "@/components/modals/AddCityModal";
import AddActivityModal from "@/components/modals/AddActivityModal";

export default function WorkspaceLayout({ tripId }: { tripId: string }) {
  const activeTrip = useTripStore((s) => s.activeTrip);
  const mobileView = useUIStore((s) => s.mobileView);
  const setMobileView = useUIStore((s) => s.setMobileView);
  const isRightDrawerOpen = useUIStore((s) => s.isRightDrawerOpen);
  const toggleRightDrawer = useUIStore((s) => s.toggleRightDrawer);

  if (!activeTrip) return null;

  return (
    <div className="-mx-4 lg:-mx-6 -my-8">
      {/* Desktop 3-panel */}
      <div className="hidden lg:flex h-[calc(100vh-64px)]">
        <div className="w-[280px] border-r border-slate-200 bg-white overflow-y-auto scrollbar-thin">
          <LeftSidebar tripId={tripId} />
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin bg-slate-50">
          <CenterTimeline tripId={tripId} />
        </div>
        <div className="w-[340px] border-l border-slate-200 bg-white overflow-y-auto scrollbar-thin">
          <RightPanel tripId={tripId} />
        </div>
      </div>

      {/* Tablet: 2 panels + drawer */}
      <div className="hidden md:flex lg:hidden h-[calc(100vh-64px)]">
        <div className="w-[72px] border-r border-slate-200 bg-white flex flex-col items-center py-4 gap-3">
          <button onClick={() => setMobileView("details")} className="p-2.5 rounded-xl hover:bg-slate-100">
            <List className="h-5 w-5 text-slate-600" />
          </button>
          <button onClick={toggleRightDrawer} className="p-2.5 rounded-xl hover:bg-slate-100">
            <PanelRightOpen className="h-5 w-5 text-slate-600" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin bg-slate-50">
          <CenterTimeline tripId={tripId} />
        </div>
        {isRightDrawerOpen && (
          <motion.div initial={{ x: 340 }} animate={{ x: 0 }} className="w-[340px] border-l border-slate-200 bg-white overflow-y-auto">
            <RightPanel tripId={tripId} />
          </motion.div>
        )}
      </div>

      {/* Mobile: tabbed */}
      <div className="md:hidden h-[calc(100vh-64px)] flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {mobileView === "timeline" && <CenterTimeline tripId={tripId} />}
          {mobileView === "budget" && <RightPanel tripId={tripId} />}
          {mobileView === "details" && <LeftSidebar tripId={tripId} />}
        </div>
        <div className="flex border-t border-slate-200 bg-white">
          {[
            { key: "timeline" as const, icon: MapPin, label: "Plan" },
            { key: "budget" as const, icon: DollarSign, label: "Budget" },
            { key: "details" as const, icon: List, label: "Details" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setMobileView(tab.key)}
              className={`flex-1 flex flex-col items-center py-3 text-xs font-medium transition-all ${
                mobileView === tab.key ? "text-teal-600" : "text-slate-400"
              }`}
            >
              <tab.icon className="h-5 w-5 mb-1" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AddCityModal tripId={tripId} />
      <AddActivityModal />
    </div>
  );
}
