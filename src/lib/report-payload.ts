import { isActiveAsOf } from "./timeline";
import { listFaculty, listPrograms, listScholars } from "./rec-data";
import type { ScholarRow } from "./types";

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

export function composeProgress(r: ScholarRow): string {
  return [
    r.progress?.trim(),
    dateRange("Project", r.project_start_date, r.project_end_date),
    dateRange("Mentorship", r.mentorship_start_date, r.mentorship_end_date),
    grantLabel(r),
  ]
    .filter(Boolean)
    .join(" · ");
}

export function buildReportPayload(asOf: string, reportingYear: string) {
  const scholars = listScholars();
  const faculty = listFaculty();
  const programs = listPrograms();

  const table1a = scholars.map((r) => ({
    id: r.id,
    name: `${r.last_name}, ${r.first_name}`,
    activeAsOf: isActiveAsOf(r, asOf),
    currentOrPast: r.current_or_past,
    scholarOrTrainee: r.scholar_or_trainee,
    trainingLevel: r.training_level,
    department: r.department,
    cohortYear: r.cohort_year,
    researchArea: r.research_area,
    progress: composeProgress(r),
    mentors: r.mentors,
    projectTitle: r.project_title,
    projectStart: r.project_start_date,
    projectEnd: r.project_end_date,
    mentorshipStart: r.mentorship_start_date,
    mentorshipEnd: r.mentorship_end_date,
    grantTimeline: {
      name: r.grant_name,
      number: r.grant_number,
      mechanism: r.grant_mechanism,
      start: r.grant_start_date,
      end: r.grant_end_date,
    },
    budget: {
      total: r.budget_total,
      annual: r.budget_annual,
      fiscalYear: r.budget_fiscal_year,
    },
    adrcAffiliated: r.adrc_affiliated === 1,
    adrdField: r.adrd_field === 1,
  }));

  return {
    meta: { asOfDate: asOf, reportingYear, generatedAt: new Date().toISOString() },
    summary: {
      activeScholarsTrainees: table1a.filter((x) => x.activeAsOf).length,
      totalListed: table1a.length,
      faculty: faculty.length,
      programs: programs.length,
    },
    table1a,
    faculty,
    trainingPrograms: programs,
  };
}
