"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDemoToast } from "@/components/DemoToast";
import PrettyCell from "@/components/PrettyCell";
import { downloadCsv } from "@/lib/download-table";
import {
  FACULTY_VIEW_HEADERS,
  OPEN_QUESTIONS,
  PROGRAM_VIEW_HEADERS,
  SCHOLAR_VIEW_HEADERS,
  facultyToExportRow,
  programToExportRow,
  scholarToViewRow,
  sortScholarsForTableG1,
  yesNoCell,
} from "@/lib/rppr-standards";
import type { FacultyRow, ProgramRow, ScholarRow } from "@/lib/types";

type Tab = "scholars" | "faculty" | "programs";

type VisibleRow = { key: string; cells: string[] };

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

function uniqueValues(values: (string | null | undefined)[]) {
  return [...new Set(values.map((value) => (value ?? "").trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="text-sm font-semibold text-cpbh-navy">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 block min-w-[10rem] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-normal"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
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
  const { show, Toast } = useDemoToast();
  const [tab, setTab] = useState<Tab>(readTab(params.get("tab")));
  const [status, setStatus] = useState(
    params.get("status") === "Past" ? "Past" : params.get("status") === "Current" ? "Current" : "All"
  );
  const [kind, setKind] = useState(
    params.get("kind") === "Trainee" ? "Trainee" : params.get("kind") === "Scholar" ? "Scholar" : "All"
  );
  const [level, setLevel] = useState("All");
  const [adrc, setAdrc] = useState("All");
  const [adrd, setAdrd] = useState("All");
  const [theme, setTheme] = useState("All");
  const [committee, setCommittee] = useState("All");
  const [preceptor, setPreceptor] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const levels = useMemo(
    () => ["All", ...uniqueValues(scholars.map((row) => row.training_level))],
    [scholars]
  );
  const themes = useMemo(() => ["All", ...uniqueValues(faculty.map((row) => row.theme))], [faculty]);
  const preceptors = useMemo(
    () => ["All", ...uniqueValues(programs.map((row) => row.preceptor))],
    [programs]
  );

  const scholarRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = scholars.filter((row) => {
      if (status !== "All" && !row.current_or_past.toLowerCase().startsWith(status.toLowerCase())) {
        return false;
      }
      if (kind !== "All" && !row.scholar_or_trainee.toLowerCase().includes(kind.toLowerCase())) {
        return false;
      }
      if (level !== "All" && (row.training_level ?? "") !== level) return false;
      if (adrc !== "All" && yesNoCell(row.adrc_affiliated) !== adrc) return false;
      if (adrd !== "All" && yesNoCell(row.adrd_field) !== adrd) return false;
      if (!q) return true;
      return `${row.first_name} ${row.last_name} ${row.research_area ?? ""}`.toLowerCase().includes(q);
    });
    return sortScholarsForTableG1(filtered).map((row) => ({
      key: `s-${row.id}`,
      cells: scholarToViewRow(row),
    }));
  }, [scholars, status, kind, level, adrc, adrd, query]);

  const facultyRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...faculty]
      .filter((row) => {
        if (theme !== "All" && (row.theme ?? "") !== theme) return false;
        if (committee === "Yes" && !row.executive_committee) return false;
        if (committee === "No" && row.executive_committee) return false;
        if (!q) return true;
        return `${row.first_name} ${row.last_name} ${row.research_area ?? ""}`.toLowerCase().includes(q);
      })
      .sort((a, b) => a.last_name.localeCompare(b.last_name, undefined, { sensitivity: "base" }))
      .map((row) => ({
        key: `f-${row.id}`,
        cells: [...facultyToExportRow(row), row.executive_committee ? "Yes (*)" : "No"],
      }));
  }, [faculty, theme, committee, query]);

  const programRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...programs]
      .filter((row) => {
        if (preceptor !== "All" && (row.preceptor ?? "") !== preceptor) return false;
        if (!q) return true;
        return `${row.program} ${row.focus ?? ""} ${row.preceptor ?? ""}`.toLowerCase().includes(q);
      })
      .sort((a, b) => a.program.localeCompare(b.program, undefined, { sensitivity: "base" }))
      .map((row) => ({ key: `p-${row.id}`, cells: programToExportRow(row) }));
  }, [programs, preceptor, query]);

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
  const rows: VisibleRow[] =
    tab === "faculty" ? facultyRows : tab === "programs" ? programRows : scholarRows;
  const questions = tab === "scholars" ? SCHOLAR_QUESTIONS : undefined;
  const visibleKeys = rows.map((row) => row.key);
  const selectedVisible = selected.filter((key) => visibleKeys.includes(key));
  const exportRows = (selectedVisible.length > 0 ? rows.filter((row) => selectedVisible.includes(row.key)) : rows).map(
    (row) => row.cells
  );
  const filtersActive =
    query.trim() !== "" ||
    (tab === "scholars" &&
      (status !== "All" || kind !== "All" || level !== "All" || adrc !== "All" || adrd !== "All")) ||
    (tab === "faculty" && (theme !== "All" || committee !== "All")) ||
    (tab === "programs" && preceptor !== "All");

  useEffect(() => {
    setSelected((current) => {
      const next = current.filter((key) => visibleKeys.includes(key));
      return next.length === current.length ? current : next;
    });
  }, [tab, status, kind, level, adrc, adrd, theme, committee, preceptor, query, scholars, faculty, programs]);

  function clearFilters() {
    setQuery("");
    setStatus("All");
    setKind("All");
    setLevel("All");
    setAdrc("All");
    setAdrd("All");
    setTheme("All");
    setCommittee("All");
    setPreceptor("All");
  }

  function toggle(key: string) {
    setSelected((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key]
    );
  }

  function toggleAll() {
    if (selectedVisible.length === rows.length) {
      setSelected((current) => current.filter((key) => !visibleKeys.includes(key)));
      return;
    }
    setSelected((current) => [...new Set([...current, ...visibleKeys])]);
  }

  function exportView() {
    if (exportRows.length === 0) return;
    const filename = `rec-${tab}-view.csv`;
    downloadCsv(filename, headers, exportRows);
    const scope = selectedVisible.length > 0 ? "selected" : "matching";
    show(`Exported ${exportRows.length} ${scope} ${exportRows.length === 1 ? "row" : "rows"} to CSV.`);
  }

  return (
    <div>
      {Toast}
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

      <div className="panel-3d mb-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold text-cpbh-navy">Filters</h2>
            <p className="mt-1 text-sm text-slate-500">
              Choose any combination. Export uses the checked rows, or every row that matches when none are checked.
            </p>
          </div>
          {filtersActive ? (
            <button type="button" className="btn-ghost" onClick={clearFilters}>
              Clear filters
            </button>
          ) : null}
        </div>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="text-sm font-semibold text-cpbh-navy">
            Name
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search this view"
              className="mt-1 block rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-normal"
            />
          </label>
          {tab === "scholars" ? (
            <>
              <FilterSelect label="Current or past" value={status} options={["All", "Current", "Past"]} onChange={setStatus} />
              <FilterSelect label="Scholar or trainee" value={kind} options={["All", "Scholar", "Trainee"]} onChange={setKind} />
              <FilterSelect label="Level of training" value={level} options={levels} onChange={setLevel} />
              <FilterSelect label="ADRC affiliated" value={adrc} options={["All", "Yes", "No"]} onChange={setAdrc} />
              <FilterSelect label="ADRD field" value={adrd} options={["All", "Yes", "No"]} onChange={setAdrd} />
            </>
          ) : null}
          {tab === "faculty" ? (
            <>
              <FilterSelect label="Theme" value={theme} options={themes} onChange={setTheme} />
              <FilterSelect label="Executive committee" value={committee} options={["All", "Yes", "No"]} onChange={setCommittee} />
            </>
          ) : null}
          {tab === "programs" ? (
            <FilterSelect label="Preceptor" value={preceptor} options={preceptors} onChange={setPreceptor} />
          ) : null}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <p className="text-sm text-slate-600">
            {rows.length} matching
            {selectedVisible.length > 0 ? ` · ${selectedVisible.length} selected` : ""}.
            {tab === "scholars" ? " Sorted Current, then Scholar, then last name A–Z." : ""}
          </p>
          <button
            type="button"
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
            onClick={exportView}
            disabled={exportRows.length === 0}
          >
            {selectedVisible.length > 0
              ? `Export ${selectedVisible.length} selected (CSV)`
              : `Export ${rows.length} matching (CSV)`}
          </button>
        </div>
      </div>

      <div className="panel-3d overflow-hidden">
        {questions?.some(Boolean) ? (
          <ul className="flex flex-wrap gap-2 border-b border-amber-100/80 bg-[#fffdf8] px-5 py-3">
            {questions.filter((question): question is string => Boolean(question)).map((question) => (
              <li key={question} className="open-question text-xs font-semibold text-cpbh-cardinal">
                [{question}]
              </li>
            ))}
          </ul>
        ) : null}
        <div className="overflow-x-auto">
          <table className="table-rppr w-full min-w-[880px]">
            <thead>
              <tr>
                <th className="w-12">
                  <input
                    type="checkbox"
                    aria-label="Select all rows in this view"
                    checked={rows.length > 0 && selectedVisible.length === rows.length}
                    onChange={toggleAll}
                  />
                </th>
                {headers.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td className="text-slate-500" colSpan={headers.length + 1}>
                    No records match these filters.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.key} className={selectedVisible.includes(row.key) ? "is-selected" : undefined}>
                    <td>
                      <input
                        type="checkbox"
                        aria-label={`Select ${row.cells[0]}`}
                        checked={selectedVisible.includes(row.key)}
                        onChange={() => toggle(row.key)}
                      />
                    </td>
                    {row.cells.map((cell, cellIndex) => (
                      <td key={cellIndex} className={cellIndex <= 1 ? "whitespace-nowrap" : "max-w-sm"}>
                        <PrettyCell value={cell} emphasize={cellIndex === 0} />
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
