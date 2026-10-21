import AppShell from "@/components/AppShell";
import PrintButton from "@/components/PrintButton";
import ExportTableCsv from "@/components/ExportTableCsv";
import { listFaculty, listPrograms, listScholars } from "@/lib/rec-data";
import {
  TABLE_G1_HEADERS,
  TABLE_G2_HEADERS,
  sortScholarsForTableG1,
  scholarToTableG1Row,
  facultyToExportRow,
  programToExportRow,
} from "@/lib/rppr-standards";

export default function RpprPreviewPage() {
  const reportingYear = new Date().getFullYear();
  const scholars = sortScholarsForTableG1(listScholars());
  const faculty = listFaculty();
  const programs = listPrograms();

  const g1Rows = scholars.map(scholarToTableG1Row);
  const facultyRows = faculty.map(facultyToExportRow);
  const programRows = programs.map(programToExportRow);

  return (
    <AppShell
      title="RPPR Tables G1 & G2"
      subtitle="Column labels follow the NACC RL5 REC template. Use Export PDF for submission-ready layout."
      activeHref="/rppr"
    >
      <div className="card mb-6 flex flex-wrap items-center justify-between gap-3 p-4 print:hidden">
        <p className="text-sm text-slate-600">
          Table G1 rows sort: Current → Past, Scholar → Trainee, last name A–Z.{" "}
          <a
            href="https://www.naccdata.org/progress-reports-to-nia/"
            className="font-medium text-cpbh-teal underline-offset-2 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            NACC reporting guidance
          </a>
        </p>
        <div className="flex flex-wrap gap-2">
          <ExportTableCsv
            filename={`table-g1-rec-scholars-trainees-${reportingYear}.csv`}
            headers={[...TABLE_G1_HEADERS]}
            rows={g1Rows}
          />
          <PrintButton label="Export PDF" />
        </div>
      </div>

      <RpprPanel
        title={`Table G1. Summary table of REC SCHOLARS and TRAINEES – Year ${reportingYear}`}
        headers={[...TABLE_G1_HEADERS]}
        rows={g1Rows}
      />

      <RpprPanel
        title={`Table G2. Summary table of REC EVENTS – Year ${reportingYear}`}
        subtitle="Event intake for G2 will be added in the next phase; structure matches NACC template."
        headers={[...TABLE_G2_HEADERS]}
        rows={[
          [
            "(Events captured in phase 2)",
            "Brief description and audience",
            "—",
            "Platform / access",
            "Other information",
          ],
        ]}
      />

      <div className="print:break-before-page" />

      <RpprPanel
        title="Participating REC faculty (supporting table)"
        subtitle="* Executive committee — not part of G1/G2 core template"
        headers={["Last", "First", "Title", "Department", "Theme", "Research area"]}
        rows={facultyRows}
      />

      <RpprPanel
        title="USC training programs (supporting table)"
        headers={["Program", "Trainees / year", "Minority %", "Focus", "Preceptor"]}
        rows={programRows.map((r) => r.slice(0, 5))}
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
      <div className="bg-gradient-to-r from-cpbh-navy to-cpbh-deep px-5 py-4 text-white print:bg-cpbh-navy">
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
                  <td key={j} className="table-rppr align-top text-sm">
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
