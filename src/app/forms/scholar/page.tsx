import Link from "next/link";
import AppShell from "@/components/AppShell";
import FormSection, { Field } from "@/components/FormSection";
import { saveScholar } from "@/app/actions";
import { getScholar } from "@/lib/db";

export default function ScholarFormPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const id = parseInt(searchParams.id ?? "0", 10);
  const row = id > 0 ? getScholar(id) : undefined;

  const v = (key: keyof NonNullable<typeof row>) =>
    row ? String(row[key] ?? "") : "";

  return (
    <AppShell
      title={id ? "Edit scholar / trainee" : "Scholar / trainee intake"}
      subtitle="Step through sections at your own pace — timelines stay structured for annual reporting."
      activeHref="/forms/scholar"
    >
      <form action={saveScholar} className="form-shell">
        <input type="hidden" name="id" value={id || ""} />
        <div className="form-shell-header">
          <h2 className="font-display text-2xl font-bold text-cpbh-navy">
            {id ? "Update record" : "New scholar or trainee"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Fields marked * appear on RPPR Table 1a. Dates use YYYY-MM-DD.
          </p>
        </div>
        <div className="form-shell-body space-y-6">

        <FormSection title="Identity & affiliation" description="Who they are and where they train.">
          <Field label="Last name" name="last_name" required>
            <input id="last_name" name="last_name" required defaultValue={v("last_name")} />
          </Field>
          <Field label="First name" name="first_name" required>
            <input id="first_name" name="first_name" required defaultValue={v("first_name")} />
          </Field>
          <Field label="Email" name="email">
            <input id="email" name="email" type="email" defaultValue={v("email")} />
          </Field>
          <Field label="Department / school" name="department">
            <input id="department" name="department" defaultValue={v("department")} />
          </Field>
          <Field label="Cohort / training year" name="cohort_year">
            <input id="cohort_year" name="cohort_year" placeholder="2025–2026" defaultValue={v("cohort_year")} />
          </Field>
          <Field label="Current or past" name="current_or_past" required>
            <select id="current_or_past" name="current_or_past" defaultValue={row?.current_or_past ?? "Current"}>
              <option>Current</option>
              <option>Past</option>
            </select>
          </Field>
          <Field label="Scholar or trainee" name="scholar_or_trainee" required>
            <select id="scholar_or_trainee" name="scholar_or_trainee" defaultValue={row?.scholar_or_trainee ?? "Scholar"}>
              <option>Scholar</option>
              <option>Trainee</option>
            </select>
          </Field>
          <Field label="Level of training" name="training_level">
            <input id="training_level" name="training_level" defaultValue={v("training_level")} />
          </Field>
        </FormSection>

        <FormSection title="Research & RPPR progress">
          <Field label="Area of research" name="research_area" span2>
            <textarea id="research_area" name="research_area" rows={3} defaultValue={v("research_area")} />
          </Field>
          <Field label="Progress" name="progress" span2>
            <textarea id="progress" name="progress" rows={3} defaultValue={v("progress")} />
          </Field>
          <Field label="ADRC affiliated?" name="adrc_affiliated">
            <select id="adrc_affiliated" name="adrc_affiliated" defaultValue={row?.adrc_affiliated === 0 ? "0" : "1"}>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </Field>
          <Field label="ADRD field?" name="adrd_field">
            <select id="adrd_field" name="adrd_field" defaultValue={row?.adrd_field === 0 ? "0" : "1"}>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </Field>
        </FormSection>

        <FormSection title="Mentorship">
          <Field label="Mentor(s)" name="mentors" span2>
            <textarea id="mentors" name="mentors" rows={2} defaultValue={v("mentors")} />
          </Field>
          <Field label="Primary preceptor" name="primary_preceptor">
            <input id="primary_preceptor" name="primary_preceptor" defaultValue={v("primary_preceptor")} />
          </Field>
          <Field label="Mentorship start" name="mentorship_start_date">
            <input id="mentorship_start_date" name="mentorship_start_date" type="date" defaultValue={v("mentorship_start_date")} />
          </Field>
          <Field label="Mentorship end" name="mentorship_end_date">
            <input id="mentorship_end_date" name="mentorship_end_date" type="date" defaultValue={v("mentorship_end_date")} />
          </Field>
        </FormSection>

        <FormSection title="Project">
          <Field label="Project title" name="project_title" span2>
            <input id="project_title" name="project_title" defaultValue={v("project_title")} />
          </Field>
          <Field label="Project description" name="project_description" span2>
            <textarea id="project_description" name="project_description" rows={3} defaultValue={v("project_description")} />
          </Field>
          <Field label="Project start" name="project_start_date">
            <input id="project_start_date" name="project_start_date" type="date" defaultValue={v("project_start_date")} />
          </Field>
          <Field label="Project end" name="project_end_date">
            <input id="project_end_date" name="project_end_date" type="date" defaultValue={v("project_end_date")} />
          </Field>
        </FormSection>

        <FormSection title="Grant timeline">
          <Field label="Mechanism" name="grant_mechanism">
            <input id="grant_mechanism" name="grant_mechanism" placeholder="K99, F31, KL2…" defaultValue={v("grant_mechanism")} />
          </Field>
          <Field label="Grant number" name="grant_number">
            <input id="grant_number" name="grant_number" defaultValue={v("grant_number")} />
          </Field>
          <Field label="Grant title" name="grant_name" span2>
            <input id="grant_name" name="grant_name" defaultValue={v("grant_name")} />
          </Field>
          <Field label="Grant start" name="grant_start_date">
            <input id="grant_start_date" name="grant_start_date" type="date" defaultValue={v("grant_start_date")} />
          </Field>
          <Field label="Grant end" name="grant_end_date">
            <input id="grant_end_date" name="grant_end_date" type="date" defaultValue={v("grant_end_date")} />
          </Field>
        </FormSection>

        <FormSection title="Budget">
          <Field label="Total budget (USD)" name="budget_total">
            <input id="budget_total" name="budget_total" type="number" step="0.01" defaultValue={v("budget_total")} />
          </Field>
          <Field label="Annual budget (USD)" name="budget_annual">
            <input id="budget_annual" name="budget_annual" type="number" step="0.01" defaultValue={v("budget_annual")} />
          </Field>
          <Field label="Fiscal year" name="budget_fiscal_year">
            <input id="budget_fiscal_year" name="budget_fiscal_year" placeholder="FY2026" defaultValue={v("budget_fiscal_year")} />
          </Field>
          <Field label="Notes" name="notes" span2>
            <textarea id="notes" name="notes" rows={2} defaultValue={v("notes")} />
          </Field>
        </FormSection>

        </div>
        <div className="flex flex-wrap gap-3 border-t border-slate-100 bg-slate-50/80 px-6 py-5 sm:px-8">
          <button type="submit" className="btn-primary">
            Save record
          </button>
          <Link href="/dashboard" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </AppShell>
  );
}
