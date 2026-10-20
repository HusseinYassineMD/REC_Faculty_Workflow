import { isStaticSite } from "@/lib/rec-data-demo";

export default function StaticSiteBanner() {
  if (!isStaticSite) return null;
  return (
    <div className="mb-6 rounded-2xl border border-slate-200/90 bg-white/95 px-4 py-3 text-sm text-slate-700 shadow-sm">
      <strong>Draft preview.</strong> Forms here are placeholders; the dashboard and reports use demo roster
      data. Full editing runs locally with <code className="rounded bg-slate-100 px-1">npm run dev</code>.
    </div>
  );
}
