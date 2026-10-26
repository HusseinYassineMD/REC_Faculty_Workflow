"use client";

import Link from "next/link";
import FormSection, { Field, FieldRow } from "@/components/FormSection";
import { useDemoToast } from "@/components/DemoToast";
import {
  OPEN_QUESTIONS,
  SCHOLAR_DEFINITION,
  TRAINEE_DEFINITION,
} from "@/lib/rppr-standards";

export default function IntakeForm() {
  const { show, Toast } = useDemoToast();

  return (
    <>
      {Toast}
      <form
        className="form-shell"
        onSubmit={(event) => {
          event.preventDefault();
          show("Submitted. The sample roster stays as-is until the database save is connected.");
        }}
      >
        <div className="form-shell-header">
          <h2 className="font-display text-2xl font-bold text-cpbh-navy">REC intake</h2>
          <p className="mt-1 text-sm text-slate-500">
            One form for Table G1, Table G2, faculty, scholars, trainees, and programs. Every field is
            optional — enter only the sections you have.
          </p>
          <p className="mt-2 text-sm font-semibold text-cpbh-cardinal print:hidden">
            Text in red brackets are open questions to confirm with REC leadership.
          </p>
        </div>

        <div className="form-shell-body space-y-6">
          <FormSection
            title="Scholar / trainee"
            description="Fields that feed Table G1. Scholars and trainees use this same section."
          >
            <Field label="Last name" name="last_name">
              <input id="last_name" name="last_name" />
            </Field>
            <Field label="First name" name="first_name">
              <input id="first_name" name="first_name" />
            </Field>
            <Field label="Email" name="email">
              <input id="email" name="email" type="email" />
            </Field>
            <Field label="Department / school" name="department">
              <input id="department" name="department" />
            </Field>
            <Field label="Cohort / training year" name="cohort_year">
              <input id="cohort_year" name="cohort_year" placeholder="2025–2026" />
            </Field>
            <Field label="Current or past" name="current_or_past" question={OPEN_QUESTIONS.currentOrPast}>
              <select id="current_or_past" name="current_or_past" defaultValue="">
                <option value="">—</option>
                <option>Current</option>
                <option>Past</option>
              </select>
            </Field>
            <Field
              label="Scholar or trainee"
              name="scholar_or_trainee"
              question={OPEN_QUESTIONS.scholarOrTrainee}
              hint={`${SCHOLAR_DEFINITION} ${TRAINEE_DEFINITION}`}
            >
              <select id="scholar_or_trainee" name="scholar_or_trainee" defaultValue="">
                <option value="">—</option>
                <option>Scholar</option>
                <option>Trainee</option>
              </select>
            </Field>
            <Field label="Level of training" name="training_level">
              <input id="training_level" name="training_level" placeholder="PhD student or candidate" />
            </Field>
            <Field
              label="Area of research"
              name="research_area"
              span2
              question={OPEN_QUESTIONS.researchArea}
            >
              <textarea id="research_area" name="research_area" rows={3} />
            </Field>
            <Field label="Progress" name="progress" span2 question={OPEN_QUESTIONS.progress}>
              <textarea id="progress" name="progress" rows={3} />
            </Field>
            <Field
              label="Currently affiliated with an ADRC?"
              name="adrc_affiliated"
              question={OPEN_QUESTIONS.adrc}
            >
              <select id="adrc_affiliated" name="adrc_affiliated" defaultValue="">
                <option value="">—</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </Field>
            <Field
              label="Working / collaborating within the ADRD field?"
              name="adrd_field"
              question={OPEN_QUESTIONS.adrd}
            >
              <select id="adrd_field" name="adrd_field" defaultValue="">
                <option value="">—</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </Field>
            <FieldRow>
              <Field label="Mentor(s)" name="mentors">
                <textarea id="mentors" name="mentors" rows={2} />
              </Field>
              <Field label="Primary preceptor" name="primary_preceptor">
                <input id="primary_preceptor" name="primary_preceptor" />
              </Field>
            </FieldRow>
            <FieldRow>
              <Field label="Mentorship start" name="mentorship_start_date">
                <input id="mentorship_start_date" name="mentorship_start_date" type="date" />
              </Field>
              <Field label="Mentorship end" name="mentorship_end_date">
                <input id="mentorship_end_date" name="mentorship_end_date" type="date" />
              </Field>
            </FieldRow>
            <Field label="Project title" name="project_title" span2>
              <input id="project_title" name="project_title" />
            </Field>
            <Field label="Project description" name="project_description" span2>
              <textarea id="project_description" name="project_description" rows={3} />
            </Field>
            <Field label="Project start" name="project_start_date">
              <input id="project_start_date" name="project_start_date" type="date" />
            </Field>
            <Field label="Project end" name="project_end_date">
              <input id="project_end_date" name="project_end_date" type="date" />
            </Field>
            <Field label="Grant mechanism" name="grant_mechanism">
              <input id="grant_mechanism" name="grant_mechanism" placeholder="K99, F31, KL2…" />
            </Field>
            <Field label="Grant number" name="grant_number">
              <input id="grant_number" name="grant_number" />
            </Field>
            <Field label="Grant title" name="grant_name" span2>
              <input id="grant_name" name="grant_name" />
            </Field>
            <Field label="Grant start" name="grant_start_date">
              <input id="grant_start_date" name="grant_start_date" type="date" />
            </Field>
            <Field label="Grant end" name="grant_end_date">
              <input id="grant_end_date" name="grant_end_date" type="date" />
            </Field>
            <Field label="Total budget (USD)" name="budget_total">
              <input id="budget_total" name="budget_total" type="number" step="0.01" />
            </Field>
            <Field label="Annual budget (USD)" name="budget_annual">
              <input id="budget_annual" name="budget_annual" type="number" step="0.01" />
            </Field>
            <Field label="Fiscal year" name="budget_fiscal_year">
              <input id="budget_fiscal_year" name="budget_fiscal_year" placeholder="FY2026" />
            </Field>
            <Field label="Scholar / trainee notes" name="scholar_notes" span2>
              <textarea id="scholar_notes" name="scholar_notes" rows={2} />
            </Field>
          </FormSection>

          <FormSection
            title="Faculty"
            description="Participating REC faculty — title, department, theme, and research area."
          >
            <Field label="Last name" name="faculty_last_name">
              <input id="faculty_last_name" name="faculty_last_name" />
            </Field>
            <Field label="First name" name="faculty_first_name">
              <input id="faculty_first_name" name="faculty_first_name" />
            </Field>
            <Field label="Title" name="title">
              <input id="title" name="title" />
            </Field>
            <Field label="Email" name="faculty_email">
              <input id="faculty_email" name="faculty_email" type="email" />
            </Field>
            <Field label="Institution / department" name="institution_department" span2>
              <input id="institution_department" name="institution_department" />
            </Field>
            <Field label="Theme" name="theme">
              <input id="theme" name="theme" />
            </Field>
            <Field label="Executive committee" name="executive_committee">
              <select id="executive_committee" name="executive_committee" defaultValue="">
                <option value="">—</option>
                <option value="Yes">Yes (* on table)</option>
                <option value="No">No</option>
              </select>
            </Field>
            <Field label="Research area" name="faculty_research_area" span2>
              <textarea id="faculty_research_area" name="faculty_research_area" rows={3} />
            </Field>
            <FieldRow>
              <Field label="Mentor active from" name="mentor_active_start">
                <input id="mentor_active_start" name="mentor_active_start" type="date" />
              </Field>
              <Field label="Mentor active until" name="mentor_active_end">
                <input id="mentor_active_end" name="mentor_active_end" type="date" />
              </Field>
            </FieldRow>
            <Field label="Faculty notes" name="faculty_notes" span2>
              <textarea id="faculty_notes" name="faculty_notes" rows={2} />
            </Field>
          </FormSection>

          <FormSection
            title="Training program"
            description="ADRD and minority scholar programs — trainees per year, focus, and preceptor."
          >
            <Field label="Program name" name="program" span2>
              <input id="program" name="program" />
            </Field>
            <Field label="Post-doc trainees / year" name="trainees_per_year">
              <input id="trainees_per_year" name="trainees_per_year" />
            </Field>
            <Field label="% minority researchers" name="minority_researchers">
              <input id="minority_researchers" name="minority_researchers" />
            </Field>
            <Field label="Focus" name="focus" span2>
              <textarea id="focus" name="focus" rows={3} />
            </Field>
            <Field label="Preceptor" name="preceptor" span2>
              <input id="preceptor" name="preceptor" />
            </Field>
            <Field label="Program start" name="program_start">
              <input id="program_start" name="program_start" type="date" />
            </Field>
            <Field label="Program end" name="program_end">
              <input id="program_end" name="program_end" type="date" />
            </Field>
            <Field label="Program notes" name="program_notes" span2>
              <textarea id="program_notes" name="program_notes" rows={2} />
            </Field>
          </FormSection>

          <FormSection
            title="REC event"
            description="Fields that feed Table G2. One event per submission."
          >
            <Field label="Event, date(s), sponsors" name="event_title" span2>
              <textarea id="event_title" name="event_title" rows={3} />
            </Field>
            <Field label="Brief description, intended audience" name="event_description" span2>
              <textarea id="event_description" name="event_description" rows={3} />
            </Field>
            <Field label="Attendance" name="attendance">
              <input id="attendance" name="attendance" />
            </Field>
            <Field label="Platform, advertising, access" name="platform" span2>
              <textarea id="platform" name="platform" rows={3} />
            </Field>
            <Field label="Other information" name="event_other" span2>
              <textarea id="event_other" name="event_other" rows={3} />
            </Field>
          </FormSection>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-slate-100 bg-slate-50/80 px-6 py-5 sm:px-8">
          <button type="submit" className="btn-primary">
            Submit
          </button>
          <Link href="/dashboard" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
