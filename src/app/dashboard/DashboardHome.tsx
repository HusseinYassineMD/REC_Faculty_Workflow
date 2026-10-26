import Link from "next/link";
import AppShell from "@/components/AppShell";
import StatCard from "@/components/StatCard";
import { listFaculty, listPrograms, listScholars } from "@/lib/rec-data";
import type { FacultyRow, ProgramRow, ScholarRow } from "@/lib/types";

function isCurrent(value: string) {
  return value.toLowerCase().startsWith("current");
}

function byLastName<T extends { last_name: string; current_or_past?: string }>(a: T, b: T) {
  const status =
    Number(isCurrent(b.current_or_past ?? "")) - Number(isCurrent(a.current_or_past ?? ""));
  if (status !== 0) return status;
  return a.last_name.localeCompare(b.last_name, undefined, { sensitivity: "base" });
}

function NameBox({
  title,
  detail,
  pill,
}: {
  title: string;
  detail?: string | null;
  pill?: string;
}) {
  return (
    <article className="record-card">
      <h3 className="font-display text-lg font-semibold text-cpbh-navy">{title}</h3>
      {pill ? <span className="pill-teal w-fit">{pill}</span> : null}
      {detail ? <p className="text-sm text-slate-600">{detail}</p> : null}
    </article>
  );
}

function RosterSection({
  title,
  description,
  viewHref,
  children,
}: {
  title: string;
  description: string;
  viewHref: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-sm">
        <div>
          <h2 className="font-display text-xl font-bold text-cpbh-navy">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        <Link href={viewHref} className="text-sm font-semibold text-cpbh-teal hover:underline">
          Open in Views
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}

export default function DashboardHome() {
  const scholars = listScholars().filter((s) => s.scholar_or_trainee.toLowerCase().includes("scholar"));
  const trainees = listScholars().filter((s) => s.scholar_or_trainee.toLowerCase().includes("trainee"));
  const faculty = [...listFaculty()].sort((a, b) =>
    a.last_name.localeCompare(b.last_name, undefined, { sensitivity: "base" })
  );
  const programs = [...listPrograms()].sort((a, b) =>
    a.program.localeCompare(b.program, undefined, { sensitivity: "base" })
  );

  return (
    <AppShell
      title="REC dashboard"
      subtitle="Everyone on the current roster — scholars, trainees, faculty, and training programs."
    >
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Scholars" value={scholars.length} accent="gold" />
        <StatCard label="Trainees" value={trainees.length} accent="teal" />
        <StatCard label="Faculty" value={faculty.length} accent="navy" />
        <StatCard label="Programs" value={programs.length} accent="gold" />
      </div>

      <RosterSection
        title="Scholars"
        description="REC scholars on the roster. Current names are listed before past names."
        viewHref="/views?tab=scholars&kind=Scholar"
      >
        {scholars.sort(byLastName).map((s) => (
          <ScholarBox key={s.id} person={s} />
        ))}
      </RosterSection>

      <RosterSection
        title="Trainees"
        description="REC trainees, listed with scholars in the Scholar / trainee view."
        viewHref="/views?tab=scholars&kind=Trainee"
      >
        {trainees.sort(byLastName).map((s) => (
          <ScholarBox key={s.id} person={s} />
        ))}
      </RosterSection>

      <RosterSection
        title="Faculty"
        description="Participating REC faculty."
        viewHref="/views?tab=faculty"
      >
        {faculty.map((f) => (
          <FacultyBox key={f.id} person={f} />
        ))}
      </RosterSection>

      <RosterSection
        title="Programs"
        description="USC training programs."
        viewHref="/views?tab=programs"
      >
        {programs.map((p) => (
          <ProgramBox key={p.id} program={p} />
        ))}
      </RosterSection>
    </AppShell>
  );
}

function ScholarBox({ person }: { person: ScholarRow }) {
  return (
    <NameBox
      title={`${person.first_name} ${person.last_name}`}
      pill={person.current_or_past}
      detail={person.training_level || person.department}
    />
  );
}

function FacultyBox({ person }: { person: FacultyRow }) {
  return (
    <NameBox
      title={`${person.first_name} ${person.last_name}${person.executive_committee ? " *" : ""}`}
      detail={person.title || person.institution_department}
    />
  );
}

function ProgramBox({ program }: { program: ProgramRow }) {
  return <NameBox title={program.program} detail={program.preceptor ? `Preceptor: ${program.preceptor}` : program.focus} />;
}
