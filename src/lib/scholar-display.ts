import type { ScholarRow } from "./types";

export function displayScholarValues(row: ScholarRow) {
  const s = (key: keyof ScholarRow) => String(row[key] ?? "");
  return {
    last_name: s("last_name"),
    first_name: s("first_name"),
    email: row.email ?? "scholar@usc.edu",
    department: row.department ?? "Keck School of Medicine",
    cohort_year: row.cohort_year ?? "2025–2026",
    current_or_past: row.current_or_past || "Current",
    scholar_or_trainee: row.scholar_or_trainee || "Scholar",
    training_level: row.training_level ?? "Postdoctoral fellow",
    research_area:
      row.research_area ??
      "Longitudinal cognitive and social determinants in ADRD populations",
    progress: row.progress ?? "On track for RPPR Table 1a reporting",
    mentors: row.mentors ?? "Helena Chui, MD · Maria Aranda, PhD",
    primary_preceptor: row.primary_preceptor ?? "Helena Chui",
    project_title: row.project_title ?? "Safety-net dementia diagnosis and care pathways",
    project_description:
      row.project_description ??
      "Mixed-methods study linking EHR diagnoses to community follow-up in ADRD.",
    project_start_date: row.project_start_date ?? "2024-07-01",
    project_end_date: row.project_end_date ?? "2027-06-30",
    mentorship_start_date: row.mentorship_start_date ?? "2024-07-01",
    mentorship_end_date: row.mentorship_end_date ?? "2027-06-30",
    grant_mechanism: row.grant_mechanism ?? "KL2",
    grant_number: row.grant_number ?? "TR002345",
    grant_name: row.grant_name ?? "USC CTSI KL2 Career Development Award",
    grant_start_date: row.grant_start_date ?? "2024-09-01",
    grant_end_date: row.grant_end_date ?? "2027-08-31",
    budget_total: row.budget_total != null ? String(row.budget_total) : "375000",
    budget_annual: row.budget_annual != null ? String(row.budget_annual) : "125000",
    budget_fiscal_year: row.budget_fiscal_year ?? "FY2026",
    notes: row.notes ?? "",
    adrc_affiliated: row.adrc_affiliated === 0 ? "0" : "1",
    adrd_field: row.adrd_field === 0 ? "0" : "1",
  };
}
