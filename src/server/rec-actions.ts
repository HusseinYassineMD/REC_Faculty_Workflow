"use server";

import { execFile } from "child_process";
import { promisify } from "util";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { AGGREGATE_SCRIPT, CLINICAL_CORE_ROOT } from "@/lib/paths";
import { writeClinicalCsvs, saveSnapshot } from "@/lib/rppr-export";

const execFileAsync = promisify(execFile);

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

function bool(fd: FormData, key: string): number {
  const v = str(fd, key);
  return v === "1" || v.toLowerCase() === "yes" || v === "on" ? 1 : 0;
}

function numOrNull(fd: FormData, key: string): number | null {
  const v = str(fd, key);
  if (v === "") return null;
  const n = parseFloat(v);
  return Number.isNaN(n) ? null : n;
}

export async function saveScholar(formData: FormData) {
  const id = parseInt(str(formData, "id"), 10);
  const payload = {
    last_name: str(formData, "last_name"),
    first_name: str(formData, "first_name"),
    email: str(formData, "email"),
    department: str(formData, "department"),
    cohort_year: str(formData, "cohort_year"),
    current_or_past: str(formData, "current_or_past") || "Current",
    scholar_or_trainee: str(formData, "scholar_or_trainee") || "Scholar",
    training_level: str(formData, "training_level"),
    research_area: str(formData, "research_area"),
    progress: str(formData, "progress"),
    adrc_affiliated: bool(formData, "adrc_affiliated"),
    adrd_field: bool(formData, "adrd_field"),
    mentors: str(formData, "mentors"),
    primary_preceptor: str(formData, "primary_preceptor"),
    project_title: str(formData, "project_title"),
    project_description: str(formData, "project_description"),
    project_start_date: str(formData, "project_start_date"),
    project_end_date: str(formData, "project_end_date"),
    mentorship_start_date: str(formData, "mentorship_start_date"),
    mentorship_end_date: str(formData, "mentorship_end_date"),
    grant_name: str(formData, "grant_name"),
    grant_number: str(formData, "grant_number"),
    grant_mechanism: str(formData, "grant_mechanism"),
    grant_start_date: str(formData, "grant_start_date"),
    grant_end_date: str(formData, "grant_end_date"),
    budget_total: numOrNull(formData, "budget_total"),
    budget_annual: numOrNull(formData, "budget_annual"),
    budget_fiscal_year: str(formData, "budget_fiscal_year"),
    notes: str(formData, "notes"),
    form_status: "submitted",
    updated_at: new Date().toISOString().slice(0, 19).replace("T", " "),
  };

  if (!payload.last_name || !payload.first_name) {
    throw new Error("Name required");
  }

  const db = getDb();
  if (id > 0) {
    const cols = Object.keys(payload);
    db.prepare(
      `UPDATE scholars_trainees SET ${cols.map((c) => `${c} = @${c}`).join(", ")} WHERE id = @id`
    ).run({ ...payload, id });
  } else {
    const cols = Object.keys(payload);
    db.prepare(
      `INSERT INTO scholars_trainees (${cols.join(", ")}) VALUES (${cols.map((c) => `@${c}`).join(", ")})`
    ).run(payload);
  }

  revalidatePath("/dashboard");
  redirect("/dashboard?saved=scholar");
}

export async function saveFaculty(formData: FormData) {
  const id = parseInt(str(formData, "id"), 10);
  const payload = {
    last_name: str(formData, "last_name"),
    first_name: str(formData, "first_name"),
    title: str(formData, "title"),
    institution_department: str(formData, "institution_department"),
    theme: str(formData, "theme"),
    research_area: str(formData, "research_area"),
    executive_committee: bool(formData, "executive_committee"),
    email: str(formData, "email"),
    mentor_active_start: str(formData, "mentor_active_start"),
    mentor_active_end: str(formData, "mentor_active_end"),
    notes: str(formData, "notes"),
    updated_at: new Date().toISOString().slice(0, 19).replace("T", " "),
  };
  const db = getDb();
  if (id > 0) {
    const cols = Object.keys(payload);
    db.prepare(
      `UPDATE faculty SET ${cols.map((c) => `${c} = @${c}`).join(", ")} WHERE id = @id`
    ).run({ ...payload, id });
  } else {
    const cols = Object.keys(payload);
    db.prepare(
      `INSERT INTO faculty (${cols.join(", ")}) VALUES (${cols.map((c) => `@${c}`).join(", ")})`
    ).run(payload);
  }
  revalidatePath("/dashboard");
  redirect("/dashboard?saved=faculty");
}

export async function saveProgram(formData: FormData) {
  const id = parseInt(str(formData, "id"), 10);
  const payload = {
    program: str(formData, "program"),
    trainees_per_year: str(formData, "trainees_per_year"),
    minority_researchers: str(formData, "minority_researchers"),
    focus: str(formData, "focus"),
    preceptor: str(formData, "preceptor"),
    program_start: str(formData, "program_start"),
    program_end: str(formData, "program_end"),
    notes: str(formData, "notes"),
    updated_at: new Date().toISOString().slice(0, 19).replace("T", " "),
  };
  const db = getDb();
  if (id > 0) {
    const cols = Object.keys(payload);
    db.prepare(
      `UPDATE training_programs SET ${cols.map((c) => `${c} = @${c}`).join(", ")} WHERE id = @id`
    ).run({ ...payload, id });
  } else {
    const cols = Object.keys(payload);
    db.prepare(
      `INSERT INTO training_programs (${cols.join(", ")}) VALUES (${cols.map((c) => `@${c}`).join(", ")})`
    ).run(payload);
  }
  revalidatePath("/dashboard");
  redirect("/dashboard?saved=program");
}

export async function exportCsvAction() {
  writeClinicalCsvs();
  revalidatePath("/dashboard");
  redirect("/dashboard?saved=export");
}

export async function syncDashboardAction() {
  writeClinicalCsvs();
  await execFileAsync("python3", [AGGREGATE_SCRIPT], { cwd: CLINICAL_CORE_ROOT });
  revalidatePath("/dashboard");
  redirect("/dashboard?saved=sync");
}

export async function saveReportSnapshot(formData: FormData) {
  const asOf = str(formData, "as_of") || new Date().toISOString().slice(0, 10);
  const year = str(formData, "reporting_year") || new Date().getFullYear().toString();
  saveSnapshot(asOf, year, `RPPR snapshot ${year}`);
  revalidatePath("/reports");
  redirect(`/reports?as_of=${encodeURIComponent(asOf)}&reporting_year=${encodeURIComponent(year)}&saved=1`);
}
