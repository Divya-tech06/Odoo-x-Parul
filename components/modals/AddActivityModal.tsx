"use client";

import { useUIStore } from "@/store/uiStore";
import { useTripStore } from "@/store/tripStore";
import { ACTIVITY_CATEGORIES } from "@/types/activity";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Loader2 } from "lucide-react";

export default function AddActivityModal() {
  const isOpen = useUIStore((s) => s.isAddActivityModalOpen);
  const stopId = useUIStore((s) => s.activeActivityStopId);
  const dayContext = useUIStore((s) => s.activeActivityDayContext);
  const closeAddActivity = useUIStore((s) => s.closeAddActivity);
  const addActivity = useTripStore((s) => s.addActivity);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("sightseeing");
  const [cost, setCost] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setTitle(""); setCategory("sightseeing"); setCost(""); setCurrency("INR");
    setDuration(""); setNotes("");
  };

  const handleSubmit = async () => {
    if (!title.trim() || !stopId) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/stops/${stopId}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          category,
          cost: parseFloat(cost) || 0,
          currency,
          duration: parseInt(duration) || undefined,
          date: dayContext || undefined,
          notes: notes.trim() || undefined,
        }),
      });

      if (res.ok) {
        const activity = await res.json();
        addActivity(stopId, activity);
        closeAddActivity();
        resetForm();
      }
    } catch { /* error */ }
    setSaving(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={() => { closeAddActivity(); resetForm(); }}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      />
      <motion.div initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }} animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }} exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
        className="fixed z-50 top-1/2 left-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-display font-bold">Add Activity</h3>
          <button onClick={() => { closeAddActivity(); resetForm(); }} className="p-1 hover:bg-slate-100 rounded-lg">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Title *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Visit the Eiffel Tower" />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Category</label>
            <div className="flex flex-wrap gap-1.5">
              {ACTIVITY_CATEGORIES.map((c) => (
                <button key={c.value} onClick={() => setCategory(c.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    category === c.value ? "bg-teal-100 text-teal-700 ring-1 ring-teal-300" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Cost</label>
              <div className="flex">
                <input value={cost} onChange={(e) => setCost(e.target.value)} type="number" min="0" step="0.01"
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-l-xl text-sm outline-none focus:ring-1 focus:ring-teal-500" placeholder="0" />
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}
                  className="px-2 py-2 border border-l-0 border-slate-200 rounded-r-xl text-xs bg-slate-50 outline-none">
                  {["USD", "EUR", "GBP", "INR", "JPY", "SGD", "THB"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Duration (min)</label>
              <input value={duration} onChange={(e) => setDuration(e.target.value)} type="number" min="0"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-teal-500" placeholder="120" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-teal-500 resize-none"
              placeholder="Book tickets in advance..." />
          </div>

          <button onClick={handleSubmit} disabled={!title.trim() || saving}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? "Adding..." : "Add Activity"}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
