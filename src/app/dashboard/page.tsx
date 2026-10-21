import Link from "next/link";
import { Suspense } from "react";
import AppShell from "@/components/AppShell";
import SavedBanner from "@/components/SavedBanner";
import StatCard from "@/components/StatCard";
import { getCounts } from "@/lib/rec-data";
import { isStaticSite } from "@/lib/rec-data-demo";
import DashboardDemoActions from "./DashboardDemoActions";

export default async function DashboardPage() {
  const counts = getCounts();
  const ExportActions =
    !isStaticSite ? (await import("./DashboardExportActions")).default : null;

  const views = [
    { href: "/scholars", label: "Scholars view", desc: "Table G1 sort · export CSV" },
    { href: "/faculty", label: "Faculty view", desc: "Participating mentors · export CSV" },
    { href: "/programs", label: "Programs view", desc: "Training programs · export CSV" },
    { href: "/rppr", label: "RPPR (G1 & G2)", desc: "NACC tables · export PDF" },
  ];

  return (
    <AppShell
      title="REC dashboard"
      subtitle="Summary metrics and intake — open each view tab to browse tables and export."
      activeHref="/dashboard"
    >
      <Suspense fallback={null}>
        <SavedBanner />
      </Suspense>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Current scholars" value={counts.current_scholars} accent="gold" />
        <StatCard label="Current trainees" value={counts.current_trainees} accent="teal" />
        <StatCard label="REC faculty" value={counts.faculty} accent="navy" />
        <StatCard label="Training programs" value={counts.programs} accent="gold" />
      </div>

      <div className="card mb-8 p-6">
        <h2 className="font-display text-lg font-bold text-cpbh-navy">Intake forms (G1 & G2 fields)</h2>
        <p className="mt-1 text-sm text-slate-600">
          Capture data once — RPPR Table G1 and G2 exports are generated from these records.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/forms/scholar" className="btn-primary">
            + Scholar / trainee
          </Link>
          <Link href="/forms/faculty" className="btn-secondary">
            + Faculty
          </Link>
          <Link href="/forms/program" className="btn-secondary">
            + Program
          </Link>
          {isStaticSite ? <DashboardDemoActions /> : ExportActions ? <ExportActions /> : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {views.map((v) => (
          <Link key={v.href} href={v.href} className="card-elevated block p-5">
            <h3 className="font-display text-lg font-semibold text-cpbh-navy">{v.label}</h3>
            <p className="mt-1 text-sm text-slate-600">{v.desc}</p>
            <span className="mt-3 inline-block text-sm font-semibold text-cpbh-teal">Open view →</span>
          </Link>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        <Link href="/reports" className="font-medium text-cpbh-navy hover:underline">
          Timeline reports
        </Link>{" "}
        (as-of active counts) ·{" "}
        <a
          href="https://www.naccdata.org/progress-reports-to-nia/"
          className="font-medium text-cpbh-navy hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          NACC RPPR reference
        </a>
      </p>
    </AppShell>
  );
}
