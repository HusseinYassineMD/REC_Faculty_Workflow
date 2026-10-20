import AppShell from "@/components/AppShell";
import PrintButton from "@/components/PrintButton";
import { listFaculty, listPrograms, listScholars } from "@/lib/rec-data";

export default function RpprPreviewPage() {
  const scholars = listScholars();
  const faculty = listFaculty();
  const programs = listPrograms();

  return (
    <AppShell
      title="RPPR G1 preview"
      subtitle="Formal table layout for print and NACC workbooks — everyday browsing stays on the card dashboard."
      activeHref="/rppr"
    >
      <div className="card mb-6 flex flex-wrap items-center justify-between gap-3 p-4 print:hidden">
        <p className="text-sm text-slate-600">
          Print or save as PDF for NACC workbooks. Tables mirror RPPR Table 1a, faculty, and training programs.
        </p>
        <PrintButton />
      </div>

      <RpprPanel
        title="Table 1a. Summary table of REC scholars and trainees"
        headers={[
          "Name",
          "Current / past",
          "Scholar / trainee",
          "Level",
          "Research area",
          "Progress",
          "ADRC?",
          "ADRD?",
        ]}
        rows={scholars.map((r) => [
          `${r.last_name}, ${r.first_name}`,
          r.current_or_past,
          r.scholar_or_trainee,
          r.training_level ?? "",
          r.research_area ?? "",
          r.progress ?? "",
          r.adrc_affiliated ? "Yes" : "No",
          r.adrd_field ? "Yes" : "No",
        ])}
      />

      <RpprPanel
        title="Participating REC faculty"
        subtitle="* Executive committee"
        headers={["Last", "First", "Title", "Department", "Theme", "Research area"]}
        rows={faculty.map((f) => [
          f.last_name + (f.executive_committee ? "*" : ""),
          f.first_name,
          f.title ?? "",
          f.institution_department ?? "",
          f.theme ?? "",
          f.research_area ?? "",
        ])}
      />

      <RpprPanel
        title="USC training programs (ADRD / minority scholars)"
        headers={["Program", "Trainees / year", "Minority %", "Focus", "Preceptor"]}
        rows={programs.map((p) => [
          p.program,
          p.trainees_per_year ?? "",
          p.minority_researchers ?? "",
          p.focus ?? "",
          p.preceptor ?? "",
        ])}
      />
    </AppShell>
  );
}

function RpprPanel({
  title,
  subtitle,
  headers,
  rows,
}: {
  title: string;
  subtitle?: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <section className="card mb-8 overflow-hidden print:shadow-none print:ring-0">
      <div className="bg-gradient-to-r from-cpbh-navy to-cpbh-deep px-5 py-4 text-white">
        <h2 className="font-display text-lg font-bold">{title}</h2>
        {subtitle ? <p className="text-xs text-white/70">{subtitle}</p> : null}
      </div>
      <div className="overflow-x-auto p-1">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h} className="table-rppr">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} className="table-rppr">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
