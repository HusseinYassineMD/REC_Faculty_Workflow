import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { CLINICAL_REC_DIR, DB_PATH } from "./paths";
import { parseBool, parseCsv } from "./csv";
import type { FacultyRow, ProgramRow, ScholarRow } from "./types";
import { seedFromDemoJson } from "./seed-demo-json";

let db: Database.Database | null = null;

function initSchema(database: Database.Database) {
  const schemaPath = path.join(process.cwd(), "src/lib/schema.sql");
  database.exec(fs.readFileSync(schemaPath, "utf-8"));
  relaxScholarFlags(database);
}

/** Older databases required Yes/No. Blank answers are stored as NULL. */
function relaxScholarFlags(database: Database.Database) {
  const cols = database.prepare("PRAGMA table_info(scholars_trainees)").all() as {
    name: string;
    notnull: number;
  }[];
  const adrc = cols.find((col) => col.name === "adrc_affiliated");
  if (!adrc || adrc.notnull === 0) return;
  const names = cols.map((col) => col.name).join(", ");
  database.exec(`
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

function seedIfEmpty(database: Database.Database) {
  const count =
    (database.prepare("SELECT COUNT(*) AS c FROM scholars_trainees").get() as { c: number })
      .c +
    (database.prepare("SELECT COUNT(*) AS c FROM faculty").get() as { c: number }).c +
    (database.prepare("SELECT COUNT(*) AS c FROM training_programs").get() as { c: number }).c;
  if (count > 0) return;

  if (seedFromDemoJson(database)) return;

  const facultyCsv = path.join(CLINICAL_REC_DIR, "faculty.csv");
  if (!fs.existsSync(facultyCsv)) return;

  const faculty = parseCsv(facultyCsv);
  const programs = parseCsv(path.join(CLINICAL_REC_DIR, "training-programs.csv"));
  const scholars = parseCsv(path.join(CLINICAL_REC_DIR, "scholars-trainees.csv"));

  const insFac = database.prepare(`
    INSERT INTO faculty (last_name, first_name, title, institution_department, theme, research_area, executive_committee, notes)
    VALUES (@last_name, @first_name, @title, @institution_department, @theme, @research_area, @executive_committee, @notes)
  `);
  for (const r of faculty) {
    insFac.run({
      last_name: r.last_name,
      first_name: r.first_name,
      title: r.title ?? "",
      institution_department: r.institution_department ?? "",
      theme: r.theme ?? "",
      research_area: r.research_area ?? "",
      executive_committee: parseBool(r.executive_committee) ? 1 : 0,
      notes: r.notes ?? "",
    });
  }

  const insProg = database.prepare(`
    INSERT INTO training_programs (program, trainees_per_year, minority_researchers, focus, preceptor, notes)
    VALUES (@program, @trainees_per_year, @minority_researchers, @focus, @preceptor, @notes)
  `);
  for (const r of programs) {
    insProg.run({
      program: r.program,
      trainees_per_year: r.trainees_per_year ?? "",
      minority_researchers: r.minority_researchers ?? "",
      focus: r.focus ?? "",
      preceptor: r.preceptor ?? "",
      notes: r.notes ?? "",
    });
  }

  const insSch = database.prepare(`
    INSERT INTO scholars_trainees (
      last_name, first_name, current_or_past, scholar_or_trainee, training_level,
      research_area, progress, adrc_affiliated, adrd_field, notes
    ) VALUES (
      @last_name, @first_name, @current_or_past, @scholar_or_trainee, @training_level,
      @research_area, @progress, @adrc_affiliated, @adrd_field, @notes
    )
  `);
  for (const r of scholars) {
    insSch.run({
      last_name: r.last_name,
      first_name: r.first_name,
      current_or_past: r.current_or_past || "Current",
      scholar_or_trainee: r.scholar_or_trainee || "Scholar",
      training_level: r.training_level ?? "",
      research_area: r.research_area ?? "",
      progress: r.progress ?? "",
      adrc_affiliated: parseBool(r.adrc_affiliated ?? "yes") ? 1 : 0,
      adrd_field: parseBool(r.adrd_field ?? "yes") ? 1 : 0,
      notes: r.notes ?? "",
    });
  }
}

export function getDb(): Database.Database {
  if (db) return db;
  try {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    initSchema(db);
    seedIfEmpty(db);
    return db;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(
      `Database failed to open (${DB_PATH}). Run "npm install" in REC_Faculty_Workflow. Details: ${msg}`
    );
  }
}

export function getCounts() {
  const database = getDb();
  return {
    scholars: (
      database.prepare("SELECT COUNT(*) AS c FROM scholars_trainees").get() as { c: number }
    ).c,
    faculty: (database.prepare("SELECT COUNT(*) AS c FROM faculty").get() as { c: number }).c,
    programs: (
      database.prepare("SELECT COUNT(*) AS c FROM training_programs").get() as { c: number }
    ).c,
    current_scholars: (
      database
        .prepare(
          `SELECT COUNT(*) AS c FROM scholars_trainees
           WHERE lower(current_or_past) = 'current' AND lower(scholar_or_trainee) = 'scholar'`
        )
        .get() as { c: number }
    ).c,
    current_trainees: (
      database
        .prepare(
          `SELECT COUNT(*) AS c FROM scholars_trainees
           WHERE lower(current_or_past) = 'current' AND lower(scholar_or_trainee) = 'trainee'`
        )
        .get() as { c: number }
    ).c,
  };
}

export function listScholars(): ScholarRow[] {
  return getDb()
    .prepare("SELECT * FROM scholars_trainees ORDER BY updated_at DESC")
    .all() as ScholarRow[];
}

export function listFaculty(): FacultyRow[] {
  return getDb()
    .prepare("SELECT * FROM faculty ORDER BY last_name, first_name")
    .all() as FacultyRow[];
}

export function listPrograms(): ProgramRow[] {
  return getDb()
    .prepare("SELECT * FROM training_programs ORDER BY program")
    .all() as ProgramRow[];
}

export function getScholar(id: number): ScholarRow | undefined {
  return getDb().prepare("SELECT * FROM scholars_trainees WHERE id = ?").get(id) as
    | ScholarRow
    | undefined;
}

export function getFaculty(id: number): FacultyRow | undefined {
  return getDb().prepare("SELECT * FROM faculty WHERE id = ?").get(id) as FacultyRow | undefined;
}

export function getProgram(id: number): ProgramRow | undefined {
  return getDb().prepare("SELECT * FROM training_programs WHERE id = ?").get(id) as
    | ProgramRow
    | undefined;
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

export function saveIntakeRows(input: {
  scholar: ScholarInsert | null;
  faculty: FacultyInsert | null;
  program: ProgramInsert | null;
  event: EventInsert | null;
}): string[] {
  const database = getDb();
  const saved: string[] = [];
  const write = database.transaction(() => {
    if (input.scholar) {
      database
        .prepare(
          `INSERT INTO scholars_trainees (
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
          )`
        )
        .run(input.scholar);
      const kind = input.scholar.scholar_or_trainee.toLowerCase();
      saved.push(kind.includes("trainee") ? "trainee" : kind.includes("scholar") ? "scholar" : "person");
    }
    if (input.faculty) {
      database
        .prepare(
          `INSERT INTO faculty (
            last_name, first_name, title, institution_department, theme, research_area,
            executive_committee, email, mentor_active_start, mentor_active_end
          ) VALUES (
            @last_name, @first_name, @title, @institution_department, @theme, @research_area,
            @executive_committee, @email, @mentor_active_start, @mentor_active_end
          )`
        )
        .run(input.faculty);
      saved.push("faculty");
    }
    if (input.program) {
      database
        .prepare(
          `INSERT INTO training_programs (
            program, trainees_per_year, minority_researchers, focus, preceptor, program_start, program_end
          ) VALUES (
            @program, @trainees_per_year, @minority_researchers, @focus, @preceptor, @program_start, @program_end
          )`
        )
        .run(input.program);
      saved.push("program");
    }
    if (input.event) {
      database
        .prepare(
          `INSERT INTO rec_events (event_title, event_description, attendance, platform, event_other)
           VALUES (@event_title, @event_description, @attendance, @platform, @event_other)`
        )
        .run(input.event);
      saved.push("event");
    }
  });
  write();
  return saved;
}

export function updateScholar(id: number, input: ScholarInsert): boolean {
  const result = getDb()
    .prepare(
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
      WHERE id=@id`
    )
    .run({ ...input, id });
  return result.changes > 0;
}

