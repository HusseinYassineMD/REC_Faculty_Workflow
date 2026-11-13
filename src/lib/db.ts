import "server-only";

import fs from "fs";
import path from "path";
import { CLINICAL_REC_DIR, DB_PATH } from "./paths";
import { parseBool, parseCsv } from "./csv";
import type { EventImport, FacultyImport, ProgramImport, ScholarImport } from "./excel-import";
import type { FacultyRow, ProgramRow, ScholarRow } from "./types";
import { seedFromDemoJson } from "./seed-demo-json";
import { SCHEMA_SQL } from "./schema-sql";
import { createSqlDb, remoteDatabaseConfig, type SqlDb, type SqlStatement } from "./sql-db";

let opening: Promise<SqlDb> | null = null;

function openDatabase(): Promise<SqlDb> {
  if (!opening) {
    opening = initDatabase().catch((err) => {
      opening = null;
      throw err;
    });
  }
  return opening;
}

async function initDatabase(): Promise<SqlDb> {
  const remote = remoteDatabaseConfig();
  try {
    const database = await createSqlDb(remote);
    await database.exec(SCHEMA_SQL);
    await relaxScholarFlags(database);
    await seedIfEmpty(database);
    console.log(remote ? "REC database: Turso" : `REC database: local SQLite (${DB_PATH})`);
    return database;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const where = remote ? "Turso" : DB_PATH;
    throw new Error(
      `Database failed to open (${where}). ${
        remote
          ? "Check TURSO_DATABASE_URL and TURSO_AUTH_TOKEN."
          : 'Run "npm install" in REC_Faculty_Workflow.'
      } Details: ${msg}`
    );
  }
}

/** Older databases required Yes/No. Blank answers are stored as NULL. */
async function relaxScholarFlags(database: SqlDb) {
  const cols = await database.all<{ name: string; notnull: number }>(
    "PRAGMA table_info(scholars_trainees)"
  );
  const adrc = cols.find((col) => col.name === "adrc_affiliated");
  if (!adrc || Number(adrc.notnull) === 0) return;
  const names = cols.map((col) => col.name).join(", ");
  await database.exec(`
    CREATE TABLE scholars_trainees_mig (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      last_name TEXT NOT NULL,
      first_name TEXT NOT NULL,
      email TEXT,
      department TEXT,
      cohort_year TEXT,
      current_or_past TEXT NOT NULL DEFAULT 'Current',
      scholar_or_trainee TEXT NOT NULL DEFAULT 'Scholar',
      training_level TEXT,
      research_area TEXT,
      progress TEXT,
      adrc_affiliated INTEGER,
      adrd_field INTEGER,
      mentors TEXT,
      primary_preceptor TEXT,
      project_title TEXT,
      project_description TEXT,
      project_start_date TEXT,
      project_end_date TEXT,
      mentorship_start_date TEXT,
      mentorship_end_date TEXT,
      grant_name TEXT,
      grant_number TEXT,
      grant_mechanism TEXT,
      grant_start_date TEXT,
      grant_end_date TEXT,
      budget_total REAL,
      budget_annual REAL,
      budget_fiscal_year TEXT,
      notes TEXT,
      form_status TEXT NOT NULL DEFAULT 'submitted',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    INSERT INTO scholars_trainees_mig (${names}) SELECT ${names} FROM scholars_trainees;
    DROP TABLE scholars_trainees;
    ALTER TABLE scholars_trainees_mig RENAME TO scholars_trainees;
  `);
}

async function countOf(database: SqlDb, sql: string): Promise<number> {
  const row = await database.get<{ c: number }>(sql);
  return Number(row?.c ?? 0);
}

