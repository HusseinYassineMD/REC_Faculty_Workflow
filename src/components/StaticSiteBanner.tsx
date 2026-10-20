import { isStaticSite } from "@/lib/rec-data-demo";

export default function StaticSiteBanner() {
  if (!isStaticSite) return null;
  const sha = process.env.NEXT_PUBLIC_DEPLOY_SHA?.slice(0, 7);
  return (
    <div className="mb-6 rounded-2xl border border-cpbh-gold/25 bg-white/95 px-5 py-4 text-sm leading-relaxed text-slate-700 shadow-sm ring-1 ring-cpbh-gold/10">
      <p className="font-display text-base font-semibold text-cpbh-navy">REC workflow — design preview</p>
      <p className="mt-1 text-slate-600">
        This is the interface we are aligning on for scholars, faculty, programs, and RPPR reporting. Sample
        roster data is shown throughout; saving and exports will connect to the database in the next phase.
      </p>
      {sha ? (
        <p className="mt-2 text-xs text-slate-400">
          Live site build <span className="font-mono text-slate-500">{sha}</span> — if forms look outdated,
          hard-refresh (Cmd+Shift+R).
        </p>
      ) : null}
    </div>
  );
}
