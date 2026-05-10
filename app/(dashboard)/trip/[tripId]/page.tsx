"use client";

import { useTrip } from "@/lib/hooks/useTrip";
import { useBudget } from "@/lib/hooks/useBudget";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import WorkspaceLayout from "@/components/workspace/WorkspaceLayout";

export default function TripWorkspacePage() {
  const params = useParams();
  const tripId = params.tripId as string;
  const { isLoading, error } = useTrip(tripId);
  useBudget();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-slate-500">Loading your trip...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-display font-bold text-slate-800 mb-2">Trip not found</h2>
          <p className="text-slate-500">This trip may have been deleted or you don&apos;t have access.</p>
        </div>
      </div>
    );
  }

  return <WorkspaceLayout tripId={tripId} />;
}
