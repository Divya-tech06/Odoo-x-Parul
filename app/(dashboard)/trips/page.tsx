"use client";

import { useTrips, useDeleteTrip } from "@/lib/hooks/useTrip";
import { useUIStore } from "@/store/uiStore";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, Trash2, Plus } from "lucide-react";
import { formatDateRange, getTripStatus } from "@/lib/utils/dates";
import { formatCurrency } from "@/lib/utils/currency";

export default function TripsPage() {
  const { data: trips, isLoading } = useTrips();
  const deleteTrip = useDeleteTrip();
  const openCreateTrip = useUIStore((s) => s.openCreateTrip);

  const handleDelete = (tripId: string) => {
    if (confirm("Delete this trip permanently?")) {
      deleteTrip.mutate(tripId);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-slate-900">My Trips</h1>
        <button onClick={openCreateTrip} className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-xl transition-all">
          <Plus className="h-4 w-4" /> New Trip
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => <div key={i} className="h-64 bg-white rounded-2xl animate-pulse" />)}
        </div>
      ) : !trips?.length ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <MapPin className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-700 mb-2">No trips yet</h3>
          <button onClick={openCreateTrip} className="px-6 py-2.5 bg-teal-600 text-white rounded-xl font-medium mt-2">
            Create Your First Trip
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trips.map((trip, i) => {
            const status = getTripStatus(trip.startDate, trip.endDate);
            const totalCost = (trip.stops?.flatMap((s) => s.activities || []).reduce((a, b) => a + b.cost, 0) || 0) + (trip.expenses?.reduce((a, b) => a + b.amount, 0) || 0);
            return (
              <motion.div key={trip.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all">
                  <Link href={`/trip/${trip.id}`}>
                    <div className="relative h-40 overflow-hidden">
                      {trip.coverImage ? <Image src={trip.coverImage} alt={trip.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full bg-gradient-to-br from-teal-400 to-teal-600" />}
                      <div className="absolute inset-0 gradient-overlay" />
                      <div className="absolute bottom-3 left-3 text-white">
                        <h3 className="text-lg font-display font-bold">{trip.title}</h3>
                      </div>
                    </div>
                  </Link>
                  <div className="p-4">
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-2">
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDateRange(trip.startDate, trip.endDate)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500"><MapPin className="h-3.5 w-3.5 inline mr-1" />{trip.stops?.length || 0} cities</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-teal-600">{formatCurrency(totalCost)}</span>
                        <button onClick={() => handleDelete(trip.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
