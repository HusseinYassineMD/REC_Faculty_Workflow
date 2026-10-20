import { isStaticSite } from "@/lib/rec-data-demo";

export default function StaticSiteBanner() {
  if (!isStaticSite) return null;
  return (
    <div className="mb-6 rounded-2xl border border-cpbh-gold/30 bg-gradient-to-r from-white to-cpbh-gold/5 px-4 py-3 text-sm text-slate-700 shadow-sm">
      <strong>First-draft UI preview.</strong> Browse the dashboard and open any record to see the full intake
      forms with sample data — layout and fields match what we will use for live entry.
    </div>
  );
}