async function seedIfEmpty(database: SqlDb) {
  const count =
    (await countOf(database, "SELECT COUNT(*) AS c FROM scholars_trainees")) +
    (await countOf(database, "SELECT COUNT(*) AS c FROM faculty")) +
    (await countOf(database, "SELECT COUNT(*) AS c FROM training_programs"));
  if (count > 0) return;

  if (await seedFromDemoJson(database)) return;

  const facultyCsv = path.join(CLINICAL_REC_DIR, "faculty.csv");
  if (!fs.existsSync(facultyCsv)) return;

  const faculty = parseCsv(facultyCsv);
  const programs = parseCsv(path.join(CLINICAL_REC_DIR, "training-programs.csv"));
  const scholars = parseCsv(path.join(CLINICAL_REC_DIR, "scholars-trainees.csv"));
  const statements: SqlStatement[] = [];

  for (const row of faculty) {
    statements.push({
      sql: `INSERT INTO faculty (last_name, first_name, title, institution_department, theme, research_area, executive_committee, notes)
            VALUES (@last_name, @first_name, @title, @institution_department, @theme, @research_area, @executive_committee, @notes)`,
      args: {
        last_name: row.last_name,
        first_name: row.first_name,
        title: row.title ?? "",
        institution_department: row.institution_department ?? "",
        theme: row.theme ?? "",
        research_area: row.research_area ?? "",
        executive_committee: parseBool(row.executive_committee) ? 1 : 0,
        notes: row.notes ?? "",
      },
    });
  }

  for (const row of programs) {
    statements.push({
      sql: `INSERT INTO training_programs (program, trainees_per_year, minority_researchers, focus, preceptor, notes)
            VALUES (@program, @trainees_per_year, @minority_researchers, @focus, @preceptor, @notes)`,
      args: {
        program: row.program,
        trainees_per_year: row.trainees_per_year ?? "",
        minority_researchers: row.minority_researchers ?? "",
        focus: row.focus ?? "",
        preceptor: row.preceptor ?? "",
        notes: row.notes ?? "",
      },
    });
  }

  for (const row of scholars) {
    statements.push({
      sql: `INSERT INTO scholars_trainees (
              last_name, first_name, current_or_past, scholar_or_trainee, training_level,
              research_area, progress, adrc_affiliated, adrd_field, notes
            ) VALUES (
              @last_name, @first_name, @current_or_past, @scholar_or_trainee, @training_level,
              @research_area, @progress, @adrc_affiliated, @adrd_field, @notes
            )`,
      args: {
        last_name: row.last_name,
        first_name: row.first_name,
        current_or_past: row.current_or_past || "Current",
        scholar_or_trainee: row.scholar_or_trainee || "Scholar",
        training_level: row.training_level ?? "",
        research_area: row.research_area ?? "",
        progress: row.progress ?? "",
        adrc_affiliated: parseBool(row.adrc_affiliated ?? "yes") ? 1 : 0,
        adrd_field: parseBool(row.adrd_field ?? "yes") ? 1 : 0,
        notes: row.notes ?? "",
      },
    });
  }

  await database.batch(statements);
}

export async function getCounts() {
  const database = await openDatabase();
  return {
    scholars: await countOf(database, "SELECT COUNT(*) AS c FROM scholars_trainees"),
    faculty: await countOf(database, "SELECT COUNT(*) AS c FROM faculty"),
    programs: await countOf(database, "SELECT COUNT(*) AS c FROM training_programs"),
    current_scholars: await countOf(
      database,
      `SELECT COUNT(*) AS c FROM scholars_trainees
       WHERE lower(current_or_past) = 'current' AND lower(scholar_or_trainee) = 'scholar'`
    ),
    current_trainees: await countOf(
      database,
      `SELECT COUNT(*) AS c FROM scholars_trainees
       WHERE lower(current_or_past) = 'current' AND lower(scholar_or_trainee) = 'trainee'`
    ),
  };
}

export async function listScholars(): Promise<ScholarRow[]> {
  const database = await openDatabase();
  return database.all<ScholarRow>("SELECT * FROM scholars_trainees ORDER BY updated_at DESC");
}

export async function listFaculty(): Promise<FacultyRow[]> {
  const database = await openDatabase();
  return database.all<FacultyRow>("SELECT * FROM faculty ORDER BY last_name, first_name");
}

