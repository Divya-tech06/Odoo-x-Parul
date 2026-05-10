"use client";

import { useSession } from "next-auth/react";
import { useTrips } from "@/lib/hooks/useTrip";
import { useUIStore } from "@/store/uiStore";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import {
  Plus, MapPin, Calendar, Plane as PlaneIcon,
  Globe, TrendingUp, Sparkles,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency";
import { getTripStatus, formatDateRange } from "@/lib/utils/dates";
import { getInspirationDestinations } from "@/lib/data/fallbackImages";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data: trips, isLoading } = useTrips();
  const { openCreateTrip } = useUIStore();
  const inspirations = getInspirationDestinations();

  // Stats
  const totalTrips = trips?.length || 0;
  const upcomingTrips = trips?.filter((t) => getTripStatus(t.startDate, t.endDate) === "upcoming").length || 0;
  const totalCities = trips?.reduce((sum, t) => sum + (t.stops?.length || 0), 0) || 0;
  const totalBudget = trips?.reduce((sum, t) => {
    const actCost = t.stops?.flatMap((s) => s.activities || []).reduce((a, b) => a + b.cost, 0) || 0;
    const expCost = t.expenses?.reduce((a, b) => a + b.amount, 0) || 0;
    return sum + actCost + expCost;
  }, 0) || 0;

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      upcoming: "bg-amber-50 text-amber-700 border-amber-200",
      ongoing: "bg-green-50 text-green-700 border-green-200",
      completed: "bg-slate-100 text-slate-600 border-slate-200",
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${styles[status] || styles.upcoming}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Welcome Hero */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">
            Welcome back, {session?.user?.name?.split(" ")[0] || "Traveler"} 👋
          </h1>
          <p className="text-slate-500 mt-1">
            {format(new Date(), "EEEE, MMMM d, yyyy")} — Let&apos;s plan something amazing
          </p>
        </div>
        <button
          onClick={openCreateTrip}
          className="flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="h-5 w-5" />
          Plan New Trip
        </button>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: "Total Trips", value: totalTrips, icon: PlaneIcon, color: "text-teal-600 bg-teal-50" },
          { label: "Upcoming", value: upcomingTrips, icon: Calendar, color: "text-amber-600 bg-amber-50" },
          { label: "Cities Planned", value: totalCities, icon: Globe, color: "text-blue-600 bg-blue-50" },
          { label: "Total Budget", value: formatCurrency(totalBudget), icon: TrendingUp, color: "text-green-600 bg-green-50" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all"
          >
            <div className={`h-10 w-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* My Trips */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-bold text-slate-900">My Trips</h2>
          {totalTrips > 0 && (
            <Link href="/trips" className="text-sm text-teal-600 hover:text-teal-700 font-medium">
              View all →
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-72 animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : totalTrips === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-2xl border border-slate-200"
          >
            <MapPin className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-700 mb-2">No trips yet</h3>
            <p className="text-slate-500 mb-6">Start by planning your first adventure</p>
            <button
              onClick={openCreateTrip}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium transition-all"
            >
              Plan Your First Trip
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {trips?.slice(0, 6).map((trip, i) => {
              const status = getTripStatus(trip.startDate, trip.endDate);
              const stopCount = trip.stops?.length || 0;
              const totalCost =
                (trip.stops?.flatMap((s) => s.activities || []).reduce((a, b) => a + b.cost, 0) || 0) +
                (trip.expenses?.reduce((a, b) => a + b.amount, 0) || 0);

              return (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/trip/${trip.id}`}>
                    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
                      {/* Cover */}
                      <div className="relative h-40 overflow-hidden">
                        {trip.coverImage ? (
                          <Image
                            src={trip.coverImage}
                            alt={trip.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-teal-400 to-teal-600" />
                        )}
                        <div className="absolute inset-0 gradient-overlay" />
                        <div className="absolute top-3 right-3">
                          {statusBadge(status)}
                        </div>
                        <div className="absolute bottom-3 left-3 text-white">
                          <h3 className="text-lg font-display font-bold">{trip.title}</h3>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDateRange(trip.startDate, trip.endDate)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-sm text-slate-500">
                            <MapPin className="h-3.5 w-3.5" />
                            {stopCount} {stopCount === 1 ? "city" : "cities"}
                          </span>
                          <span className="text-sm font-medium text-teal-600">
                            {formatCurrency(totalCost)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Destination Inspiration */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-amber-500" />
          <h2 className="text-xl font-display font-bold text-slate-900">Destination Inspiration</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {inspirations.map((dest) => (
            <motion.button
              key={dest.city}
              whileHover={{ scale: 1.03 }}
              onClick={() => {
                openCreateTrip();
              }}
              className="relative rounded-2xl overflow-hidden aspect-[3/4] group"
            >
              <Image
                src={dest.image}
                alt={dest.city}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-3 text-white text-left">
                <p className="font-display font-bold text-sm">{dest.city}</p>
                <p className="text-xs text-white/70">{dest.country}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