export function deleteScholar(id: number): boolean {
  return getDb().prepare("DELETE FROM scholars_trainees WHERE id = ?").run(id).changes > 0;
}

export function updateFaculty(id: number, input: FacultyInsert & { notes: string | null }): boolean {
  const result = getDb()
    .prepare(
      `UPDATE faculty SET
        last_name=@last_name, first_name=@first_name, title=@title,
        institution_department=@institution_department, theme=@theme, research_area=@research_area,
        executive_committee=@executive_committee, email=@email,
        mentor_active_start=@mentor_active_start, mentor_active_end=@mentor_active_end,
        notes=@notes, updated_at=datetime('now')
      WHERE id=@id`
    )
    .run({ ...input, id });
  return result.changes > 0;
}

export function deleteFaculty(id: number): boolean {
  return getDb().prepare("DELETE FROM faculty WHERE id = ?").run(id).changes > 0;
}

export function updateProgram(id: number, input: ProgramInsert & { notes: string | null }): boolean {
  const result = getDb()
    .prepare(
      `UPDATE training_programs SET
        program=@program, trainees_per_year=@trainees_per_year, minority_researchers=@minority_researchers,
        focus=@focus, preceptor=@preceptor, program_start=@program_start, program_end=@program_end,
        notes=@notes, updated_at=datetime('now')
      WHERE id=@id`
    )
    .run({ ...input, id });
  return result.changes > 0;
}

export function deleteProgram(id: number): boolean {
  return getDb().prepare("DELETE FROM training_programs WHERE id = ?").run(id).changes > 0;
}

export function listStoredEvents(): string[][] {
  const rows = getDb()
    .prepare(
      `SELECT event_title, event_description, attendance, platform, event_other
       FROM rec_events ORDER BY id`
    )
    .all() as {
    event_title: string;
    event_description: string | null;
    attendance: string | null;
    platform: string | null;
    event_other: string | null;
  }[];
  return rows.map((row) => [
    row.event_title,
    row.event_description ?? "",
    row.attendance?.trim() || "—",
    row.platform ?? "",
    row.event_other ?? "",
  ]);
}
