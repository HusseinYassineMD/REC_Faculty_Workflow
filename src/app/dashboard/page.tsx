import Link from "next/link";
import { Suspense } from "react";
import AppShell from "@/components/AppShell";
import SavedBanner from "@/components/SavedBanner";
import {
  FacultyRecordCard,
  ProgramRecordCard,
  ScholarRecordCard,
  SectionPanel,
} from "@/components/RecordCards";
import StatCard from "@/components/StatCard";
import { getCounts, isStaticSite, listFaculty, listPrograms, listScholars } from "@/lib/rec-data";

export default async function DashboardPage() {
  const counts = getCounts();
  const scholars = listScholars();
  const faculty = listFaculty();
  const programs = listPrograms();

  const ExportActions = !isStaticSite
    ? (await import("./DashboardExportActions")).default
    : null;

  return (
    <AppShell
      title="REC data dashboard"
      subtitle="Your REC roster in one place — capture, review, and export when reporting season arrives."
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
        {ExportActions ? <ExportActions /> : null}
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
