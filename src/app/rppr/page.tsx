import AppShell from "@/components/AppShell";
import PrintButton from "@/components/PrintButton";
import ExportTableCsv from "@/components/ExportTableCsv";
import { listScholars } from "@/lib/rec-data";
import {
  TABLE_G1_HEADERS,
  TABLE_G1_QUESTIONS,
  TABLE_G2_HEADERS,
  sortScholarsForTableG1,
  scholarToTableG1Row,
} from "@/lib/rppr-standards";

export default function RpprPreviewPage() {
  const reportingYear = new Date().getFullYear();
  const scholars = sortScholarsForTableG1(listScholars());
  const g1Rows = scholars.map(scholarToTableG1Row);

  return (
    <AppShell
      title="RPPR Tables G1 & G2"
      subtitle="Table G1 and Table G2 in the NACC RL5 layout, filled from the current scholar and trainee roster."
    >
      <div className="card mb-6 flex flex-wrap items-center justify-between gap-3 p-4 print:hidden">
        <p className="text-sm text-slate-600">
          Table G1 rows sort: Current → Past, then Scholar → Trainee, then last name A–Z.
          Red brackets on the table are open questions and are left off the PDF.{" "}
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
        questions={TABLE_G1_QUESTIONS}
        rows={g1Rows}
      />

      <p className="mb-3 text-sm text-slate-500 print:hidden">
        Table G2 uses the NACC event columns. The current roster has scholar, faculty, and program
        records, and no stored REC events yet — add those on the intake form.
      </p>
      <RpprPanel
        title={`Table G2. Summary table of REC EVENTS – Year ${reportingYear}`}
        headers={[...TABLE_G2_HEADERS]}
        rows={[]}
      />
    </AppShell>
  );
}

function RpprPanel({
  title,
  subtitle,
  headers,
  questions,
  rows,
}: {
  title: string;
  subtitle?: string;
  headers: string[];
  questions?: (string | null)[];
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
              {headers.map((h, idx) => (
                <th key={h} className="table-rppr">
                  {h}
                  {questions?.[idx] ? (
                    <span className="open-question mt-1 block text-[11px] font-semibold normal-case tracking-normal text-cpbh-cardinal">
                      [{questions[idx]}]
                    </span>
                  ) : null}
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
