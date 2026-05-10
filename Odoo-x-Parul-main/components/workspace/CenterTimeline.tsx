"use client";

import { useTripStore } from "@/store/tripStore";
import { useUIStore } from "@/store/uiStore";
import { useBudgetStore } from "@/store/budgetStore";
import { getDaysInRange, formatDayLabel } from "@/lib/utils/dates";
import { formatCurrency } from "@/lib/utils/currency";
import { computeStopCost } from "@/lib/utils/budget";
import { CATEGORY_EMOJI_MAP } from "@/types/activity";
import { motion } from "framer-motion";
import Image from "next/image";
import { format, isSameDay } from "date-fns";
import {
  Plus, Trash2, Plane, Train, Bus, Car, Clock, ChevronRight,
} from "lucide-react";

export default function CenterTimeline({ tripId }: { tripId: string }) {
  const activeTrip = useTripStore((s) => s.activeTrip);
  const stops = useTripStore((s) => s.stops);
  const removeActivity = useTripStore((s) => s.removeActivity);
  const openAddActivity = useUIStore((s) => s.openAddActivity);
  const transitions = useUIStore((s) => s.transitions);
  const setTransition = useUIStore((s) => s.setTransition);
  const baseCurrency = useBudgetStore((s) => s.baseCurrency);
  const exchangeRates = useBudgetStore((s) => s.exchangeRates);

  if (!activeTrip) return null;

  const handleDeleteActivity = async (stopId: string, activityId: string) => {
    removeActivity(stopId, activityId);
    await fetch(`/api/stops/${stopId}/activities/${activityId}`, { method: "DELETE" });
  };

  const transportIcons: Record<string, typeof Plane> = {
    flight: Plane, train: Train, bus: Bus, car: Car,
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Route Header */}
      {stops.length > 0 && (
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-thin">
          {stops.map((stop, i) => (
            <div key={stop.id} className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => {
                  document.getElementById(`stop-${stop.id}`)?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-700 hover:border-teal-300 hover:text-teal-600 transition-all whitespace-nowrap"
              >
                {stop.city}
              </button>
              {i < stops.length - 1 && (
                <Plane className="h-3.5 w-3.5 text-slate-300 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {stops.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <div className="h-16 w-16 rounded-2xl bg-teal-50 flex items-center justify-center mx-auto mb-4">
            <Plane className="h-8 w-8 text-teal-400" />
          </div>
          <h3 className="text-lg font-display font-bold text-slate-700 mb-2">Start building your itinerary</h3>
          <p className="text-slate-500 text-sm mb-6">Add your first city to begin planning</p>
        </motion.div>
      )}

      {/* Timeline */}
      {stops.map((stop, stopIdx) => {
        const days = getDaysInRange(stop.arrivalDate, stop.departureDate);
        const cost = computeStopCost(stop.activities, baseCurrency, exchangeRates);

        return (
          <div key={stop.id}>
            <motion.div
              id={`stop-${stop.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stopIdx * 0.1 }}
            >
              {/* City Banner */}
              <div className="relative h-48 rounded-2xl overflow-hidden mb-6">
                {stop.coverImage ? (
                  <Image src={stop.coverImage} alt={stop.city} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-teal-500 to-emerald-600" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-5 text-white">
                  <h2 className="text-2xl font-display font-bold">{stop.city}</h2>
                  <p className="text-sm text-white/80">{stop.country}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-white/70">
                    <span>{stop.activities.length} activities</span>
                    <span>{formatCurrency(cost, baseCurrency)}</span>
                  </div>
                </div>
              </div>

              {/* Day Blocks */}
              {days.length > 0 ? (
                days.map((day, dayIdx) => {
                  const dayActivities = stop.activities.filter(
                    (a) => a.date && isSameDay(new Date(a.date), day)
                  );
                  const overallDayNum = stopIdx > 0
                    ? stops.slice(0, stopIdx).reduce((sum, s) => {
                        const d = getDaysInRange(s.arrivalDate, s.departureDate);
                        return sum + d.length;
                      }, 0) + dayIdx + 1
                    : dayIdx + 1;

                  return (
                    <div key={day.toISOString()} className="mb-6 ml-4 pl-6 border-l-2 border-teal-200 relative">
                      <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-teal-500 border-2 border-white" />
                      <h3 className="text-sm font-semibold text-slate-700 mb-3">
                        {formatDayLabel(day, overallDayNum)}
                      </h3>

                      {dayActivities.length === 0 ? (
                        <p className="text-xs text-slate-400 mb-3 italic">No activities planned</p>
                      ) : (
                        <div className="space-y-2 mb-3">
                          {dayActivities.map((activity, aIdx) => (
                            <motion.div
                              key={activity.id}
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: aIdx * 0.05 }}
                              className="group flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-100 hover:shadow-sm transition-all"
                            >
                              <span className="text-lg flex-shrink-0">
                                {CATEGORY_EMOJI_MAP[activity.category] || "📌"}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-medium text-slate-800 truncate">{activity.title}</h4>
                                  <button
                                    onClick={() => handleDeleteActivity(stop.id, activity.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded text-red-400"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                                <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                                  {activity.duration && (
                                    <span className="flex items-center gap-0.5">
                                      <Clock className="h-3 w-3" />
                                      {activity.duration >= 60
                                        ? `${Math.floor(activity.duration / 60)}h ${activity.duration % 60 ? `${activity.duration % 60}m` : ""}`
                                        : `${activity.duration}m`}
                                    </span>
                                  )}
                                  {activity.cost > 0 && (
                                    <span className="font-medium text-teal-600">
                                      {formatCurrency(activity.cost, activity.currency)}
                                    </span>
                                  )}
                                </div>
                                {activity.notes && (
                                  <p className="text-xs text-slate-400 mt-1 truncate">{activity.notes}</p>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      <button
                        onClick={() => openAddActivity(stop.id, day.toISOString())}
                        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-teal-600 transition-all"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add activity
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="mb-6 ml-4 pl-6 border-l-2 border-slate-200">
                  <p className="text-sm text-slate-400 mb-3">Set arrival & departure dates to see day blocks</p>
                  <button
                    onClick={() => openAddActivity(stop.id, null)}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-teal-600"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add activity anyway
                  </button>
                </div>
              )}
            </motion.div>

            {/* City Transition */}
            {stopIdx < stops.length - 1 && (
              <div className="flex items-center gap-3 my-8 px-4">
                <div className="flex-1 border-t-2 border-dashed border-slate-200" />
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500">{stop.city}</span>
                  <ChevronRight className="h-3 w-3 text-slate-400" />
                  <span className="text-xs text-slate-500">{stops[stopIdx + 1].city}</span>
                </div>
                <div className="flex-1 border-t-2 border-dashed border-slate-200" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
