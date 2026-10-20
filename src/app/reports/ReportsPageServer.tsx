import AppShell from "@/components/AppShell";
import StatCard from "@/components/StatCard";
import DownloadReportJson from "@/components/DownloadReportJson";
import { buildReportPayload } from "@/lib/rppr-export";

export default async function ReportsPageServer({
  searchParams,
}: {
  searchParams: { as_of?: string; reporting_year?: string; saved?: string };
}) {
  const asOf = searchParams.as_of ?? new Date().toISOString().slice(0, 10);
  const reportingYear =
    searchParams.reporting_year ?? new Date().getFullYear().toString();
  const payload = buildReportPayload(asOf, reportingYear);

  const SaveActions = (await import("./ReportSaveActions")).default;

  return (
    <AppShell
      title="Timeline-based reports"
      subtitle="See who counts as active on a given date — built for year-end RPPR cuts."
      activeHref="/reports"
    >
      {searchParams.saved ? (
        <div className="mb-6 rounded-2xl border border-emerald-200/80 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-900">
          Snapshot saved for reporting year {reportingYear}.
        </div>
      ) : null}

      <div className="card mb-8 grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <form method="get" className="contents">
          <div className="field">
            <label htmlFor="as_of">As-of date</label>
            <input id="as_of" name="as_of" type="date" defaultValue={asOf} />
          </div>
          <div className="field">
            <label htmlFor="reporting_year">Reporting year</label>
            <input id="reporting_year" name="reporting_year" defaultValue={reportingYear} />
          </div>
          <div className="flex items-end sm:col-span-2 lg:col-span-2">
            <button type="submit" className="btn-primary">
              Generate view
            </button>
          </div>
        </form>
        <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-4 lg:justify-end">
          <SaveActions asOf={asOf} reportingYear={reportingYear} />
        </div>
      </div>

      <ReportsBody payload={payload} />
    </AppShell>
  );
}

function ReportsBody({ payload }: { payload: ReturnType<typeof buildReportPayload> }) {
  return (
    <>
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Active as-of" value={payload.summary.activeScholarsTrainees} accent="teal" />
        <StatCard label="Total listed" value={payload.summary.totalListed} accent="navy" />
        <StatCard label="Faculty" value={payload.summary.faculty} accent="gold" />
        <StatCard label="Programs" value={payload.summary.programs} accent="gold" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {payload.table1a.map((r) => (
          <article
            key={r.id}
            className={`record-card ${r.activeAsOf ? "ring-1 ring-cpbh-teal/30" : "opacity-75"}`}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-lg font-semibold">{r.name}</h3>
              <span className={r.activeAsOf ? "pill-teal" : "pill-navy"}>
                {r.activeAsOf ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-sm text-slate-600">
              {r.currentOrPast} · {r.scholarOrTrainee}
              {r.department ? ` · ${r.department}` : ""}
            </p>
            <p className="line-clamp-2 text-sm text-slate-500">
              {r.projectTitle || r.researchArea}
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="rounded-lg bg-slate-50 px-2 py-1">
                Grant: {r.grantTimeline.start || "?"} → {r.grantTimeline.end || "?"}
              </span>
              {r.budget.annual != null ? (
                <span className="rounded-lg bg-cpbh-gold/15 px-2 py-1 font-semibold text-cpbh-navy">
                  ${Number(r.budget.annual).toLocaleString()} / yr
                </span>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
