"use client";

import { useUIStore } from "@/store/uiStore";
import { useCreateTrip } from "@/lib/hooks/useTrip";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2 } from "lucide-react";

const createTripSchema = z.object({
  title: z.string().min(1, "Trip title is required").max(100),
  description: z.string().max(500).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type CreateTripForm = z.infer<typeof createTripSchema>;

export default function CreateTripModal() {
  const isOpen = useUIStore((s) => s.isCreateTripModalOpen);
  const closeCreateTrip = useUIStore((s) => s.closeCreateTrip);
  const createTrip = useCreateTrip();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTripForm>({
    resolver: zodResolver(createTripSchema),
  });

  const onCreateTrip = async (data: CreateTripForm) => {
    try {
      const trip = await createTrip.mutateAsync({
        title: data.title,
        description: data.description,
        startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
        endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
      });
      closeCreateTrip();
      reset();
      router.push(`/trip/${trip.id}`);
    } catch {
      // error handled by mutation
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeCreateTrip}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
        animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
        exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
        className="fixed z-50 top-1/2 left-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-display font-bold">Plan a New Trip</h3>
          <button onClick={closeCreateTrip} className="p-1 hover:bg-slate-100 rounded-lg">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onCreateTrip)} className="space-y-4">
          <div>
            <label htmlFor="trip-title" className="block text-sm font-medium text-slate-700 mb-1.5">
              Trip Title *
            </label>
            <input
              id="trip-title"
              {...register("title")}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              placeholder="European Summer 2025"
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div>
            <label htmlFor="trip-desc" className="block text-sm font-medium text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              id="trip-desc"
              {...register("description")}
              rows={3}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
              placeholder="A brief description of your trip..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="trip-start" className="block text-sm font-medium text-slate-700 mb-1.5">
                Start Date
              </label>
              <input
                id="trip-start"
                type="date"
                {...register("startDate")}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label htmlFor="trip-end" className="block text-sm font-medium text-slate-700 mb-1.5">
                End Date
              </label>
              <input
                id="trip-end"
                type="date"
                {...register("endDate")}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={createTrip.isPending}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {createTrip.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {createTrip.isPending ? "Creating..." : "Create Trip"}
          </button>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}