export async function listPrograms(): Promise<ProgramRow[]> {
  const database = await openDatabase();
  return database.all<ProgramRow>("SELECT * FROM training_programs ORDER BY program");
}

export async function getScholar(id: number): Promise<ScholarRow | undefined> {
  const database = await openDatabase();
  return database.get<ScholarRow>("SELECT * FROM scholars_trainees WHERE id = ?", [id]);
}

export async function getFaculty(id: number): Promise<FacultyRow | undefined> {
  const database = await openDatabase();
  return database.get<FacultyRow>("SELECT * FROM faculty WHERE id = ?", [id]);
}

export async function getProgram(id: number): Promise<ProgramRow | undefined> {
  const database = await openDatabase();
  return database.get<ProgramRow>("SELECT * FROM training_programs WHERE id = ?", [id]);
}

export type ScholarInsert = {
  last_name: string;
  first_name: string;
  email: string | null;
  department: string | null;
  cohort_year: string | null;
  current_or_past: string;
  scholar_or_trainee: string;
  training_level: string | null;
  research_area: string | null;
  progress: string | null;
  adrc_affiliated: number | null;
  adrd_field: number | null;
  mentors: string | null;
  primary_preceptor: string | null;
  project_title: string | null;
  project_description: string | null;
  project_start_date: string | null;
  project_end_date: string | null;
  mentorship_start_date: string | null;
  mentorship_end_date: string | null;
  grant_name: string | null;
  grant_number: string | null;
  grant_mechanism: string | null;
  grant_start_date: string | null;
  grant_end_date: string | null;
  budget_total: number | null;
  budget_annual: number | null;
  budget_fiscal_year: string | null;
  notes: string | null;
};

export type FacultyInsert = {
  last_name: string;
  first_name: string;
  title: string | null;
  institution_department: string | null;
  theme: string | null;
  research_area: string | null;
  executive_committee: number;
  email: string | null;
  mentor_active_start: string | null;
  mentor_active_end: string | null;
};

export type ProgramInsert = {
  program: string;
  trainees_per_year: string | null;
  minority_researchers: string | null;
  focus: string | null;
  preceptor: string | null;
  program_start: string | null;
  program_end: string | null;
};

export type EventInsert = {
  event_title: string;
  event_description: string | null;
  attendance: string | null;
  platform: string | null;
  event_other: string | null;
};

export async function saveIntakeRows(input: {
  scholar: ScholarInsert | null;
  faculty: FacultyInsert | null;
  program: ProgramInsert | null;
  event: EventInsert | null;
}): Promise<string[]> {
  const database = await openDatabase();
  const saved: string[] = [];
  const statements: SqlStatement[] = [];

  if (input.scholar) {
    statements.push({
      sql: `INSERT INTO scholars_trainees (
        last_name, first_name, email, department, cohort_year, current_or_past,
        scholar_or_trainee, training_level, research_area, progress,
        adrc_affiliated, adrd_field, mentors, primary_preceptor,
        project_title, project_description, project_start_date, project_end_date,
        mentorship_start_date, mentorship_end_date,
        grant_name, grant_number, grant_mechanism, grant_start_date, grant_end_date,
        budget_total, budget_annual, budget_fiscal_year, notes, form_status
      ) VALUES (
        @last_name, @first_name, @email, @department, @cohort_year, @current_or_past,
        @scholar_or_trainee, @training_level, @research_area, @progress,
        @adrc_affiliated, @adrd_field, @mentors, @primary_preceptor,
        @project_title, @project_description, @project_start_date, @project_end_date,
        @mentorship_start_date, @mentorship_end_date,
        @grant_name, @grant_number, @grant_mechanism, @grant_start_date, @grant_end_date,
        @budget_total, @budget_annual, @budget_fiscal_year, @notes, 'submitted'
      )`,
      args: input.scholar,
    });
    const kind = (input.scholar.scholar_or_trainee || "").toLowerCase();
    saved.push(kind.includes("trainee") ? "trainee" : kind.includes("scholar") ? "scholar" : "person");
  }
  if (input.faculty) {
    statements.push({
      sql: `INSERT INTO faculty (
        last_name, first_name, title, institution_department, theme, research_area,
        executive_committee, email, mentor_active_start, mentor_active_end
      ) VALUES (
        @last_name, @first_name, @title, @institution_department, @theme, @research_area,
        @executive_committee, @email, @mentor_active_start, @mentor_active_end
      )`,
      args: input.faculty,
    });
    saved.push("faculty");
  }
  if (input.program) {
    statements.push({
      sql: `INSERT INTO training_programs (
        program, trainees_per_year, minority_researchers, focus, preceptor, program_start, program_end
      ) VALUES (
        @program, @trainees_per_year, @minority_researchers, @focus, @preceptor, @program_start, @program_end
      )`,
      args: input.program,
    });
    saved.push("program");
  }
  if (input.event) {
    statements.push({
      sql: `INSERT INTO rec_events (event_title, event_description, attendance, platform, event_other)
            VALUES (@event_title, @event_description, @attendance, @platform, @event_other)`,
      args: input.event,
    });
    saved.push("event");
  }

  await database.batch(statements);
  return saved;
}

