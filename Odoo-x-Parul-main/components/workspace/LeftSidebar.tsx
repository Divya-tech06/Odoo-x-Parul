"use client";

import { useTripStore } from "@/store/tripStore";
import { useBudgetStore } from "@/store/budgetStore";
import { useUIStore } from "@/store/uiStore";
import { useUpdateTrip } from "@/lib/hooks/useTrip";
import { useWeather } from "@/lib/hooks/useWeather";
import { formatDateRange } from "@/lib/utils/dates";
import { formatCurrency } from "@/lib/utils/currency";
import { computeStopCost } from "@/lib/utils/budget";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import {
  Plus, Share2, Check, Copy, MapPin, Calendar, Trash2,
  ChevronRight, Edit2, GripVertical, Thermometer,
} from "lucide-react";

export default function LeftSidebar({ tripId }: { tripId: string }) {
  const activeTrip = useTripStore((s) => s.activeTrip);
  const stops = useTripStore((s) => s.stops);
  const removeStop = useTripStore((s) => s.removeStop);
  const openAddCity = useUIStore((s) => s.openAddCity);
  const setSelectedStop = useUIStore((s) => s.setSelectedStop);
  const exchangeRates = useBudgetStore((s) => s.exchangeRates);
  const baseCurrency = useBudgetStore((s) => s.baseCurrency);
  const budgetTarget = useBudgetStore((s) => s.budgetTarget);
  const updateTrip = useUpdateTrip(tripId);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(activeTrip?.title || "");
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");

  if (!activeTrip) return null;

  const handleTitleSave = () => {
    if (editTitle.trim() && editTitle !== activeTrip.title) {
      updateTrip.mutate({ title: editTitle.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleShare = async () => {
    try {
      const res = await fetch(`/api/trips/${tripId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility: "PUBLIC" }),
      });
      const data = await res.json();
      const url = `${window.location.origin}${data.publicUrl}`;
      setShareLink(url);
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* handle error */ }
  };

  const handleDeleteStop = async (stopId: string) => {
    if (!confirm("Delete this city and all its activities?")) return;
    removeStop(stopId);
    await fetch(`/api/trips/${tripId}/stops/${stopId}`, { method: "DELETE" });
  };

  const handleBudgetSave = () => {
    const val = parseFloat(budgetInput);
    updateTrip.mutate({ budgetTarget: isNaN(val) ? null : val });
    setEditingBudget(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Trip Header */}
      <div className="relative h-32 overflow-hidden">
        {activeTrip.coverImage ? (
          <Image src={activeTrip.coverImage} alt={activeTrip.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-teal-500 to-teal-700" />
        )}
        <div className="absolute inset-0 gradient-overlay" />
        <div className="absolute bottom-3 left-4 right-4 text-white">
          {isEditingTitle ? (
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => e.key === "Enter" && handleTitleSave()}
              className="bg-white/20 backdrop-blur-sm rounded px-2 py-1 text-white font-display font-bold w-full outline-none"
              autoFocus
            />
          ) : (
            <h2
              onClick={() => { setEditTitle(activeTrip.title); setIsEditingTitle(true); }}
              className="font-display font-bold text-lg cursor-pointer hover:underline flex items-center gap-1"
            >
              {activeTrip.title}
              <Edit2 className="h-3 w-3 opacity-60" />
            </h2>
          )}
          <p className="text-xs text-white/70 mt-0.5">
            {formatDateRange(activeTrip.startDate, activeTrip.endDate)}
          </p>
        </div>
      </div>

      {/* Share & Budget */}
      <div className="px-4 py-3 border-b border-slate-100 space-y-2">
        <button onClick={handleShare} className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all">
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
          {copied ? "Link Copied!" : "Share Trip"}
        </button>

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Budget Goal</span>
          {editingBudget ? (
            <input
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              onBlur={handleBudgetSave}
              onKeyDown={(e) => e.key === "Enter" && handleBudgetSave()}
              className="w-24 px-2 py-1 border rounded text-right text-sm outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="0"
              autoFocus
            />
          ) : (
            <button
              onClick={() => { setBudgetInput(String(budgetTarget || "")); setEditingBudget(true); }}
              className="text-teal-600 font-medium hover:underline"
            >
              {budgetTarget ? formatCurrency(budgetTarget, activeTrip.budgetCurrency || "USD") : "Set →"}
            </button>
          )}
        </div>
      </div>

      {/* City Stops */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-3 py-3 space-y-2">
        {stops.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No cities added yet</p>
          </div>
        ) : (
          stops.map((stop, i) => {
            const cost = computeStopCost(stop.activities, baseCurrency, exchangeRates);
            return (
              <motion.div
                key={stop.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedStop(stop.id)}
                className="group p-3 rounded-xl border border-slate-100 hover:border-teal-200 hover:shadow-sm cursor-pointer transition-all bg-white"
              >
                <div className="flex items-start gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    {stop.coverImage ? (
                      <Image src={stop.coverImage} alt={stop.city} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-teal-100 flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-teal-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-slate-800 text-sm truncate">{stop.city}</h4>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteStop(stop.id); }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded text-red-400 transition-all"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-400">{stop.country}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-0.5">
                        <Calendar className="h-3 w-3" />
                        {formatDateRange(stop.arrivalDate, stop.departureDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-medium text-teal-600">
                        {formatCurrency(cost, baseCurrency)}
                      </span>
                      <span className="text-xs text-slate-400">
                        {stop.activities.length} activities
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Add City Button */}
      <div className="p-3 border-t border-slate-100">
        <button
          onClick={openAddCity}
          className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-sm font-medium text-slate-500 hover:border-teal-300 hover:text-teal-600 transition-all"
        >
          <Plus className="h-4 w-4" />
          Add City
        </button>
      </div>
    </div>
  );
}
