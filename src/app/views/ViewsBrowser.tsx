"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ExportTableCsv from "@/components/ExportTableCsv";
import {
  FACULTY_VIEW_HEADERS,
  OPEN_QUESTIONS,
  PROGRAM_VIEW_HEADERS,
  SCHOLAR_VIEW_HEADERS,
  facultyToExportRow,
  programToExportRow,
  scholarToViewRow,
  sortScholarsForTableG1,
} from "@/lib/rppr-standards";
import type { FacultyRow, ProgramRow, ScholarRow } from "@/lib/types";

type Tab = "scholars" | "faculty" | "programs";

const SCHOLAR_QUESTIONS: (string | null)[] = [
  null,
  null,
  OPEN_QUESTIONS.currentOrPast,
  OPEN_QUESTIONS.scholarOrTrainee,
  null,
  OPEN_QUESTIONS.researchArea,
  OPEN_QUESTIONS.adrc,
  OPEN_QUESTIONS.adrd,
];

function readTab(value: string | null): Tab {
  if (value === "faculty" || value === "programs" || value === "scholars") return value;
  return "scholars";
}

export default function ViewsBrowser({
  scholars,
  faculty,
  programs,
}: {
  scholars: ScholarRow[];
  faculty: FacultyRow[];
  programs: ProgramRow[];
}) {
  const params = useSearchParams();
  const [tab, setTab] = useState<Tab>(readTab(params.get("tab")));
  const [status, setStatus] = useState(params.get("status") === "Past" ? "Past" : params.get("status") === "Current" ? "Current" : "All");
  const [kind, setKind] = useState(params.get("kind") === "Trainee" ? "Trainee" : params.get("kind") === "Scholar" ? "Scholar" : "All");
  const [query, setQuery] = useState("");

  const scholarRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = scholars.filter((row) => {
      if (status !== "All" && !row.current_or_past.toLowerCase().startsWith(status.toLowerCase())) {
        return false;
      }
      if (kind !== "All" && !row.scholar_or_trainee.toLowerCase().includes(kind.toLowerCase())) {
        return false;
      }
      if (!q) return true;
      return `${row.first_name} ${row.last_name} ${row.research_area ?? ""}`.toLowerCase().includes(q);
    });
    return sortScholarsForTableG1(filtered).map(scholarToViewRow);
  }, [scholars, status, kind, query]);

  const facultyRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...faculty]
      .filter((row) => {
        if (!q) return true;
        return `${row.first_name} ${row.last_name} ${row.research_area ?? ""}`.toLowerCase().includes(q);
      })
      .sort((a, b) => a.last_name.localeCompare(b.last_name, undefined, { sensitivity: "base" }))
      .map((row) => [...facultyToExportRow(row), row.executive_committee ? "Yes (*)" : "No"]);
  }, [faculty, query]);

  const programRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...programs]
      .filter((row) => {
        if (!q) return true;
        return `${row.program} ${row.focus ?? ""} ${row.preceptor ?? ""}`.toLowerCase().includes(q);
      })
      .sort((a, b) => a.program.localeCompare(b.program, undefined, { sensitivity: "base" }))
      .map(programToExportRow);
  }, [programs, query]);

  const tabs: { id: Tab; label: string }[] = [
    { id: "scholars", label: "Scholar / trainee" },
    { id: "faculty", label: "Faculty" },
    { id: "programs", label: "Programs" },
  ];

  const headers =
    tab === "faculty"
      ? [...FACULTY_VIEW_HEADERS]
      : tab === "programs"
        ? [...PROGRAM_VIEW_HEADERS]
        : [...SCHOLAR_VIEW_HEADERS];
  const rows = tab === "faculty" ? facultyRows : tab === "programs" ? programRows : scholarRows;
  const questions = tab === "scholars" ? SCHOLAR_QUESTIONS : undefined;

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={tab === item.id ? "btn-primary" : "btn-secondary"}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="card mb-4 flex flex-wrap items-end gap-3 p-4">
        <label className="text-sm font-semibold text-cpbh-navy">
          Name
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search this view"
            className="mt-1 block rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal"
          />
        </label>
        {tab === "scholars" ? (
          <>
            <label className="text-sm font-semibold text-cpbh-navy">
              Current or past
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="mt-1 block rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal"
              >
                <option>All</option>
                <option>Current</option>
                <option>Past</option>
              </select>
            </label>
            <label className="text-sm font-semibold text-cpbh-navy">
              Scholar or trainee
              <select
                value={kind}
                onChange={(event) => setKind(event.target.value)}
                className="mt-1 block rounded-xl border border-slate-200 px-3 py-2 text-sm font-normal"
              >
                <option>All</option>
                <option>Scholar</option>
                <option>Trainee</option>
              </select>
            </label>
          </>
        ) : null}
        <div className="ml-auto">
          <ExportTableCsv
            filename={`rec-${tab}-view.csv`}
            headers={headers}
            rows={rows}
          />
        </div>
      </div>

      <p className="mb-3 text-sm text-slate-500">
        {rows.length} {rows.length === 1 ? "record" : "records"} in this view.
        {tab === "scholars"
          ? " Sorted Current, then Scholar, then last name A–Z."
          : null}
      </p>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th key={header} className="table-rppr">
                    {header}
                    {questions?.[index] ? (
                      <span className="open-question mt-1 block text-[11px] font-semibold normal-case tracking-normal text-cpbh-cardinal">
                        [{questions[index]}]
                      </span>
                    ) : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td className="table-rppr text-slate-500" colSpan={headers.length}>
                    No records match this view.
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => (
                  <tr key={index}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="table-rppr max-w-xs">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
