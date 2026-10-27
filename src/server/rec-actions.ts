"use server";

import { revalidatePath } from "next/cache";
import {
  deleteFaculty,
  deleteProgram,
  deleteScholar,
  saveIntakeRows,
  updateFaculty,
  updateProgram,
  updateScholar,
  type EventInsert,
  type FacultyInsert,
  type ProgramInsert,
  type ScholarInsert,
} from "@/lib/db";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function emptyToNull(value: string) {
  return value ? value : null;
}

function yesNo(value: string): number | null {
  if (value === "Yes") return 1;
  if (value === "No") return 0;
  return null;
}

function money(value: string): number | null {
  if (!value) return null;
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

function anyText(formData: FormData, keys: string[]) {
  return keys.some((key) => text(formData, key) !== "");
}

const personKeys = [
  "last_name",
  "first_name",
  "email",
  "department",
  "cohort_year",
  "current_or_past",
  "scholar_or_trainee",
  "training_level",
  "research_area",
  "progress",
  "adrc_affiliated",
  "adrd_field",
  "mentors",
  "primary_preceptor",
  "mentorship_start_date",
  "mentorship_end_date",
  "project_title",
  "project_description",
  "project_start_date",
  "project_end_date",
  "grant_mechanism",
  "grant_number",
  "grant_name",
  "grant_start_date",
  "grant_end_date",
  "budget_total",
  "budget_annual",
  "budget_fiscal_year",
  "notes",
];

const facultyKeys = [
  "faculty_last_name",
  "faculty_first_name",
  "title",
  "faculty_email",
  "institution_department",
  "theme",
  "executive_committee",
  "faculty_research_area",
  "mentor_active_start",
  "mentor_active_end",
];

const programKeys = [
  "program",
  "trainees_per_year",
  "minority_researchers",
  "focus",
  "preceptor",
  "program_start",
  "program_end",
];

const eventKeys = ["event_title", "event_description", "attendance", "platform", "event_other"];

function scholarFromForm(formData: FormData): ScholarInsert {
  return {
    last_name: text(formData, "last_name"),
    first_name: text(formData, "first_name"),
    email: emptyToNull(text(formData, "email")),
    department: emptyToNull(text(formData, "department")),
    cohort_year: emptyToNull(text(formData, "cohort_year")),
    current_or_past: text(formData, "current_or_past"),
    scholar_or_trainee: text(formData, "scholar_or_trainee"),
    training_level: emptyToNull(text(formData, "training_level")),
    research_area: emptyToNull(text(formData, "research_area")),
    progress: emptyToNull(text(formData, "progress")),
    adrc_affiliated: yesNo(text(formData, "adrc_affiliated")),
    adrd_field: yesNo(text(formData, "adrd_field")),
    mentors: emptyToNull(text(formData, "mentors")),
    primary_preceptor: emptyToNull(text(formData, "primary_preceptor")),
    project_title: emptyToNull(text(formData, "project_title")),
    project_description: emptyToNull(text(formData, "project_description")),
    project_start_date: emptyToNull(text(formData, "project_start_date")),
    project_end_date: emptyToNull(text(formData, "project_end_date")),
    mentorship_start_date: emptyToNull(text(formData, "mentorship_start_date")),
    mentorship_end_date: emptyToNull(text(formData, "mentorship_end_date")),
    grant_name: emptyToNull(text(formData, "grant_name")),
    grant_number: emptyToNull(text(formData, "grant_number")),
    grant_mechanism: emptyToNull(text(formData, "grant_mechanism")),
    grant_start_date: emptyToNull(text(formData, "grant_start_date")),
    grant_end_date: emptyToNull(text(formData, "grant_end_date")),
    budget_total: money(text(formData, "budget_total")),
    budget_annual: money(text(formData, "budget_annual")),
    budget_fiscal_year: emptyToNull(text(formData, "budget_fiscal_year")),
    notes: emptyToNull(text(formData, "notes")),
  };
}

function facultyFromForm(formData: FormData): FacultyInsert & { notes: string | null } {
  return {
    last_name: text(formData, "faculty_last_name"),
    first_name: text(formData, "faculty_first_name"),
    title: emptyToNull(text(formData, "title")),
    institution_department: emptyToNull(text(formData, "institution_department")),
    theme: emptyToNull(text(formData, "theme")),
    research_area: emptyToNull(text(formData, "faculty_research_area")),
    executive_committee: text(formData, "executive_committee") === "Yes" ? 1 : 0,
    email: emptyToNull(text(formData, "faculty_email")),
    mentor_active_start: emptyToNull(text(formData, "mentor_active_start")),
    mentor_active_end: emptyToNull(text(formData, "mentor_active_end")),
    notes: emptyToNull(text(formData, "notes")),
  };
}

function programFromForm(formData: FormData): ProgramInsert & { notes: string | null } {
  return {
    program: text(formData, "program"),
    trainees_per_year: emptyToNull(text(formData, "trainees_per_year")),
    minority_researchers: emptyToNull(text(formData, "minority_researchers")),
    focus: emptyToNull(text(formData, "focus")),
    preceptor: emptyToNull(text(formData, "preceptor")),
    program_start: emptyToNull(text(formData, "program_start")),
    program_end: emptyToNull(text(formData, "program_end")),
    notes: emptyToNull(text(formData, "notes")),
  };
}

function refreshRoster() {
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/views");
  revalidatePath("/rppr");
}

function liveOnly(): { error: string } | null {
  if (process.env.NEXT_PUBLIC_STATIC_SITE === "1") {
    return { error: "Editing is available when the app is running locally with the database." };
  }
  return null;
}

export async function updateScholarRecord(id: number, formData: FormData): Promise<{ error: string } | { ok: true }> {
  const blocked = liveOnly();
  if (blocked) return blocked;
  const scholar = scholarFromForm(formData);
  if (!scholar.first_name && !scholar.last_name) {
    return { error: "Enter a first or last name." };
  }
  try {
    if (!updateScholar(id, scholar)) return { error: "That person is no longer in the database." };
    refreshRoster();
    return { ok: true };
  } catch {
    return { error: "Could not save the change." };
  }
}

export async function deleteScholarRecord(id: number): Promise<{ error: string } | { ok: true }> {
  const blocked = liveOnly();
  if (blocked) return blocked;
  try {
    if (!deleteScholar(id)) return { error: "That person is no longer in the database." };
    refreshRoster();
    return { ok: true };
  } catch {
    return { error: "Could not delete that person." };
  }
}

export async function updateFacultyRecord(id: number, formData: FormData): Promise<{ error: string } | { ok: true }> {
  const blocked = liveOnly();
  if (blocked) return blocked;
  const faculty = facultyFromForm(formData);
  if (!faculty.first_name && !faculty.last_name) {
    return { error: "Enter a first or last name." };
  }
  try {
    if (!updateFaculty(id, faculty)) return { error: "That faculty member is no longer in the database." };
    refreshRoster();
    return { ok: true };
  } catch {
    return { error: "Could not save the change." };
  }
}

export async function deleteFacultyRecord(id: number): Promise<{ error: string } | { ok: true }> {
  const blocked = liveOnly();
  if (blocked) return blocked;
  try {
    if (!deleteFaculty(id)) return { error: "That faculty member is no longer in the database." };
    refreshRoster();
    return { ok: true };
  } catch {
    return { error: "Could not delete that faculty member." };
  }
}

export async function updateProgramRecord(id: number, formData: FormData): Promise<{ error: string } | { ok: true }> {
  const blocked = liveOnly();
  if (blocked) return blocked;
  const program = programFromForm(formData);
  if (!program.program) return { error: "Enter a program name." };
  try {
    if (!updateProgram(id, program)) return { error: "That program is no longer in the database." };
    refreshRoster();
    return { ok: true };
  } catch {
    return { error: "Could not save the change." };
  }
}

export async function deleteProgramRecord(id: number): Promise<{ error: string } | { ok: true }> {
  const blocked = liveOnly();
  if (blocked) return blocked;
  try {
    if (!deleteProgram(id)) return { error: "That program is no longer in the database." };
    refreshRoster();
    return { ok: true };
  } catch {
    return { error: "Could not delete that program." };
  }
}

export async function saveIntake(formData: FormData): Promise<{ error: string } | { href: string }> {
  if (process.env.NEXT_PUBLIC_STATIC_SITE === "1") {
    return { error: "Saving is available when the app is running locally with the database." };
  }

  const scholar: ScholarInsert | null = anyText(formData, personKeys) ? scholarFromForm(formData) : null;
  const faculty: FacultyInsert | null = anyText(formData, facultyKeys) ? facultyFromForm(formData) : null;
  const draftedProgram = anyText(formData, programKeys) ? programFromForm(formData) : null;
  const program: ProgramInsert | null = draftedProgram
    ? { ...draftedProgram, program: draftedProgram.program || "New program" }
    : null;

  const event: EventInsert | null = anyText(formData, eventKeys)
    ? {
        event_title: text(formData, "event_title") || text(formData, "event_description") || "New event",
        event_description: emptyToNull(text(formData, "event_description")),
        attendance: emptyToNull(text(formData, "attendance")),
        platform: emptyToNull(text(formData, "platform")),
        event_other: emptyToNull(text(formData, "event_other")),
      }
    : null;

  if (!scholar && !faculty && !program && !event) {
    return { error: "Enter a name, a program, or an event before submitting." };
  }

  try {
    const saved = saveIntakeRows({ scholar, faculty, program, event });
    refreshRoster();
    const label = saved.join(", ");
    const href =
      saved.length === 1 && saved[0] === "event"
        ? `/rppr?saved=${encodeURIComponent(label)}`
        : `/dashboard?saved=${encodeURIComponent(label)}`;
    return { href };
  } catch {
    return { error: "Could not save to the database. Try again." };
  }
}

export async function saveScholar(_formData: FormData) {
  throw new Error("Use the intake form to add a scholar or trainee.");
}

export async function saveFaculty(_formData: FormData) {
  throw new Error("Use the intake form to add faculty.");
}

export async function saveProgram(_formData: FormData) {
  throw new Error("Use the intake form to add a program.");
}

export async function exportCsvAction() {
  throw new Error("Export from Views or RPPR.");
}

export async function syncDashboardAction() {
  throw new Error("The dashboard reads the database directly.");
}

export async function saveReportSnapshot(_formData: FormData) {
  throw new Error("Not available.");
}
