import AppShell from "@/components/AppShell";
import PrettyCell from "@/components/PrettyCell";
import { listScholars, listStoredEvents } from "@/lib/rec-data";
import RpprDocuments from "./RpprDocuments";
import {
  OPEN_QUESTIONS,
  TABLE_G1_HEADERS,
  TABLE_G2_HEADERS,
  TABLE_G2_ROWS,
  sortScholarsForTableG1,
  scholarToTableG1Row,
} from "@/lib/rppr-standards";

export default function RpprPreviewPage() {
  const scholars = sortScholarsForTableG1(listScholars());
  const g1Rows = scholars.map(scholarToTableG1Row);
  const g2Rows = [...TABLE_G2_ROWS, ...listStoredEvents()];

  return (
    <AppShell
      title="RPPR Tables G1 & G2"
      subtitle="Scholars and trainees in Table G1. REC speaker series in Table G2."
    >
      <RpprDocuments
        g1Headers={[...TABLE_G1_HEADERS]}
        g1Rows={g1Rows}
        g2Headers={[...TABLE_G2_HEADERS]}
        g2Rows={g2Rows}
      />

      <RpprPanel
        kicker="Table G1"
        title="REC scholars and trainees"
        count={g1Rows.length}
        note="Sorted current, then scholar, then last name."
        headers={[...TABLE_G1_HEADERS]}
        questions={[
          null,
          OPEN_QUESTIONS.currentOrPast,
          OPEN_QUESTIONS.scholarOrTrainee,
          null,
          OPEN_QUESTIONS.researchArea,
          OPEN_QUESTIONS.progress,
          OPEN_QUESTIONS.adrc,
          OPEN_QUESTIONS.adrd,
        ]}
        rows={g1Rows}
      />

      <RpprPanel
        kicker="Table G2"
        title="REC events"
        count={g2Rows.length}
        note="Speaker series first. Events added from the intake form are at the end."
        headers={[...TABLE_G2_HEADERS]}
        rows={g2Rows}
      />
    </AppShell>
  );
}

function RpprPanel({
  kicker,
  title,
  count,
  note,
  headers,
  questions,
  rows,
}: {
  kicker: string;
  title: string;
  count: number;
  note?: string;
  headers: string[];
  questions?: (string | null)[];
  rows: string[][];
}) {
  const notes = (questions ?? []).filter((question): question is string => Boolean(question));

  return (
    <section className="panel-3d mb-8 overflow-hidden">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 bg-gradient-to-br from-white via-white to-amber-50/80 px-5 py-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-cpbh-teal">{kicker}</p>
          <h2 className="mt-1 font-display text-2xl font-bold text-cpbh-navy">{title}</h2>
          {note ? <p className="mt-1 text-sm text-slate-500">{note}</p> : null}
        </div>
        <p className="rounded-full bg-cpbh-navy px-3 py-1 text-xs font-semibold text-white shadow-sm">
          {count} {count === 1 ? "row" : "rows"}
        </p>
      </div>
      {notes.length > 0 ? (
        <ul className="flex flex-wrap gap-2 border-b border-slate-100 bg-white px-5 py-3">
          {notes.map((question) => (
            <li key={question} className="open-question text-xs font-semibold text-cpbh-cardinal">
              [{question}]
            </li>
          ))}
        </ul>
      ) : null}
      <div className="table-scroll">
        <table className="table-rppr w-full min-w-[760px]">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header} className="rppr-head">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>
                    <PrettyCell value={cell} emphasize={cellIndex === 0} />
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