export async function updateScholar(id: number, input: ScholarInsert): Promise<boolean> {
  const database = await openDatabase();
  const result = await database.run(
    `UPDATE scholars_trainees SET
      last_name=@last_name, first_name=@first_name, email=@email, department=@department,
      cohort_year=@cohort_year, current_or_past=@current_or_past, scholar_or_trainee=@scholar_or_trainee,
      training_level=@training_level, research_area=@research_area, progress=@progress,
      adrc_affiliated=@adrc_affiliated, adrd_field=@adrd_field, mentors=@mentors,
      primary_preceptor=@primary_preceptor, project_title=@project_title,
      project_description=@project_description, project_start_date=@project_start_date,
      project_end_date=@project_end_date, mentorship_start_date=@mentorship_start_date,
      mentorship_end_date=@mentorship_end_date, grant_name=@grant_name, grant_number=@grant_number,
      grant_mechanism=@grant_mechanism, grant_start_date=@grant_start_date, grant_end_date=@grant_end_date,
      budget_total=@budget_total, budget_annual=@budget_annual, budget_fiscal_year=@budget_fiscal_year,
      notes=@notes, updated_at=datetime('now')
    WHERE id=@id`,
    { ...input, id }
  );
  return result.changes > 0;
}

export async function deleteScholar(id: number): Promise<boolean> {
  const database = await openDatabase();
  const result = await database.run("DELETE FROM scholars_trainees WHERE id = ?", [id]);
  return result.changes > 0;
}

export async function updateFaculty(
  id: number,
  input: FacultyInsert & { notes: string | null }
): Promise<boolean> {
  const database = await openDatabase();
  const result = await database.run(
    `UPDATE faculty SET
      last_name=@last_name, first_name=@first_name, title=@title,
      institution_department=@institution_department, theme=@theme, research_area=@research_area,
      executive_committee=@executive_committee, email=@email,
      mentor_active_start=@mentor_active_start, mentor_active_end=@mentor_active_end,
      notes=@notes, updated_at=datetime('now')
    WHERE id=@id`,
    { ...input, id }
  );
  return result.changes > 0;
}

export async function deleteFaculty(id: number): Promise<boolean> {
  const database = await openDatabase();
  const result = await database.run("DELETE FROM faculty WHERE id = ?", [id]);
  return result.changes > 0;
}

export async function updateProgram(
  id: number,
  input: ProgramInsert & { notes: string | null }
): Promise<boolean> {
  const database = await openDatabase();
  const result = await database.run(
    `UPDATE training_programs SET
      program=@program, trainees_per_year=@trainees_per_year, minority_researchers=@minority_researchers,
      focus=@focus, preceptor=@preceptor, program_start=@program_start, program_end=@program_end,
      notes=@notes, updated_at=datetime('now')
    WHERE id=@id`,
    { ...input, id }
  );
  return result.changes > 0;
}

