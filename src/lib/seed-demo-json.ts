import fs from "fs";
import path from "path";
import type Database from "better-sqlite3";
import type { FacultyRow, ProgramRow, ScholarRow } from "./types";

type DemoRoster = {
  scholars: ScholarRow[];
  faculty: FacultyRow[];
  programs: ProgramRow[];
};

export function seedFromDemoJson(database: Database.Database) {
  const jsonPath = path.join(process.cwd(), "src/data/demo-roster.json");
  if (!fs.existsSync(jsonPath)) return false;

  const roster = JSON.parse(fs.readFileSync(jsonPath, "utf-8")) as DemoRoster;

  const insFac = database.prepare(`
    INSERT INTO faculty (
      id, last_name, first_name, title, institution_department, theme, research_area,
      executive_committee, email, mentor_active_start, mentor_active_end, notes,
      created_at, updated_at
    ) VALUES (
      @id, @last_name, @first_name, @title, @institution_department, @theme, @research_area,
      @executive_committee, @email, @mentor_active_start, @mentor_active_end, @notes,
      @created_at, @updated_at
    )
  `);
  for (const r of roster.faculty) {
    insFac.run({
      ...r,
      email: r.email ?? null,
      mentor_active_start: r.mentor_active_start ?? null,
      mentor_active_end: r.mentor_active_end ?? null,
      notes: r.notes ?? "",
    });
  }

  const insProg = database.prepare(`
    INSERT INTO training_programs (
      id, program, trainees_per_year, minority_researchers, focus, preceptor,
      program_start, program_end, notes, created_at, updated_at
    ) VALUES (
      @id, @program, @trainees_per_year, @minority_researchers, @focus, @preceptor,
      @program_start, @program_end, @notes, @created_at, @updated_at
    )
  `);
  for (const r of roster.programs) {
    insProg.run({
      ...r,
      program_start: r.program_start ?? null,
      program_end: r.program_end ?? null,
      notes: r.notes ?? "",
    });
  }

  const insSch = database.prepare(`
    INSERT INTO scholars_trainees (
      id, last_name, first_name, email, department, cohort_year, current_or_past,
      scholar_or_trainee, training_level, research_area, progress, adrc_affiliated,
      adrd_field, mentors, primary_preceptor, project_title, project_description,
      project_start_date, project_end_date, mentorship_start_date, mentorship_end_date,
      grant_name, grant_number, grant_mechanism, grant_start_date, grant_end_date,
      budget_total, budget_annual, budget_fiscal_year, notes, form_status,
      created_at, updated_at
    ) VALUES (
      @id, @last_name, @first_name, @email, @department, @cohort_year, @current_or_past,
      @scholar_or_trainee, @training_level, @research_area, @progress, @adrc_affiliated,
      @adrd_field, @mentors, @primary_preceptor, @project_title, @project_description,
      @project_start_date, @project_end_date, @mentorship_start_date, @mentorship_end_date,
      @grant_name, @grant_number, @grant_mechanism, @grant_start_date, @grant_end_date,
      @budget_total, @budget_annual, @budget_fiscal_year, @notes, @form_status,
      @created_at, @updated_at
    )
  `);
  for (const r of roster.scholars) {
    insSch.run({
      ...r,
      email: r.email ?? null,
      department: r.department ?? null,
      cohort_year: r.cohort_year ?? null,
      training_level: r.training_level ?? null,
      research_area: r.research_area ?? null,
      progress: r.progress ?? null,
      mentors: r.mentors ?? null,
      primary_preceptor: r.primary_preceptor ?? null,
      project_title: r.project_title ?? null,
      project_description: r.project_description ?? null,
      project_start_date: r.project_start_date ?? null,
      project_end_date: r.project_end_date ?? null,
      mentorship_start_date: r.mentorship_start_date ?? null,
      mentorship_end_date: r.mentorship_end_date ?? null,
      grant_name: r.grant_name ?? null,
      grant_number: r.grant_number ?? null,
      grant_mechanism: r.grant_mechanism ?? null,
      grant_start_date: r.grant_start_date ?? null,
      grant_end_date: r.grant_end_date ?? null,
      budget_total: r.budget_total ?? null,
      budget_annual: r.budget_annual ?? null,
      budget_fiscal_year: r.budget_fiscal_year ?? null,
      notes: r.notes ?? "",
      form_status: r.form_status ?? "submitted",
    });
  }

  database.exec(`
    UPDATE sqlite_sequence SET seq = (SELECT COALESCE(MAX(id), 0) FROM faculty) WHERE name = 'faculty';
    UPDATE sqlite_sequence SET seq = (SELECT COALESCE(MAX(id), 0) FROM training_programs) WHERE name = 'training_programs';
    UPDATE sqlite_sequence SET seq = (SELECT COALESCE(MAX(id), 0) FROM scholars_trainees) WHERE name = 'scholars_trainees';
  `);

  return true;
}
