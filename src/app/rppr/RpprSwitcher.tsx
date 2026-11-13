"use client";

import { useState } from "react";
import PrettyCell from "@/components/PrettyCell";

type Panel = {
  kicker: string;
  title: string;
  note?: string;
  headers: string[];
  questions?: (string | null)[];
  rows: string[][];
};

export default function RpprSwitcher({
  initial,
  g1,
  g2,
}: {
  initial: "g1" | "g2";
  g1: Panel;
  g2: Panel;
}) {
  const [active, setActive] = useState<"g1" | "g2">(initial);
  const panel = active === "g1" ? g1 : g2;
  const notes = (panel.questions ?? []).filter((question): question is string => Boolean(question));

  return (
    <div>
      <div className="nav-dock mb-6" role="tablist" aria-label="RPPR tables">
        {(["g1", "g2"] as const).map((key) => {
          const item = key === "g1" ? g1 : g2;
          const selected = active === key;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(key)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                selected
                  ? "bg-cpbh-gold text-cpbh-navy shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_8px_16px_-8px_rgba(0,0,0,0.45)]"
                  : "text-white/90 hover:bg-white/15 hover:text-white"
              }`}
            >
              {item.kicker}
            </button>
          );
        })}
      </div>

      <section className="panel-3d mb-8 overflow-hidden">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 bg-gradient-to-br from-white via-white to-amber-50/80 px-5 py-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-cpbh-teal">{panel.kicker}</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-cpbh-navy">{panel.title}</h2>
            {panel.note ? <p className="mt-1 text-sm text-slate-500">{panel.note}</p> : null}
          </div>
          <p className="rounded-full bg-cpbh-navy px-3 py-1 text-xs font-semibold text-white shadow-sm">
            {panel.rows.length} {panel.rows.length === 1 ? "row" : "rows"}
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
                {panel.headers.map((header) => (
                  <th key={header} className="rppr-head">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {panel.rows.map((row, index) => (
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
    </div>
  );
}
