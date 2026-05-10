"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Plane, MapPin, Calendar, DollarSign, Loader2, Lock } from "lucide-react";
import { formatDateRange, getDaysInRange, formatDayLabel } from "@/lib/utils/dates";
import { formatCurrency } from "@/lib/utils/currency";
import { CATEGORY_EMOJI_MAP } from "@/types/activity";
import { isSameDay } from "date-fns";

export default function SharePage() {
  const params = useParams();
  const shareToken = params.shareToken as string;

  const { data: trip, isLoading, error } = useQuery({
    queryKey: ["share", shareToken],
    queryFn: async () => {
      const res = await fetch(`/api/share/${shareToken}`);
      if (!res.ok) throw new Error("Not found");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md px-6">
          <Lock className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h1 className="text-2xl font-display font-bold text-slate-800 mb-2">This itinerary is private</h1>
          <p className="text-slate-500 mb-6">This trip doesn&apos;t exist or the owner has made it private.</p>
          <Link href="/signup" className="px-6 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-all">
            Plan Your Own Trip →
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plane className="h-5 w-5 text-teal-600" />
            <span className="font-display font-bold text-teal-600">Traveloop</span>
          </div>
          <span className="text-xs px-3 py-1 bg-teal-50 text-teal-600 rounded-full font-medium">Shared Itinerary</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative h-64 rounded-2xl overflow-hidden mb-8">
          {trip.coverImage ? (
            <Image src={trip.coverImage} alt={trip.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-teal-500 to-teal-700" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="text-3xl font-display font-bold mb-1">{trip.title}</h1>
            {trip.description && <p className="text-sm text-white/80 max-w-lg">{trip.description}</p>}
            <div className="flex items-center gap-4 mt-3 text-sm text-white/70">
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{formatDateRange(trip.startDate, trip.endDate)}</span>
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{trip.stops?.length || 0} cities</span>
              <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" />{formatCurrency(trip.totalCost || 0)}</span>
            </div>
          </div>
        </motion.div>

        {/* Route pills */}
        {trip.stops?.length > 0 && (
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            {trip.stops.map((stop: Record<string, unknown>, i: number) => (
              <div key={String(stop.id)} className="flex items-center gap-2 flex-shrink-0">
                <span className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-700">{String(stop.city)}</span>
                {i < trip.stops.length - 1 && <Plane className="h-3.5 w-3.5 text-slate-300" />}
              </div>
            ))}
          </div>
        )}

        {/* Timeline (read-only) */}
        {trip.stops?.map((stop: Record<string, unknown>, stopIdx: number) => {
          const activities = (stop.activities || []) as Record<string, unknown>[];
          const days = getDaysInRange(stop.arrivalDate as string, stop.departureDate as string);

          return (
            <motion.div key={String(stop.id)} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: stopIdx * 0.1 }}>
              <div className="relative h-44 rounded-2xl overflow-hidden mb-6">
                {stop.coverImage ? (
                  <Image src={String(stop.coverImage)} alt={String(stop.city)} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-teal-500 to-emerald-600" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-5 text-white">
                  <h2 className="text-xl font-display font-bold">{String(stop.city)}</h2>
                  <p className="text-sm text-white/80">{String(stop.country)}</p>
                </div>
              </div>

              {days.map((day, dayIdx) => {
                const dayActs = activities.filter((a) => a.date && isSameDay(new Date(String(a.date)), day));
                return (
                  <div key={day.toISOString()} className="mb-4 ml-4 pl-6 border-l-2 border-teal-200 relative">
                    <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-teal-500 border-2 border-white" />
                    <h3 className="text-sm font-semibold text-slate-700 mb-2">{formatDayLabel(day, dayIdx + 1)}</h3>
                    {dayActs.map((act) => (
                      <div key={String(act.id)} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-100 mb-2">
                        <span className="text-lg">{CATEGORY_EMOJI_MAP[String(act.category)] || "📌"}</span>
                        <div>
                          <h4 className="text-sm font-medium text-slate-800">{String(act.title)}</h4>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                            {Number(act.cost) > 0 && <span className="text-teal-600 font-medium">{formatCurrency(Number(act.cost), String(act.currency))}</span>}
                            {act.notes ? <span>• {String(act.notes)}</span> : null}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}

              {stopIdx < trip.stops.length - 1 && (
                <div className="flex items-center gap-3 my-6 px-4">
                  <div className="flex-1 border-t-2 border-dashed border-slate-200" />
                  <Plane className="h-4 w-4 text-slate-300" />
                  <div className="flex-1 border-t-2 border-dashed border-slate-200" />
                </div>
              )}
            </motion.div>
          );
        })}

        {/* CTA */}
        <div className="text-center mt-12 p-8 bg-white rounded-2xl border border-slate-200">
          <h3 className="text-lg font-display font-bold text-slate-800 mb-2">Inspired? Plan your own trip!</h3>
          <p className="text-slate-500 text-sm mb-4">Join Traveloop and start creating beautiful itineraries</p>
          <Link href="/signup" className="px-8 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-all inline-block">
            Plan Your Own Trip →
          </Link>
        </div>
      </div>
    </div>
  );
}
