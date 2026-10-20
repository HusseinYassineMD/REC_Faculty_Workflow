import path from "path";
import { CLINICAL_REC_DIR } from "./paths";
import { writeCsv } from "./csv";
import { getDb } from "./db";
import { listFaculty, listPrograms, listScholars } from "./rec-data";
import type { ScholarRow } from "./types";
import { buildReportPayload, composeProgress } from "./report-payload";

function boolYn(v: number): string {
  return v ? "yes" : "no";
}

function dateRange(label: string, start: string | null, end: string | null): string {
  if (!start && !end) return "";
  return `${label}: ${start || "?"}–${end || "?"}`;
}

function grantLabel(r: ScholarRow): string {
  const parts = [r.grant_mechanism, r.grant_name, r.grant_number].filter(Boolean);
  if (parts.length === 0) return "";
  const range = dateRange("Grant", r.grant_start_date, r.grant_end_date);
  const base = parts.join(" ");
  return range ? `${base} (${range})` : base;
}

function composeNotes(r: ScholarRow): string {
  const meta: Record<string, string> = {};
  if (r.department) meta.dept = r.department;
  if (r.cohort_year) meta.cohort = r.cohort_year;
  if (r.mentors) meta.mentors = r.mentors;
  if (r.budget_fiscal_year) meta.budget_fy = r.budget_fiscal_year;
  if (r.budget_annual != null) meta.budget_annual = String(r.budget_annual);
  const json = Object.keys(meta).length ? JSON.stringify(meta) : "";
  const notes = r.notes?.trim() ?? "";
  if (notes && json) return `${notes} | ${json}`;
  return notes || json;
}

export function writeClinicalCsvs(): string[] {
  const scholars = listScholars();
  const faculty = listFaculty();
  const programs = listPrograms();

  const scholarRows = scholars.map((r) => ({
    id: String(r.id),
    last_name: r.last_name,
    first_name: r.first_name,
    current_or_past: r.current_or_past,
    scholar_or_trainee: r.scholar_or_trainee,
    training_level: r.training_level ?? "",
    research_area: r.research_area ?? "",
    progress: composeProgress(r),
    adrc_affiliated: boolYn(r.adrc_affiliated),
    adrd_field: boolYn(r.adrd_field),
    notes: composeNotes(r),
  }));

  writeCsv(path.join(CLINICAL_REC_DIR, "scholars-trainees.csv"), [
    "id",
    "last_name",
    "first_name",
    "current_or_past",
    "scholar_or_trainee",
    "training_level",
    "research_area",
    "progress",
    "adrc_affiliated",
    "adrd_field",
    "notes",
  ], scholarRows);

  writeCsv(
    path.join(CLINICAL_REC_DIR, "faculty.csv"),
    [
      "id",
      "last_name",
      "first_name",
      "title",
      "institution_department",
      "theme",
      "research_area",
      "executive_committee",
    ],
    faculty.map((r) => ({
      id: String(r.id),
      last_name: r.last_name,
      first_name: r.first_name,
      title: r.title ?? "",
      institution_department: r.institution_department ?? "",
      theme: r.theme ?? "",
      research_area: r.research_area ?? "",
      executive_committee: boolYn(r.executive_committee),
    }))
  );

  writeCsv(
    path.join(CLINICAL_REC_DIR, "training-programs.csv"),
    ["id", "program", "trainees_per_year", "minority_researchers", "focus", "preceptor", "notes"],
    programs.map((r) => ({
      id: String(r.id),
      program: r.program,
      trainees_per_year: r.trainees_per_year ?? "",
      minority_researchers: r.minority_researchers ?? "",
      focus: r.focus ?? "",
      preceptor: r.preceptor ?? "",
      notes: r.notes ?? "",
    }))
  );

  return [
    path.join(CLINICAL_REC_DIR, "scholars-trainees.csv"),
    path.join(CLINICAL_REC_DIR, "faculty.csv"),
    path.join(CLINICAL_REC_DIR, "training-programs.csv"),
  ];
}

export { buildReportPayload } from "./report-payload";

export function saveSnapshot(asOf: string, reportingYear: string, label: string) {
  const payload = buildReportPayload(asOf, reportingYear);
  getDb()
    .prepare(
      `INSERT INTO report_snapshots (label, as_of_date, reporting_year, payload_json)
       VALUES (?, ?, ?, ?)`
    )
    .run(label, asOf, reportingYear, JSON.stringify(payload));
}
