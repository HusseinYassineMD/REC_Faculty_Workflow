import Link from "next/link";
import ExportTableCsv from "@/components/ExportTableCsv";

export default function RosterDataTable({
  title,
  description,
  headers,
  rows,
  exportFilename,
  editHrefPrefix,
  editIdColumn = 0,
  idByRow,
}: {
  title: string;
  description?: string;
  headers: string[];
  rows: string[][];
  exportFilename: string;
  editHrefPrefix?: string;
  editIdColumn?: number;
  idByRow?: number[];
}) {
  return (
    <section className="card mb-8 overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-cpbh-navy/5 to-transparent px-5 py-4">
        <div>
          <h2 className="font-display text-xl font-bold text-cpbh-navy">{title}</h2>
          {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
        </div>
        <ExportTableCsv filename={exportFilename} headers={headers} rows={rows} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr>
              {editHrefPrefix ? (
                <th className="table-rppr w-20">Open</th>
              ) : null}
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
                {editHrefPrefix && idByRow ? (
                  <td className="table-rppr">
                    <Link
                      href={`${editHrefPrefix}/${idByRow[i]}`}
                      className="text-sm font-semibold text-cpbh-teal hover:underline"
                    >
                      Open
                    </Link>
                  </td>
                ) : null}
                {row.map((cell, j) => (
                  <td key={j} className="table-rppr max-w-xs">
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
