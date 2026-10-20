"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import StatCard from "@/components/StatCard";
import DownloadReportJson from "@/components/DownloadReportJson";
import { buildReportPayload } from "@/lib/report-payload-demo";

export default function ReportsPageClient() {
  const router = useRouter();
  const params = useSearchParams();
  const defaultAsOf = new Date().toISOString().slice(0, 10);
  const defaultYear = new Date().getFullYear().toString();

  const asOf = params.get("as_of") ?? defaultAsOf;
  const reportingYear = params.get("reporting_year") ?? defaultYear;

  const [draftAsOf, setDraftAsOf] = useState(asOf);
  const [draftYear, setDraftYear] = useState(reportingYear);

  const payload = useMemo(
    () => buildReportPayload(asOf, reportingYear),
    [asOf, reportingYear]
  );
  const json = useMemo(() => JSON.stringify(payload, null, 2), [payload]);

  function applyFilters(e: React.FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams();
    q.set("as_of", draftAsOf);
    q.set("reporting_year", draftYear);
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    router.push(`${base}/reports?${q.toString()}`);
  }

  return (
    <AppShell
      title="Timeline-based reports"
      subtitle="See who counts as active on a given date — built for year-end RPPR cuts."
      activeHref="/reports"
    >
      <div className="card mb-8 grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <form onSubmit={applyFilters} className="contents">
          <div className="field">
            <label htmlFor="as_of">As-of date</label>
            <input
              id="as_of"
              name="as_of"
              type="date"
              value={draftAsOf}
              onChange={(e) => setDraftAsOf(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="reporting_year">Reporting year</label>
            <input
              id="reporting_year"
              name="reporting_year"
              value={draftYear}
              onChange={(e) => setDraftYear(e.target.value)}
            />
          </div>
          <div className="flex items-end sm:col-span-2 lg:col-span-2">
            <button type="submit" className="btn-primary">
              Generate view
            </button>
          </div>
        </form>
        <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-4 lg:justify-end">
          <DownloadReportJson
            filename={`rec-report-${reportingYear}.json`}
            json={json}
          />
        </div>
      </div>

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
    </AppShell>
  );
}