export async function deleteProgram(id: number): Promise<boolean> {
  const database = await openDatabase();
  const result = await database.run("DELETE FROM training_programs WHERE id = ?", [id]);
  return result.changes > 0;
}

export async function listStoredEvents(): Promise<string[][]> {
  const database = await openDatabase();
  const rows = await database.all<{
    event_title: string;
    event_description: string | null;
    attendance: string | null;
    platform: string | null;
    event_other: string | null;
  }>(
    `SELECT event_title, event_description, attendance, platform, event_other
     FROM rec_events ORDER BY id`
  );
  return rows.map((row) => [
    row.event_title,
    row.event_description ?? "",
    row.attendance?.trim() || "—",
    row.platform ?? "",
    row.event_other ?? "",
  ]);
}

export type ExcelWriteCounts = {
  addedScholars: number;
  updatedScholars: number;
  addedFaculty: number;
  updatedFaculty: number;
  addedPrograms: number;
  updatedPrograms: number;
  addedEvents: number;
};

export async function applyExcelImport(input: {
  scholars: ScholarImport[];
  faculty: FacultyImport[];
  programs: ProgramImport[];
  events: EventImport[];
}): Promise<ExcelWriteCounts> {
  const database = await openDatabase();
  const scholars = await database.all<ScholarRow>("SELECT * FROM scholars_trainees");
  const faculty = await database.all<FacultyRow>("SELECT * FROM faculty");
  const programs = await database.all<ProgramRow>("SELECT * FROM training_programs");
  const scholarByName = new Map(scholars.map((row) => [personKey(row.last_name, row.first_name), row]));
  const facultyByName = new Map(faculty.map((row) => [personKey(row.last_name, row.first_name), row]));
  const programByName = new Map(programs.map((row) => [row.program.trim().toLowerCase(), row]));
  const statements: SqlStatement[] = [];
  const counts: ExcelWriteCounts = {
    addedScholars: 0,
    updatedScholars: 0,
    addedFaculty: 0,
    updatedFaculty: 0,
    addedPrograms: 0,
    updatedPrograms: 0,
    addedEvents: 0,
  };

  for (const item of input.scholars) {
    const existing = scholarByName.get(personKey(item.last_name, item.first_name));
    const record = overlay(blankScholar(item), item);
    if (existing) {
      statements.push({ sql: SCHOLAR_UPDATE_SQL, args: { ...overlay(scholarInsert(existing), item), id: existing.id } });
      counts.updatedScholars += 1;
    } else {
      statements.push({ sql: SCHOLAR_INSERT_SQL, args: record });
      counts.addedScholars += 1;
    }
  }
  for (const item of input.faculty) {
    const existing = facultyByName.get(personKey(item.last_name, item.first_name));
    if (existing) {
      statements.push({ sql: FACULTY_UPDATE_SQL, args: { ...overlay(facultyInsert(existing), item), id: existing.id } });
      counts.updatedFaculty += 1;
    } else {
      statements.push({ sql: FACULTY_INSERT_SQL, args: overlay(blankFaculty(item), item) });
      counts.addedFaculty += 1;
    }
  }
  for (const item of input.programs) {
    const existing = programByName.get(item.program.trim().toLowerCase());
    if (existing) {
      statements.push({ sql: PROGRAM_UPDATE_SQL, args: { ...overlay(programInsert(existing), item), id: existing.id } });
      counts.updatedPrograms += 1;
    } else {
      statements.push({ sql: PROGRAM_INSERT_SQL, args: overlay(blankProgram(item), item) });
      counts.addedPrograms += 1;
    }
  }
  for (const item of input.events) {
    statements.push({
      sql: `INSERT INTO rec_events (event_title, event_description, attendance, platform, event_other)
            VALUES (@event_title, @event_description, @attendance, @platform, @event_other)`,
      args: {
        event_title: item.event_title,
        event_description: item.event_description ?? null,
        attendance: item.attendance ?? null,
        platform: item.platform ?? null,
        event_other: item.event_other ?? null,
      },
    });
    counts.addedEvents += 1;
  }

  await database.batch(statements);
  return counts;
}

