"use client";

import { useUIStore } from "@/store/uiStore";
import { useTripStore } from "@/store/tripStore";
import { useCitySearch } from "@/lib/hooks/useCitySearch";
import { getFallbackImage } from "@/lib/data/fallbackImages";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Search, MapPin, Loader2 } from "lucide-react";
import type { CitySearchResult } from "@/types/api";

export default function AddCityModal({ tripId }: { tripId: string }) {
  const isOpen = useUIStore((s) => s.isAddCityModalOpen);
  const closeAddCity = useUIStore((s) => s.closeAddCity);
  const addStop = useTripStore((s) => s.addStop);
  const stops = useTripStore((s) => s.stops);

  const [query, setQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<CitySearchResult | null>(null);
  const [arrivalDate, setArrivalDate] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [saving, setSaving] = useState(false);

  const { data: cities, isLoading: searching } = useCitySearch(query);

  const handleSelect = (city: CitySearchResult) => {
    setSelectedCity(city);
    setQuery(city.name);
  };

  const handleSubmit = async () => {
    if (!selectedCity) return;
    setSaving(true);

    const coverImage = getFallbackImage(selectedCity.name);

    try {
      const res = await fetch(`/api/trips/${tripId}/stops`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: selectedCity.name,
          country: selectedCity.country,
          countryCode: selectedCity.countryCode,
          latitude: selectedCity.latitude,
          longitude: selectedCity.longitude,
          arrivalDate: arrivalDate ? new Date(arrivalDate).toISOString() : undefined,
          departureDate: departureDate ? new Date(departureDate).toISOString() : undefined,
          coverImage,
          orderIndex: stops.length,
        }),
      });

      if (res.ok) {
        const stop = await res.json();
        addStop(stop);
        closeAddCity();
        resetForm();
      }
    } catch { /* error */ }
    setSaving(false);
  };

  const resetForm = () => {
    setQuery("");
    setSelectedCity(null);
    setArrivalDate("");
    setDepartureDate("");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => { closeAddCity(); resetForm(); }}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
        animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
        exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
        className="fixed z-50 top-1/2 left-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-display font-bold">Add City</h3>
          <button onClick={() => { closeAddCity(); resetForm(); }} className="p-1 hover:bg-slate-100 rounded-lg">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* City Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedCity(null); }}
            className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Search cities..."
          />
          {searching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-slate-400" />}

          {/* Dropdown */}
          {cities && cities.length > 0 && !selectedCity && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
              {cities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleSelect(city)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-left transition-all"
                >
                  <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">{city.name}</p>
                    <p className="text-xs text-slate-400">{city.country}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedCity && (
          <div className="p-3 bg-teal-50 rounded-xl mb-4 text-sm">
            <p className="font-medium text-teal-700">{selectedCity.name}, {selectedCity.country}</p>
            <p className="text-xs text-teal-500">
              {selectedCity.latitude.toFixed(2)}°, {selectedCity.longitude.toFixed(2)}°
            </p>
          </div>
        )}

        {/* Date Pickers */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Arrival</label>
            <input
              type="date"
              value={arrivalDate}
              onChange={(e) => setArrivalDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Departure</label>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedCity || saving}
          className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? "Adding..." : "Add City"}
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
