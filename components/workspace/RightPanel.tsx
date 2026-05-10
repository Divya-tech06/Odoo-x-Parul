"use client";

import { useUIStore } from "@/store/uiStore";
import { useBudgetStore } from "@/store/budgetStore";
import { useTripStore } from "@/store/tripStore";
import { useBudget } from "@/lib/hooks/useBudget";
import { useWeather } from "@/lib/hooks/useWeather";
import { EXPENSE_CATEGORIES } from "@/types/expense";
import { SUGGESTED_ACTIVITIES } from "@/lib/data/suggestedActivities";
import { SUPPORTED_CURRENCIES } from "@/lib/utils/currency";
import { formatCurrency } from "@/lib/utils/currency";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Lightbulb, DollarSign, Cloud, StickyNote, Plus, Loader2,
  Trash2, Droplets, Wind, Thermometer,
} from "lucide-react";

export default function RightPanel({ tripId }: { tripId: string }) {
  const tab = useUIStore((s) => s.rightPanelTab);
  const setTab = useUIStore((s) => s.setRightPanelTab);

  const tabs = [
    { key: "activities" as const, label: "Ideas", icon: Lightbulb },
    { key: "budget" as const, label: "Budget", icon: DollarSign },
    { key: "weather" as const, label: "Weather", icon: Cloud },
    { key: "notes" as const, label: "Notes", icon: StickyNote },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-slate-100 px-2 pt-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 flex flex-col items-center py-2.5 text-xs font-medium rounded-t-lg transition-all ${
              tab === t.key ? "text-teal-600 bg-teal-50/50 border-b-2 border-teal-500" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <t.icon className="h-4 w-4 mb-0.5" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        {tab === "activities" && <SuggestedActivitiesTab />}
        {tab === "budget" && <BudgetTab tripId={tripId} />}
        {tab === "weather" && <WeatherTab />}
        {tab === "notes" && <NotesTab tripId={tripId} />}
      </div>
    </div>
  );
}

function SuggestedActivitiesTab() {
  const openAddActivity = useUIStore((s) => s.openAddActivity);
  const stops = useTripStore((s) => s.stops);
  const selectedStopId = useUIStore((s) => s.selectedStopId);
  const currentStopId = selectedStopId || stops[0]?.id;

  const categories = [...new Set(SUGGESTED_ACTIVITIES.map((a) => a.category))];
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all"
    ? SUGGESTED_ACTIVITIES
    : SUGGESTED_ACTIVITIES.filter((a) => a.category === filter);

  return (
    <div className="space-y-4">
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        <button onClick={() => setFilter("all")} className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${filter === "all" ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-500"}`}>
          All
        </button>
        {categories.map((c) => (
          <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1 rounded-full text-xs font-medium capitalize whitespace-nowrap ${filter === c ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-500"}`}>
            {c}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {filtered.slice(0, 12).map((act) => (
          <div key={act.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all">
            <span className="text-lg">{act.emoji}</span>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-slate-700">{act.title}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{act.description}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                <span>{formatCurrency(act.estimatedCost)}</span>
                <span>•</span>
                <span>{act.duration}min</span>
              </div>
            </div>
            {currentStopId && (
              <button
                onClick={() => openAddActivity(currentStopId, null)}
                className="p-1.5 hover:bg-teal-100 rounded-lg text-teal-500 transition-all flex-shrink-0"
              >
                <Plus className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function BudgetTab({ tripId }: { tripId: string }) {
  const { totalCost, budgetByCategory, perDayAverage, remaining, baseCurrency, fetchExchangeRates, budgetTarget } = useBudget();

  const maxCat = Math.max(...Object.values(budgetByCategory), 1);
  const total = Object.values(budgetByCategory).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Total */}
      <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl">
        <p className="text-xs text-slate-500 mb-1">Total Spent</p>
        <p className="text-3xl font-bold text-slate-900">{formatCurrency(totalCost, baseCurrency)}</p>
        {budgetTarget && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Budget</span>
              <span>{formatCurrency(budgetTarget, baseCurrency)}</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((totalCost / budgetTarget) * 100, 100)}%` }}
                className={`h-full rounded-full ${totalCost > budgetTarget ? "bg-red-500" : "bg-teal-500"}`}
              />
            </div>
            {remaining !== null && (
              <p className={`text-xs mt-1 font-medium ${remaining < 0 ? "text-red-500" : "text-green-600"}`}>
                {remaining >= 0 ? `${formatCurrency(remaining, baseCurrency)} remaining` : `${formatCurrency(Math.abs(remaining), baseCurrency)} over budget`}
              </p>
            )}
          </div>
        )}
        <p className="text-xs text-slate-400 mt-2">{formatCurrency(perDayAverage, baseCurrency)}/day avg</p>
      </div>

      {/* Currency Selector */}
      <div>
        <label className="text-xs font-medium text-slate-500 mb-1 block">Display Currency</label>
        <select
          value={baseCurrency}
          onChange={(e) => fetchExchangeRates(e.target.value)}
          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-teal-500"
        >
          {SUPPORTED_CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>{c.symbol} {c.code} — {c.name}</option>
          ))}
        </select>
      </div>

      {/* Category Breakdown */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-slate-700">Breakdown</h4>
        {EXPENSE_CATEGORIES.map((cat) => {
          const amount = budgetByCategory[cat.value as keyof typeof budgetByCategory] || 0;
          const pct = total > 0 ? (amount / total) * 100 : 0;
          return (
            <div key={cat.value}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600">{cat.label}</span>
                <span className="font-medium text-slate-700">{formatCurrency(amount, baseCurrency)}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  style={{ backgroundColor: cat.color }}
                  className="h-full rounded-full"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeatherTab() {
  const stops = useTripStore((s) => s.stops);

  if (stops.length === 0) {
    return <p className="text-center text-sm text-slate-400 py-10">Add cities to see weather data</p>;
  }

  return (
    <div className="space-y-4">
      {stops.map((stop) => (
        <WeatherCard key={stop.id} city={stop.city} lat={stop.latitude} lon={stop.longitude} />
      ))}
    </div>
  );
}

function WeatherCard({ city, lat, lon }: { city: string; lat?: number | null; lon?: number | null }) {
  const { data, isLoading } = useWeather(city, lat, lon);

  if (isLoading) return <div className="h-24 bg-slate-100 rounded-xl animate-pulse" />;
  if (!data) return null;

  return (
    <div className="p-4 bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl">
      <h4 className="text-sm font-medium text-slate-700 mb-2">{city}</h4>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-3xl font-bold text-slate-900">{data.current.temp}°C</p>
          <p className="text-xs text-slate-500 capitalize">{data.current.description}</p>
        </div>
        <div className="text-right text-xs text-slate-500 space-y-1">
          <p className="flex items-center gap-1 justify-end"><Droplets className="h-3 w-3" />{data.current.humidity}%</p>
          <p className="flex items-center gap-1 justify-end"><Wind className="h-3 w-3" />{data.current.windSpeed} km/h</p>
        </div>
      </div>
      {data.forecast.length > 0 && (
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {data.forecast.slice(0, 5).map((f) => (
            <div key={f.date} className="text-center flex-shrink-0 px-2">
              <p className="text-xs text-slate-400">{f.date.slice(5)}</p>
              <p className="text-sm font-medium text-slate-700">{f.temp}°</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NotesTab({ tripId }: { tripId: string }) {
  const notes = useTripStore((s) => s.notes);
  const addNote = useTripStore((s) => s.addNote);
  const removeNote = useTripStore((s) => s.removeNote);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });
      if (res.ok) {
        const note = await res.json();
        addNote(note);
        setContent("");
      }
    } catch { /* error */ }
    setSaving(false);
  };

  const handleDelete = async (noteId: string) => {
    removeNote(noteId);
    await fetch(`/api/trips/${tripId}/notes/${noteId}`, { method: "DELETE" });
  };

  return (
    <div className="space-y-4">
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-teal-500 resize-none"
          placeholder="Write a note..."
        />
        <button
          onClick={handleSave}
          disabled={saving || !content.trim()}
          className="mt-2 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 disabled:opacity-50 transition-all flex items-center gap-1"
        >
          {saving && <Loader2 className="h-3 w-3 animate-spin" />}
          Save Note
        </button>
      </div>

      {notes.length === 0 ? (
        <p className="text-center text-sm text-slate-400 py-6">Start writing your travel journal...</p>
      ) : (
        <div className="space-y-2">
          {notes.map((note) => (
            <div key={note.id} className="group p-3 bg-slate-50 rounded-xl">
              <div className="flex justify-between items-start">
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{note.content}</p>
                <button onClick={() => handleDelete(note.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded text-red-400">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {new Date(note.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