function personKey(last: string, first: string) {
  return `${last.trim().toLowerCase()}|${first.trim().toLowerCase()}`;
}

function overlay<T extends object>(base: T, patch: object): T {
  const next = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    if (value !== undefined && Object.prototype.hasOwnProperty.call(next, key)) {
      (next as Record<string, unknown>)[key] = value;
    }
  }
  return next;
}

function blankScholar(item: ScholarImport): ScholarInsert {
  return {
    last_name: item.last_name,
    first_name: item.first_name,
    email: null,
    department: null,
    cohort_year: null,
    current_or_past: "",
    scholar_or_trainee: "",
    training_level: null,
    research_area: null,
    progress: null,
    adrc_affiliated: null,
    adrd_field: null,
    mentors: null,
    primary_preceptor: null,
    project_title: null,
    project_description: null,
    project_start_date: null,
    project_end_date: null,
    mentorship_start_date: null,
    mentorship_end_date: null,
    grant_name: null,
    grant_number: null,
    grant_mechanism: null,
    grant_start_date: null,
    grant_end_date: null,
    budget_total: null,
    budget_annual: null,
    budget_fiscal_year: null,
    notes: null,
  };
}

function scholarInsert(row: ScholarRow): ScholarInsert {
  return {
    last_name: row.last_name,
    first_name: row.first_name,
    email: row.email,
    department: row.department,
    cohort_year: row.cohort_year,
    current_or_past: row.current_or_past,
    scholar_or_trainee: row.scholar_or_trainee,
    training_level: row.training_level,
    research_area: row.research_area,
    progress: row.progress,
    adrc_affiliated: row.adrc_affiliated,
    adrd_field: row.adrd_field,
    mentors: row.mentors,
    primary_preceptor: row.primary_preceptor,
    project_title: row.project_title,
    project_description: row.project_description,
    project_start_date: row.project_start_date,
    project_end_date: row.project_end_date,
    mentorship_start_date: row.mentorship_start_date,
    mentorship_end_date: row.mentorship_end_date,
    grant_name: row.grant_name,
    grant_number: row.grant_number,
    grant_mechanism: row.grant_mechanism,
    grant_start_date: row.grant_start_date,
    grant_end_date: row.grant_end_date,
    budget_total: row.budget_total,
    budget_annual: row.budget_annual,
    budget_fiscal_year: row.budget_fiscal_year,
    notes: row.notes,
  };
}

function blankFaculty(item: FacultyImport): FacultyInsert & { notes: string | null } {
  return {
    last_name: item.last_name,
    first_name: item.first_name,
    title: null,
    institution_department: null,
    theme: null,
    research_area: null,
    executive_committee: 0,
    email: null,
    mentor_active_start: null,
    mentor_active_end: null,
    notes: null,
  };
}

function facultyInsert(row: FacultyRow): FacultyInsert & { notes: string | null } {
  return {
    last_name: row.last_name,
    first_name: row.first_name,
    title: row.title,
    institution_department: row.institution_department,
    theme: row.theme,
    research_area: row.research_area,
    executive_committee: row.executive_committee,
    email: row.email,
    mentor_active_start: row.mentor_active_start,
    mentor_active_end: row.mentor_active_end,
    notes: row.notes,
  };
}

function blankProgram(item: ProgramImport): ProgramInsert & { notes: string | null } {
  return {
    program: item.program,
    trainees_per_year: null,
    minority_researchers: null,
    focus: null,
    preceptor: null,
    program_start: null,
    program_end: null,
    notes: null,
  };
}

function programInsert(row: ProgramRow): ProgramInsert & { notes: string | null } {
  return {
    program: row.program,
    trainees_per_year: row.trainees_per_year,
    minority_researchers: row.minority_researchers,
    focus: row.focus,
    preceptor: row.preceptor,
    program_start: row.program_start,
    program_end: row.program_end,
    notes: row.notes,
  };
}

