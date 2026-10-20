import AppShell from "@/components/AppShell";
import FormSection, { Field } from "@/components/FormSection";
import PreviewFormFooter from "@/components/PreviewFormFooter";
import { displayScholarValues } from "@/lib/scholar-display";
import type { ScholarRow } from "@/lib/types";

export default function ScholarFormPreviewServer({
  row,
  mode,
}: {
  row: ScholarRow;
  mode: "new" | "edit";
}) {
  const d = displayScholarValues(row);
  const isEdit = mode === "edit";

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
              <input id="last_name" readOnly value={d.last_name} />
            </Field>
            <Field label="First name" name="first_name" required>
              <input id="first_name" readOnly value={d.first_name} />
            </Field>
            <Field label="Email" name="email">
              <input id="email" type="email" readOnly value={d.email} />
            </Field>
            <Field label="Department / school" name="department">
              <input id="department" readOnly value={d.department} />
            </Field>
            <Field label="Cohort / training year" name="cohort_year">
              <input id="cohort_year" readOnly value={d.cohort_year} />
            </Field>
            <Field label="Current or past" name="current_or_past" required>
              <select id="current_or_past" disabled defaultValue={d.current_or_past}>
                <option>Current</option>
                <option>Past</option>
              </select>
            </Field>
            <Field label="Scholar or trainee" name="scholar_or_trainee" required>
              <select id="scholar_or_trainee" disabled defaultValue={d.scholar_or_trainee}>
                <option>Scholar</option>
                <option>Trainee</option>
              </select>
            </Field>
            <Field label="Level of training" name="training_level">
              <input id="training_level" readOnly value={d.training_level} />
            </Field>
          </FormSection>
          <FormSection title="Research & RPPR progress">
            <Field label="Area of research" name="research_area" span2>
              <textarea id="research_area" rows={3} readOnly value={d.research_area} />
            </Field>
            <Field label="Progress" name="progress" span2>
              <textarea id="progress" rows={3} readOnly value={d.progress} />
            </Field>
            <Field label="ADRC affiliated?" name="adrc_affiliated">
              <select id="adrc_affiliated" disabled defaultValue={d.adrc_affiliated}>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </Field>
            <Field label="ADRD field?" name="adrd_field">
              <select id="adrd_field" disabled defaultValue={d.adrd_field}>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </Field>
          </FormSection>
          <FormSection title="Mentorship">
            <Field label="Mentor(s)" name="mentors" span2>
              <textarea id="mentors" rows={2} readOnly value={d.mentors} />
            </Field>
            <Field label="Primary preceptor" name="primary_preceptor">
              <input id="primary_preceptor" readOnly value={d.primary_preceptor} />
            </Field>
            <Field label="Mentorship start" name="mentorship_start_date">
              <input id="mentorship_start_date" type="date" readOnly value={d.mentorship_start_date} />
            </Field>
            <Field label="Mentorship end" name="mentorship_end_date">
              <input id="mentorship_end_date" type="date" readOnly value={d.mentorship_end_date} />
            </Field>
          </FormSection>
          <FormSection title="Project">
            <Field label="Project title" name="project_title" span2>
              <input id="project_title" readOnly value={d.project_title} />
            </Field>
            <Field label="Project description" name="project_description" span2>
              <textarea id="project_description" rows={3} readOnly value={d.project_description} />
            </Field>
            <Field label="Project start" name="project_start_date">
              <input id="project_start_date" type="date" readOnly value={d.project_start_date} />
            </Field>
            <Field label="Project end" name="project_end_date">
              <input id="project_end_date" type="date" readOnly value={d.project_end_date} />
            </Field>
          </FormSection>
          <FormSection title="Grant timeline">
            <Field label="Mechanism" name="grant_mechanism">
              <input id="grant_mechanism" readOnly value={d.grant_mechanism} />
            </Field>
            <Field label="Grant number" name="grant_number">
              <input id="grant_number" readOnly value={d.grant_number} />
            </Field>
            <Field label="Grant title" name="grant_name" span2>
              <input id="grant_name" readOnly value={d.grant_name} />
            </Field>
            <Field label="Grant start" name="grant_start_date">
              <input id="grant_start_date" type="date" readOnly value={d.grant_start_date} />
            </Field>
            <Field label="Grant end" name="grant_end_date">
              <input id="grant_end_date" type="date" readOnly value={d.grant_end_date} />
            </Field>
          </FormSection>
          <FormSection title="Budget">
            <Field label="Total budget (USD)" name="budget_total">
              <input id="budget_total" type="number" readOnly value={d.budget_total} />
            </Field>
            <Field label="Annual budget (USD)" name="budget_annual">
              <input id="budget_annual" type="number" readOnly value={d.budget_annual} />
            </Field>
            <Field label="Fiscal year" name="budget_fiscal_year">
              <input id="budget_fiscal_year" readOnly value={d.budget_fiscal_year} />
            </Field>
            <Field label="Notes" name="notes" span2>
              <textarea id="notes" rows={2} readOnly value={d.notes} />
            </Field>
          </FormSection>
        </div>
        <PreviewFormFooter />
      </div>
    </AppShell>
  );
}
