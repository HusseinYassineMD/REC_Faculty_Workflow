import { isStaticSite } from "@/lib/rec-data-demo";

export default function StaticSiteBanner() {
  if (!isStaticSite) return null;
  return (
    <div className="mb-6 rounded-2xl border border-amber-200/90 bg-amber-50/95 px-4 py-3 text-sm text-amber-950 shadow-sm">
      <strong>Live preview (read-only).</strong> This GitHub Pages site shows the UI and current
      demo roster. To add or edit records, clone the repo and run{" "}
      <code className="rounded bg-white/80 px-1">npm run dev</code> locally.
    </div>
  );
}
