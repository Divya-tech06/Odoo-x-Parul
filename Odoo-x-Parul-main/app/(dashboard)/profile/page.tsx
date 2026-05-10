"use client";

import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Calendar, Save, Loader2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch("/api/user");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const [name, setName] = useState("");
  const [initialized, setInitialized] = useState(false);

  if (profile && !initialized) {
    setName(profile.name);
    setInitialized(true);
  }

  const updateProfile = useMutation({
    mutationFn: async (data: { name: string }) => {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profile"] }),
  });

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-display font-bold text-slate-900 mb-8">Profile</h1>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center text-2xl font-display font-bold text-teal-700">
            {session?.user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h2 className="text-lg font-medium text-slate-900">{profile?.name || session?.user?.name}</h2>
            <p className="text-sm text-slate-500">{profile?.email || session?.user?.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              <User className="h-4 w-4 inline mr-1" />Name
            </label>
            <input value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              <Mail className="h-4 w-4 inline mr-1" />Email
            </label>
            <input value={profile?.email || ""} readOnly
              className="w-full px-4 py-2.5 border border-slate-100 rounded-xl bg-slate-50 text-slate-500" />
            <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
          </div>

          {profile?.createdAt && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Calendar className="h-4 w-4" />
              <span>Member since {new Date(profile.createdAt).toLocaleDateString()}</span>
            </div>
          )}

          <button onClick={() => updateProfile.mutate({ name })} disabled={updateProfile.isPending}
            className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl transition-all">
            {updateProfile.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </button>
        </div>
      </motion.div>

      {profile?.tripCount !== undefined && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <h3 className="font-medium text-slate-800 mb-2">Trip Summary</h3>
          <p className="text-3xl font-bold text-teal-600">{profile.tripCount}</p>
          <p className="text-sm text-slate-500">trips created</p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-red-100 p-6">
        <h3 className="font-medium text-red-600 mb-2">Danger Zone</h3>
        <button onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-all text-sm font-medium">
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}
