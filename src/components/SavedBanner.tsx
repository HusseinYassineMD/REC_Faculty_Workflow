"use client";

import { useSearchParams } from "next/navigation";

export default function SavedBanner() {
  const saved = useSearchParams().get("saved");
  if (!saved) return null;
  return (
    <div className="mb-6 rounded-2xl border border-emerald-200/80 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-900 shadow-sm backdrop-blur-sm">
      Saved: {saved.replace(/_/g, " ")}
    </div>
  );
}