const SCHOLAR_INSERT_SQL = `INSERT INTO scholars_trainees (
  last_name, first_name, email, department, cohort_year, current_or_past,
  scholar_or_trainee, training_level, research_area, progress,
  adrc_affiliated, adrd_field, mentors, primary_preceptor,
  project_title, project_description, project_start_date, project_end_date,
  mentorship_start_date, mentorship_end_date,
  grant_name, grant_number, grant_mechanism, grant_start_date, grant_end_date,
  budget_total, budget_annual, budget_fiscal_year, notes, form_status
) VALUES (
  @last_name, @first_name, @email, @department, @cohort_year, @current_or_past,
  @scholar_or_trainee, @training_level, @research_area, @progress,
  @adrc_affiliated, @adrd_field, @mentors, @primary_preceptor,
  @project_title, @project_description, @project_start_date, @project_end_date,
  @mentorship_start_date, @mentorship_end_date,
  @grant_name, @grant_number, @grant_mechanism, @grant_start_date, @grant_end_date,
  @budget_total, @budget_annual, @budget_fiscal_year, @notes, 'submitted'
)`;

const SCHOLAR_UPDATE_SQL = `UPDATE scholars_trainees SET
  last_name=@last_name, first_name=@first_name, email=@email, department=@department,
  cohort_year=@cohort_year, current_or_past=@current_or_past, scholar_or_trainee=@scholar_or_trainee,
  training_level=@training_level, research_area=@research_area, progress=@progress,
  adrc_affiliated=@adrc_affiliated, adrd_field=@adrd_field, mentors=@mentors,
  primary_preceptor=@primary_preceptor, project_title=@project_title,
  project_description=@project_description, project_start_date=@project_start_date,
  project_end_date=@project_end_date, mentorship_start_date=@mentorship_start_date,
  mentorship_end_date=@mentorship_end_date, grant_name=@grant_name, grant_number=@grant_number,
  grant_mechanism=@grant_mechanism, grant_start_date=@grant_start_date, grant_end_date=@grant_end_date,
  budget_total=@budget_total, budget_annual=@budget_annual, budget_fiscal_year=@budget_fiscal_year,
  notes=@notes, updated_at=datetime('now')
WHERE id=@id`;

const FACULTY_INSERT_SQL = `INSERT INTO faculty (
  last_name, first_name, title, institution_department, theme, research_area,
  executive_committee, email, mentor_active_start, mentor_active_end, notes
) VALUES (
  @last_name, @first_name, @title, @institution_department, @theme, @research_area,
  @executive_committee, @email, @mentor_active_start, @mentor_active_end, @notes
)`;

const FACULTY_UPDATE_SQL = `UPDATE faculty SET
  last_name=@last_name, first_name=@first_name, title=@title,
  institution_department=@institution_department, theme=@theme, research_area=@research_area,
  executive_committee=@executive_committee, email=@email,
  mentor_active_start=@mentor_active_start, mentor_active_end=@mentor_active_end,
  notes=@notes, updated_at=datetime('now')
WHERE id=@id`;

const PROGRAM_INSERT_SQL = `INSERT INTO training_programs (
  program, trainees_per_year, minority_researchers, focus, preceptor, program_start, program_end, notes
) VALUES (
  @program, @trainees_per_year, @minority_researchers, @focus, @preceptor, @program_start, @program_end, @notes
)`;

const PROGRAM_UPDATE_SQL = `UPDATE training_programs SET
  program=@program, trainees_per_year=@trainees_per_year, minority_researchers=@minority_researchers,
  focus=@focus, preceptor=@preceptor, program_start=@program_start, program_end=@program_end,
  notes=@notes, updated_at=datetime('now')
WHERE id=@id`;

export async function insertReportSnapshot(label: string, asOf: string, reportingYear: string, payloadJson: string) {
  const database = await openDatabase();
  await database.run(
    `INSERT INTO report_snapshots (label, as_of_date, reporting_year, payload_json)
     VALUES (?, ?, ?, ?)`,
    [label, asOf, reportingYear, payloadJson]
  );
}
