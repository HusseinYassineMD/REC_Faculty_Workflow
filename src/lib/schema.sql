PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS faculty (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  last_name TEXT NOT NULL,
  first_name TEXT NOT NULL,
  title TEXT,
  institution_department TEXT,
  theme TEXT,
  research_area TEXT,
  executive_committee INTEGER NOT NULL DEFAULT 0,
  email TEXT,
  mentor_active_start TEXT,
  mentor_active_end TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS training_programs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  program TEXT NOT NULL,
  trainees_per_year TEXT,
  minority_researchers TEXT,
  focus TEXT,
  preceptor TEXT,
  program_start TEXT,
  program_end TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS scholars_trainees (
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
  adrc_affiliated INTEGER NOT NULL DEFAULT 1,
  adrd_field INTEGER NOT NULL DEFAULT 1,
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

CREATE TABLE IF NOT EXISTS report_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  label TEXT NOT NULL,
  as_of_date TEXT NOT NULL,
  reporting_year TEXT,
  payload_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
