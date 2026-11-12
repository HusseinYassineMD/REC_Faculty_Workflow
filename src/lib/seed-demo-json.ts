import fs from "fs";
import path from "path";
import type { SqlDb, SqlStatement } from "./sql-db";
import type { FacultyRow, ProgramRow, ScholarRow } from "./types";

type DemoRoster = {
  scholars: ScholarRow[];
  faculty: FacultyRow[];
  programs: ProgramRow[];
};

const INSERT_FACULTY = `
  INSERT INTO faculty (
    id, last_name, first_name, title, institution_department, theme, research_area,
    executive_committee, email, mentor_active_start, mentor_active_end, notes,
    created_at, updated_at
  ) VALUES (
    @id, @last_name, @first_name, @title, @institution_department, @theme, @research_area,
    @executive_committee, @email, @mentor_active_start, @mentor_active_end, @notes,
    @created_at, @updated_at
  )
`;

const INSERT_PROGRAM = `
  INSERT INTO training_programs (
    id, program, trainees_per_year, minority_researchers, focus, preceptor,
    program_start, program_end, notes, created_at, updated_at
  ) VALUES (
    @id, @program, @trainees_per_year, @minority_researchers, @focus, @preceptor,
    @program_start, @program_end, @notes, @created_at, @updated_at
  )
`;

const INSERT_SCHOLAR = `
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
`;

export async function seedFromDemoJson(database: SqlDb): Promise<boolean> {
  const jsonPath = path.join(process.cwd(), "src/data/demo-roster.json");
  if (!fs.existsSync(jsonPath)) return false;

  const roster = JSON.parse(fs.readFileSync(jsonPath, "utf-8")) as DemoRoster;
  const statements: SqlStatement[] = [];

  for (const row of roster.faculty) {
    statements.push({
      sql: INSERT_FACULTY,
      args: {
        ...row,
        email: row.email ?? null,
        mentor_active_start: row.mentor_active_start ?? null,
        mentor_active_end: row.mentor_active_end ?? null,
        notes: row.notes ?? "",
      },
    });
  }

  for (const row of roster.programs) {
    statements.push({
      sql: INSERT_PROGRAM,
      args: {
        ...row,
        program_start: row.program_start ?? null,
        program_end: row.program_end ?? null,
        notes: row.notes ?? "",
      },
    });
  }

  for (const row of roster.scholars) {
    statements.push({
      sql: INSERT_SCHOLAR,
      args: {
        ...row,
        email: row.email ?? null,
        department: row.department ?? null,
        cohort_year: row.cohort_year ?? null,
        training_level: row.training_level ?? null,
        research_area: row.research_area ?? null,
        progress: row.progress ?? null,
        mentors: row.mentors ?? null,
        primary_preceptor: row.primary_preceptor ?? null,
        project_title: row.project_title ?? null,
        project_description: row.project_description ?? null,
        project_start_date: row.project_start_date ?? null,
        project_end_date: row.project_end_date ?? null,
        mentorship_start_date: row.mentorship_start_date ?? null,
        mentorship_end_date: row.mentorship_end_date ?? null,
        grant_name: row.grant_name ?? null,
        grant_number: row.grant_number ?? null,
        grant_mechanism: row.grant_mechanism ?? null,
        grant_start_date: row.grant_start_date ?? null,
        grant_end_date: row.grant_end_date ?? null,
        budget_total: row.budget_total ?? null,
        budget_annual: row.budget_annual ?? null,
        budget_fiscal_year: row.budget_fiscal_year ?? null,
        notes: row.notes ?? "",
        form_status: row.form_status ?? "submitted",
      },
    });
  }

  await database.batch(statements);
  await database.exec(`
    UPDATE sqlite_sequence SET seq = (SELECT COALESCE(MAX(id), 0) FROM faculty) WHERE name = 'faculty';
    UPDATE sqlite_sequence SET seq = (SELECT COALESCE(MAX(id), 0) FROM training_programs) WHERE name = 'training_programs';
    UPDATE sqlite_sequence SET seq = (SELECT COALESCE(MAX(id), 0) FROM scholars_trainees) WHERE name = 'scholars_trainees';
  `);

  return true;
}
