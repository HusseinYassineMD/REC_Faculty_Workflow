"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import FormSection, { Field } from "@/components/FormSection";
import PreviewFormFooter from "@/components/PreviewFormFooter";
import { getScholar, listScholars } from "@/lib/rec-data-demo";
import type { ScholarRow } from "@/lib/types";

function displayValues(row: ScholarRow) {
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

export default function ScholarFormPreview() {
  const params = useSearchParams();
  const id = parseInt(params.get("id") ?? "0", 10);

  const row = useMemo(() => {
    if (id > 0) return getScholar(id);
    return listScholars().find((s) => s.current_or_past === "Current") ?? listScholars()[0];
  }, [id]);

  if (!row) {
    return (
      <AppShell title="Scholar / trainee intake" activeHref="/forms/scholar">
        <p className="text-slate-600">No sample record found.</p>
      </AppShell>
    );
  }

  const d = displayValues(row);
  const isEdit = id > 0;

  return (
    <AppShell
      title={isEdit ? "Edit scholar / trainee" : "Scholar / trainee intake"}
      subtitle="Step through sections at your own pace — timelines stay structured for annual reporting."
      activeHref="/forms/scholar"
    >
      <div className="form-shell form-preview">
        <div className="form-shell-header">
          <h2 className="font-display text-2xl font-bold text-cpbh-navy">
            {isEdit ? "Update record" : "New scholar or trainee"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Fields marked * appear on RPPR Table 1a. Dates use YYYY-MM-DD.
          </p>
        </div>
        <div className="form-shell-body space-y-6">
          <FormSection title="Identity & affiliation" description="Who they are and where they train.">
            <Field label="Last name" name="last_name" required>
              <input id="last_name" disabled value={d.last_name} />
            </Field>
            <Field label="First name" name="first_name" required>
              <input id="first_name" disabled value={d.first_name} />
            </Field>
            <Field label="Email" name="email">
              <input id="email" type="email" disabled value={d.email} />
            </Field>
            <Field label="Department / school" name="department">
              <input id="department" disabled value={d.department} />
            </Field>
            <Field label="Cohort / training year" name="cohort_year">
              <input id="cohort_year" disabled value={d.cohort_year} />
            </Field>
            <Field label="Current or past" name="current_or_past" required>
              <select id="current_or_past" disabled value={d.current_or_past}>
                <option>Current</option>
                <option>Past</option>
              </select>
            </Field>
            <Field label="Scholar or trainee" name="scholar_or_trainee" required>
              <select id="scholar_or_trainee" disabled value={d.scholar_or_trainee}>
                <option>Scholar</option>
                <option>Trainee</option>
              </select>
            </Field>
            <Field label="Level of training" name="training_level">
              <input id="training_level" disabled value={d.training_level} />
            </Field>
          </FormSection>
          <FormSection title="Research & RPPR progress">
            <Field label="Area of research" name="research_area" span2>
              <textarea id="research_area" rows={3} disabled value={d.research_area} />
            </Field>
            <Field label="Progress" name="progress" span2>
              <textarea id="progress" rows={3} disabled value={d.progress} />
            </Field>
            <Field label="ADRC affiliated?" name="adrc_affiliated">
              <select id="adrc_affiliated" disabled value={d.adrc_affiliated}>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </Field>
            <Field label="ADRD field?" name="adrd_field">
              <select id="adrd_field" disabled value={d.adrd_field}>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </Field>
          </FormSection>
          <FormSection title="Mentorship">
            <Field label="Mentor(s)" name="mentors" span2>
              <textarea id="mentors" rows={2} disabled value={d.mentors} />
            </Field>
            <Field label="Primary preceptor" name="primary_preceptor">
              <input id="primary_preceptor" disabled value={d.primary_preceptor} />
            </Field>
            <Field label="Mentorship start" name="mentorship_start_date">
              <input id="mentorship_start_date" type="date" disabled value={d.mentorship_start_date} />
            </Field>
            <Field label="Mentorship end" name="mentorship_end_date">
              <input id="mentorship_end_date" type="date" disabled value={d.mentorship_end_date} />
            </Field>
          </FormSection>
          <FormSection title="Project">
            <Field label="Project title" name="project_title" span2>
              <input id="project_title" disabled value={d.project_title} />
            </Field>
            <Field label="Project description" name="project_description" span2>
              <textarea id="project_description" rows={3} disabled value={d.project_description} />
            </Field>
            <Field label="Project start" name="project_start_date">
              <input id="project_start_date" type="date" disabled value={d.project_start_date} />
            </Field>
            <Field label="Project end" name="project_end_date">
              <input id="project_end_date" type="date" disabled value={d.project_end_date} />
            </Field>
          </FormSection>
          <FormSection title="Grant timeline">
            <Field label="Mechanism" name="grant_mechanism">
              <input id="grant_mechanism" disabled value={d.grant_mechanism} />
            </Field>
            <Field label="Grant number" name="grant_number">
              <input id="grant_number" disabled value={d.grant_number} />
            </Field>
            <Field label="Grant title" name="grant_name" span2>
              <input id="grant_name" disabled value={d.grant_name} />
            </Field>
            <Field label="Grant start" name="grant_start_date">
              <input id="grant_start_date" type="date" disabled value={d.grant_start_date} />
            </Field>
            <Field label="Grant end" name="grant_end_date">
              <input id="grant_end_date" type="date" disabled value={d.grant_end_date} />
            </Field>
          </FormSection>
          <FormSection title="Budget">
            <Field label="Total budget (USD)" name="budget_total">
              <input id="budget_total" type="number" disabled value={d.budget_total} />
            </Field>
            <Field label="Annual budget (USD)" name="budget_annual">
              <input id="budget_annual" type="number" disabled value={d.budget_annual} />
            </Field>
            <Field label="Fiscal year" name="budget_fiscal_year">
              <input id="budget_fiscal_year" disabled value={d.budget_fiscal_year} />
            </Field>
            <Field label="Notes" name="notes" span2>
              <textarea id="notes" rows={2} disabled value={d.notes} />
            </Field>
          </FormSection>
        </div>
        <PreviewFormFooter />
      </div>
    </AppShell>
  );
}
