import Link from "next/link";
import type { FacultyRow, ProgramRow, ScholarRow } from "@/lib/types";

function EditLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="btn-secondary shrink-0 px-3 py-1.5 text-xs opacity-90 group-hover:opacity-100"
    >
      Open
    </Link>
  );
}

export function ScholarRecordCard({ s }: { s: ScholarRow }) {
  const isCurrent = s.current_or_past.toLowerCase() === "current";
  return (
    <article className="group record-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-cpbh-navy">
            {s.first_name} {s.last_name}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className={isCurrent ? "pill-teal" : "pill-navy"}>{s.current_or_past}</span>
            <span className="pill-navy">{s.scholar_or_trainee}</span>
            {s.training_level ? (
              <span className="pill-navy">{s.training_level}</span>
            ) : null}
          </div>
        </div>
        <EditLink href={`/forms/scholar/${s.id}`} />
      </div>
      {s.research_area ? (
        <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">{s.research_area}</p>
      ) : null}
      <dl className="grid gap-2 text-xs sm:grid-cols-2">
        <div className="rounded-xl bg-slate-50 px-3 py-2">
          <dt className="font-semibold uppercase tracking-wide text-slate-400">Department</dt>
          <dd className="mt-0.5 font-medium text-cpbh-navy">{s.department || "—"}</dd>
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-2">
          <dt className="font-semibold uppercase tracking-wide text-slate-400">Project window</dt>
          <dd className="mt-0.5 font-medium text-cpbh-navy">
            {s.project_start_date || "—"} → {s.project_end_date || "—"}
          </dd>
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-2 sm:col-span-2">
          <dt className="font-semibold uppercase tracking-wide text-slate-400">Mentors</dt>
          <dd className="mt-0.5 font-medium text-cpbh-navy">
            {s.mentors || s.primary_preceptor || "—"}
          </dd>
        </div>
      </dl>
    </article>
  );
}

export function FacultyRecordCard({ f }: { f: FacultyRow }) {
  return (
    <article className="group record-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-cpbh-navy">
            {f.first_name} {f.last_name}
            {f.executive_committee ? (
              <span className="ml-1 text-cpbh-gold" title="Executive committee">
                *
              </span>
            ) : null}
          </h3>
          <p className="mt-1 text-sm text-slate-600">{f.title}</p>
        </div>
        <EditLink href={`/forms/faculty/${f.id}`} />
      </div>
      <span className="pill-gold w-fit">{f.theme || "Theme TBD"}</span>
      <p className="text-sm text-slate-600">{f.institution_department}</p>
      {f.research_area ? (
        <p className="line-clamp-2 text-sm text-slate-500">{f.research_area}</p>
      ) : null}
    </article>
  );
}

export function ProgramRecordCard({ p }: { p: ProgramRow }) {
  return (
    <article className="group record-card">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-semibold leading-snug text-cpbh-navy">
          {p.program}
        </h3>
        <EditLink href={`/forms/program/${p.id}`} />
      </div>
      <div className="flex flex-wrap gap-2">
        {p.trainees_per_year ? <span className="pill-teal">{p.trainees_per_year} / yr</span> : null}
        {p.minority_researchers ? (
          <span className="pill-navy">{p.minority_researchers} minority</span>
        ) : null}
      </div>
      {p.focus ? <p className="text-sm text-slate-600">{p.focus}</p> : null}
      <p className="text-xs font-medium text-slate-500">
        Preceptor: <span className="text-cpbh-navy">{p.preceptor || "—"}</span>
      </p>
    </article>
  );
}

export function SectionPanel({
  title,
  description,
  count,
  children,
}: {
  title: string;
  description?: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-display text-xl font-bold text-cpbh-navy">{title}</h2>
          {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
        </div>
        {count != null ? (
          <span className="pill-navy">{count} records</span>
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}
