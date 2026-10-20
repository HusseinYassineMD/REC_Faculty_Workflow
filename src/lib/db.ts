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
