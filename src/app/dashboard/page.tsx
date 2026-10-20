import Link from "next/link";
import AppShell from "@/components/AppShell";
import {
  FacultyRecordCard,
  ProgramRecordCard,
  ScholarRecordCard,
  SectionPanel,
} from "@/components/RecordCards";
import StatCard from "@/components/StatCard";
import { exportCsvAction, syncDashboardAction } from "@/app/actions";
import { getCounts, listFaculty, listPrograms, listScholars } from "@/lib/db";

export default function DashboardPage({
  searchParams,
}: {
  searchParams: { saved?: string };
}) {
  const counts = getCounts();
  const scholars = listScholars();
  const faculty = listFaculty();
  const programs = listPrograms();
  const saved = searchParams.saved;

  return (
    <AppShell
      title="REC data dashboard"
      subtitle="Your REC roster in one place — capture, review, and export when reporting season arrives."
      activeHref="/dashboard"
    >
      {saved ? (
        <div className="mb-6 rounded-2xl border border-emerald-200/80 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-900 shadow-sm backdrop-blur-sm">
          Saved: {saved.replace(/_/g, " ")}
        </div>
      ) : null}

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Current scholars" value={counts.current_scholars} accent="gold" />
        <StatCard label="Current trainees" value={counts.current_trainees} accent="teal" />
        <StatCard label="REC faculty" value={counts.faculty} accent="navy" />
        <StatCard label="Training programs" value={counts.programs} accent="gold" />
      </div>

      <div className="card mb-10 flex flex-wrap items-center gap-3 p-5 sm:p-6">
        <Link href="/forms/scholar" className="btn-primary">
          + Scholar / trainee
        </Link>
        <Link href="/forms/faculty" className="btn-secondary">
          + Faculty
        </Link>
        <Link href="/forms/program" className="btn-secondary">
          + Program
        </Link>
        <Link href="/reports" className="btn-ghost">
          Timeline report →
        </Link>
        <div className="ml-auto flex flex-wrap gap-2">
          <form action={exportCsvAction}>
            <button type="submit" className="btn-secondary">
              Export CSV
            </button>
          </form>
          <form action={syncDashboardAction}>
            <button type="submit" className="btn-primary">
              Rebuild roster JSON
            </button>
          </form>
        </div>
      </div>

      <SectionPanel
        title="Table 1a · Scholars & trainees"
        description="Each card is one person — project dates and mentors at a glance."
        count={scholars.length}
      >
        {scholars.map((s) => (
          <ScholarRecordCard key={s.id} s={s} />
        ))}
      </SectionPanel>

      <SectionPanel
        title="Participating REC faculty"
        description="Executive committee members marked with *"
        count={faculty.length}
      >
        {faculty.map((f) => (
          <FacultyRecordCard key={f.id} f={f} />
        ))}
      </SectionPanel>

      <SectionPanel
        title="USC training programs"
        description="ADRD and minority scholar pathways"
        count={programs.length}
      >
        {programs.map((p) => (
          <ProgramRecordCard key={p.id} p={p} />
        ))}
      </SectionPanel>
    </AppShell>
  );
}
