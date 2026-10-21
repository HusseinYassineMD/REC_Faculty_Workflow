import type { FacultyRow, ProgramRow, ScholarRow } from "./types";

/** NACC Table G1 column headers (RL5 REC G1/G2 template). */
export const TABLE_G1_HEADERS = [
  "Last name, First name",
  "Current or Past Trainee",
  "Scholar or Trainee",
  "Level of Training",
  "Area of Research",
  "Progress [succinct recap of significant milestones]",
  "Currently Affiliated with an ADRC?",
  "Working/collaborating within the ADRD field?",
] as const;

export const TABLE_G2_HEADERS = [
  "Event, Date(s), Sponsors",
  "Brief Description, Intended Audience",
  "Attendance",
  "Platform, Advertising, Access",
  "Other Information",
] as const;

export const ADRC_FIELD_HELP =
  "Count as Yes when the person is mentored or funded through the ADRC REC (per NACC G1 guidance).";

/** Placeholder until REC leadership finalizes inclusion criteria with Tiffany/HY. */
export const ADRD_FIELD_HELP =
  "To be defined: typically working or collaborating in Alzheimer’s disease and related dementias research, care, or education. Confirm Yes/No criteria with REC leadership before final RPPR.";

export const SCHOLAR_DEFINITION =
  "REC Scholars: early career investigators selected by the ADRC for structured educational programming and comprehensive ADRD mentorship (often 3–5 years tracking).";

export const TRAINEE_DEFINITION =
  "REC Trainees: students or investigators in self-selected training with ADRC REC programming; may be in an ADRC or affiliate lab but not in a formal Scholar cohort.";

function isCurrent(r: ScholarRow): boolean {
  return r.current_or_past.toLowerCase().startsWith("current");
}

function scholarTypeRank(r: ScholarRow): number {
  const t = r.scholar_or_trainee.toLowerCase();
  if (t.includes("scholar")) return 0;
  if (t.includes("trainee")) return 1;
  return 2;
}

/** Active → Past; then Scholar → Trainee; then last name A→Z. */
export function sortScholarsForTableG1(rows: ScholarRow[]): ScholarRow[] {
  return [...rows].sort((a, b) => {
    const c = Number(isCurrent(b)) - Number(isCurrent(a));
    if (c !== 0) return c;
    const t = scholarTypeRank(a) - scholarTypeRank(b);
    if (t !== 0) return t;
    return a.last_name.localeCompare(b.last_name, undefined, { sensitivity: "base" });
  });
}

export function formatCurrentOrPastTrainee(r: ScholarRow): string {
  const status = r.current_or_past || "Current";
  if (r.cohort_year?.trim()) {
    return `${status} (${r.cohort_year.trim()})`;
  }
  if (r.mentorship_start_date || r.mentorship_end_date) {
    const start = r.mentorship_start_date ?? "";
    const end = r.mentorship_end_date ?? "";
    if (start || end) return `${status} (${start}${start && end ? "–" : ""}${end})`;
  }
  return status;
}

export function formatScholarOrTraineeLabel(r: ScholarRow): string {
  const t = r.scholar_or_trainee.toLowerCase();
  if (t.includes("scholar")) return "REC Scholar";
  if (t.includes("trainee")) return "Trainee";
  return r.scholar_or_trainee;
}

export function truncateResearchArea(text: string | null | undefined, max = 60): string {
  const s = (text ?? "").trim();
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
}

export function scholarToTableG1Row(r: ScholarRow): string[] {
  return [
    `${r.last_name}, ${r.first_name}`,
    formatCurrentOrPastTrainee(r),
    formatScholarOrTraineeLabel(r),
    r.training_level ?? "",
    truncateResearchArea(r.research_area),
    r.progress ?? "",
    r.adrc_affiliated ? "Yes" : "No",
    r.adrd_field ? "Yes" : "No",
  ];
}

export function facultyToExportRow(f: FacultyRow): string[] {
  return [
    f.last_name + (f.executive_committee ? "*" : ""),
    f.first_name,
    f.title ?? "",
    f.institution_department ?? "",
    f.theme ?? "",
    f.research_area ?? "",
  ];
}

export function programToExportRow(p: ProgramRow): string[] {
  return [
    p.program,
    p.trainees_per_year ?? "",
    p.minority_researchers ?? "",
    p.focus ?? "",
    p.preceptor ?? "",
    p.notes ?? "",
  ];
}

export const FACULTY_VIEW_HEADERS = [
  "Last name",
  "First name",
  "Title",
  "Institution / department",
  "Theme",
  "Research area",
  "Executive committee",
];

export const PROGRAM_VIEW_HEADERS = [
  "Program",
  "Trainees / year",
  "% minority researchers",
  "Focus",
  "Preceptor",
  "Notes",
];

export const SCHOLAR_VIEW_HEADERS = [
  "Last name",
  "First name",
  "Current / past",
  "Scholar / trainee",
  "Level",
  "Research area",
  "ADRC affiliated",
  "ADRD field",
];

export function scholarToViewRow(r: ScholarRow): string[] {
  return [
    r.last_name,
    r.first_name,
    formatCurrentOrPastTrainee(r),
    formatScholarOrTraineeLabel(r),
    r.training_level ?? "",
    r.research_area ?? "",
    r.adrc_affiliated ? "Yes" : "No",
    r.adrd_field ? "Yes" : "No",
  ];
}
