export type SheetGrid = { name: string; rows: string[][] };

export type ScholarImport = {
  last_name: string;
  first_name: string;
  email?: string | null;
  department?: string | null;
  cohort_year?: string | null;
  current_or_past?: string;
  scholar_or_trainee?: string;
  training_level?: string | null;
  research_area?: string | null;
  progress?: string | null;
  adrc_affiliated?: number | null;
  adrd_field?: number | null;
  mentors?: string | null;
  primary_preceptor?: string | null;
  project_title?: string | null;
  project_description?: string | null;
  project_start_date?: string | null;
  project_end_date?: string | null;
  mentorship_start_date?: string | null;
  mentorship_end_date?: string | null;
  grant_name?: string | null;
  grant_number?: string | null;
  grant_mechanism?: string | null;
  grant_start_date?: string | null;
  grant_end_date?: string | null;
  budget_total?: number | null;
  budget_annual?: number | null;
  budget_fiscal_year?: string | null;
  notes?: string | null;
};

export type FacultyImport = {
  last_name: string;
  first_name: string;
  title?: string | null;
  institution_department?: string | null;
  theme?: string | null;
  research_area?: string | null;
  executive_committee?: number;
  email?: string | null;
  mentor_active_start?: string | null;
  mentor_active_end?: string | null;
  notes?: string | null;
};

export type ProgramImport = {
  program: string;
  trainees_per_year?: string | null;
  minority_researchers?: string | null;
  focus?: string | null;
  preceptor?: string | null;
  program_start?: string | null;
  program_end?: string | null;
  notes?: string | null;
};

export type EventImport = {
  event_title: string;
  event_description?: string | null;
  attendance?: string | null;
  platform?: string | null;
  event_other?: string | null;
};

export type ExcelImportPlan = {
  scholars: ScholarImport[];
  faculty: FacultyImport[];
  programs: ProgramImport[];
  events: EventImport[];
  warnings: string[];
};

export const TEMPLATE_SHEETS: { name: string; headers: string[] }[] = [
  {
    name: "Scholars and trainees",
    headers: [
      "Last name",
      "First name",
      "Email",
      "Department / school",
      "Cohort / training year",
      "Current or past",
      "Scholar or trainee",
      "Level of training",
      "Area of research",
      "Progress",
      "Currently affiliated with an ADRC?",
      "Working / collaborating within the ADRD field?",
      "Mentor(s)",
      "Primary preceptor",
      "Mentorship start",
      "Mentorship end",
      "Project title",
      "Project description",
      "Project start",
      "Project end",
      "Grant mechanism",
      "Grant number",
      "Grant title",
      "Grant start",
      "Grant end",
      "Total budget (USD)",
      "Annual budget (USD)",
      "Fiscal year",
      "Notes",
    ],
  },
  {
    name: "Faculty",
    headers: [
      "Last name",
      "First name",
      "Title",
      "Faculty email",
      "Institution / department",
      "Theme",
      "Executive committee",
      "Research area",
      "Mentor active from",
      "Mentor active until",
      "Notes",
    ],
  },
  {
    name: "Programs",
    headers: [
      "Program name",
      "Post-doc trainees / year",
      "Percent minority researchers",
      "Focus",
      "Preceptor",
      "Program start",
      "Program end",
      "Notes",
    ],
  },
  {
    name: "Events",
    headers: [
      "Event, date(s), sponsors",
      "Brief description, intended audience",
      "Attendance",
      "Platform, advertising, access",
      "Other information",
    ],
  },
];

const SCHOLAR_ALIASES: Record<string, string> = {
  "last name": "last_name",
  lastname: "last_name",
  surname: "last_name",
  "first name": "first_name",
  firstname: "first_name",
  "last name first name": "full_name",
  name: "full_name",
  email: "email",
  "e mail": "email",
  "department school": "department",
  department: "department",
  "cohort training year": "cohort_year",
  "cohort year": "cohort_year",
  cohort: "cohort_year",
  "current or past": "current_or_past",
  "current past": "current_or_past",
  "current or past trainee": "current_or_past",
  "scholar or trainee": "scholar_or_trainee",
  "scholar trainee": "scholar_or_trainee",
  "level of training": "training_level",
  level: "training_level",
  "area of research": "research_area",
  "research area": "research_area",
  progress: "progress",
  "currently affiliated with an adrc": "adrc_affiliated",
  "adrc affiliated": "adrc_affiliated",
  "working collaborating within the adrd field": "adrd_field",
  "adrd field": "adrd_field",
  mentors: "mentors",
  mentor: "mentors",
  "primary preceptor": "primary_preceptor",
  "mentorship start": "mentorship_start_date",
  "mentorship end": "mentorship_end_date",
  "project title": "project_title",
  "project description": "project_description",
  "project start": "project_start_date",
  "project end": "project_end_date",
  "grant mechanism": "grant_mechanism",
  "grant number": "grant_number",
  "grant title": "grant_name",
  "grant name": "grant_name",
  "grant start": "grant_start_date",
  "grant end": "grant_end_date",
  "total budget usd": "budget_total",
  "total budget": "budget_total",
  "annual budget usd": "budget_annual",
  "annual budget": "budget_annual",
  "fiscal year": "budget_fiscal_year",
  notes: "notes",
};

const FACULTY_ALIASES: Record<string, string> = {
  "last name": "last_name",
  lastname: "last_name",
  "faculty last name": "faculty_last_name",
  "first name": "first_name",
  firstname: "first_name",
  "faculty first name": "faculty_first_name",
  "last name first name": "full_name",
  title: "title",
  email: "email",
  "faculty email": "faculty_email",
  "institution department": "institution_department",
  "institution / department": "institution_department",
  theme: "theme",
  "executive committee": "executive_committee",
  "research area": "research_area",
  "faculty research area": "faculty_research_area",
  "area of research": "research_area",
  "mentor active from": "mentor_active_start",
  "mentor active until": "mentor_active_end",
  notes: "notes",
};

const PROGRAM_ALIASES: Record<string, string> = {
  program: "program",
  "program name": "program",
  "post doc trainees year": "trainees_per_year",
  "trainees year": "trainees_per_year",
  "trainees per year": "trainees_per_year",
  "percent minority researchers": "minority_researchers",
  "% minority researchers": "minority_researchers",
  "minority researchers": "minority_researchers",
  focus: "focus",
  preceptor: "preceptor",
  "program start": "program_start",
  "program end": "program_end",
  notes: "notes",
};

const EVENT_ALIASES: Record<string, string> = {
  "event date s sponsors": "event_title",
  "event dates sponsors": "event_title",
  "event title": "event_title",
  event: "event_title",
  "brief description intended audience": "event_description",
  "brief description": "event_description",
  description: "event_description",
  attendance: "attendance",
  "platform advertising access": "platform",
  platform: "platform",
  "other information": "event_other",
  other: "event_other",
};

const DATE_FIELDS = new Set([
  "mentorship_start_date",
  "mentorship_end_date",
  "project_start_date",
  "project_end_date",
  "grant_start_date",
  "grant_end_date",
  "mentor_active_start",
  "mentor_active_end",
  "program_start",
  "program_end",
]);

const YES_NO_FIELDS = new Set(["adrc_affiliated", "adrd_field", "executive_committee"]);
const MONEY_FIELDS = new Set(["budget_total", "budget_annual"]);

type Kind = "scholar" | "faculty" | "program" | "event" | "intake" | "unknown";

export function planFromSheets(sheets: SheetGrid[]): ExcelImportPlan {
  const plan: ExcelImportPlan = { scholars: [], faculty: [], programs: [], events: [], warnings: [] };
  for (const sheet of sheets) {
    readSheet(sheet, plan);
  }
  plan.scholars = foldPeople(plan.scholars, plan.warnings, "scholar");
  plan.faculty = foldPeople(plan.faculty, plan.warnings, "faculty");
  plan.programs = foldPrograms(plan.programs, plan.warnings);
  return plan;
}

export function summarizePlan(plan: ExcelImportPlan): string {
  const parts = [
    countLabel(plan.scholars.length, "scholar/trainee row"),
    countLabel(plan.faculty.length, "faculty row"),
    countLabel(plan.programs.length, "program row"),
    countLabel(plan.events.length, "event row"),
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "No rows";
}

function countLabel(count: number, label: string) {
  if (count === 0) return "";
  return `${count} ${label}${count === 1 ? "" : "s"}`;
}

function norm(value: string) {
  return value
    .toLowerCase()
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/%/g, " percent ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function headerMap(headers: string[], aliases: Record<string, string>) {
  const found = new Map<string, number>();
  headers.forEach((header, index) => {
    const key = aliases[norm(header)];
    if (key && !found.has(key)) found.set(key, index);
  });
  return found;
}

function recognized(headers: string[]) {
  const keys = new Set<string>();
  for (const aliases of [SCHOLAR_ALIASES, FACULTY_ALIASES, PROGRAM_ALIASES, EVENT_ALIASES]) {
    headers.forEach((header) => {
      const key = aliases[norm(header)];
      if (key) keys.add(key);
    });
  }
  return keys;
}

function headerRowIndex(rows: string[][]) {
  const limit = Math.min(rows.length, 6);
  let best = 0;
  let bestScore = -1;
  for (let index = 0; index < limit; index += 1) {
    const score = recognized(rows[index] ?? []).size;
    if (score > bestScore) {
      best = index;
      bestScore = score;
    }
  }
  return bestScore > 0 ? best : 0;
}

function classify(name: string, keys: Set<string>): Kind {
  const label = norm(name);
  const score = {
    scholar: ["current_or_past", "scholar_or_trainee", "training_level", "progress", "adrc_affiliated", "adrd_field", "cohort_year", "mentors"].filter((key) => keys.has(key)).length,
    faculty: ["title", "theme", "executive_committee", "institution_department", "mentor_active_start", "faculty_last_name"].filter((key) => keys.has(key)).length,
    program: ["program", "trainees_per_year", "minority_researchers", "focus", "preceptor"].filter((key) => keys.has(key)).length,
    event: ["event_title", "event_description", "attendance", "platform", "event_other"].filter((key) => keys.has(key)).length,
  };
  const hinted: Kind | null = /scholar|trainee|\bg1\b/.test(label)
    ? "scholar"
    : /faculty/.test(label)
      ? "faculty"
      : /program/.test(label)
        ? "program"
        : /event|\bg2\b/.test(label)
          ? "event"
          : null;
  if (hinted === "scholar" || hinted === "faculty" || hinted === "program" || hinted === "event") {
    if (score[hinted] > 0 || keys.has("last_name") || keys.has("full_name") || keys.has("program") || keys.has("event_title") || keys.has("faculty_last_name")) {
      return hinted;
    }
  }
  if (keys.has("faculty_last_name") || keys.has("faculty_first_name") || keys.has("faculty_email") || keys.has("faculty_research_area")) {
    return "intake";
  }
  const ranked = Object.entries(score).sort((a, b) => b[1] - a[1]);
  if (ranked[0][1] === 0) {
    if (keys.has("program")) return "program";
    if (keys.has("event_title")) return "event";
    if (keys.has("last_name") || keys.has("full_name") || keys.has("first_name")) return "scholar";
    return "unknown";
  }
  if (ranked[0][1] === ranked[1][1]) return "intake";
  return ranked[0][0] as Kind;
}

function readSheet(sheet: SheetGrid, plan: ExcelImportPlan) {
  const rows = sheet.rows.filter((row) => row.some((cell) => cell.trim() !== ""));
  if (rows.length === 0) return;
  const headerAt = headerRowIndex(rows);
  const headers = rows[headerAt] ?? [];
  const keys = recognized(headers);
  const kind = classify(sheet.name, keys);
  if (kind === "unknown") {
    plan.warnings.push(`“${sheet.name || "Sheet"}” was skipped. Use the template column names.`);
    return;
  }
  const data = rows.slice(headerAt + 1);
  if (data.length === 0) {
    plan.warnings.push(`“${sheet.name || "Sheet"}” has column names and no rows.`);
    return;
  }
  data.forEach((row, index) => {
    const line = headerAt + index + 2;
    if (kind === "scholar" || kind === "intake") addScholar(sheet.name, line, row, headers, plan);
    if (kind === "faculty" || kind === "intake") addFaculty(sheet.name, line, row, headers, plan);
    if (kind === "program" || kind === "intake") addProgram(sheet.name, line, row, headers, plan);
    if (kind === "event" || kind === "intake") addEvent(sheet.name, line, row, headers, plan);
  });
}

function values(row: string[], headers: string[], aliases: Record<string, string>) {
  const columns = headerMap(headers, aliases);
  return {
    columns,
    get(key: string) {
      const index = columns.get(key);
      if (index === undefined) return undefined;
      return (row[index] ?? "").trim();
    },
  };
}

function addScholar(sheet: string, line: number, row: string[], headers: string[], plan: ExcelImportPlan) {
  const source = values(row, headers, SCHOLAR_ALIASES);
  const name = readPerson(source.get("last_name"), source.get("first_name"), source.get("full_name"));
  if (!name) return;
  if (!name.last && !name.first) return;
  const record: ScholarImport = { last_name: name.last, first_name: name.first };
  assignText(record, source, ["email", "department", "cohort_year", "training_level", "research_area", "progress", "mentors", "primary_preceptor", "project_title", "project_description", "grant_name", "grant_number", "grant_mechanism", "budget_fiscal_year", "notes"]);
  assignDates(record, source, ["mentorship_start_date", "mentorship_end_date", "project_start_date", "project_end_date", "grant_start_date", "grant_end_date"]);
  assignStatus(record, source.get("current_or_past"), sheet, line, plan.warnings);
  assignKind(record, source.get("scholar_or_trainee"));
  assignYesNo(record, "adrc_affiliated", source.get("adrc_affiliated"), sheet, line, plan.warnings, "ADRC");
  assignYesNo(record, "adrd_field", source.get("adrd_field"), sheet, line, plan.warnings, "ADRD");
  assignMoney(record, "budget_total", source.get("budget_total"), sheet, line, plan.warnings);
  assignMoney(record, "budget_annual", source.get("budget_annual"), sheet, line, plan.warnings);
  if (name.starred) plan.warnings.push(`${sheet} row ${line}: a * on the name was ignored for a scholar. Use it on faculty.`);
  plan.scholars.push(record);
}

function addFaculty(sheet: string, line: number, row: string[], headers: string[], plan: ExcelImportPlan) {
  const source = values(row, headers, FACULTY_ALIASES);
  const last = source.get("faculty_last_name") ?? source.get("last_name");
  const first = source.get("faculty_first_name") ?? source.get("first_name");
  const name = readPerson(last, first, source.get("full_name"));
  if (!name || (!name.last && !name.first)) return;
  const record: FacultyImport = { last_name: name.last, first_name: name.first };
  const email = source.get("faculty_email") ?? source.get("email");
  const research = source.get("faculty_research_area") ?? source.get("research_area");
  if (email !== undefined) record.email = email || null;
  if (research !== undefined) record.research_area = research || null;
  assignText(record, source, ["title", "institution_department", "theme", "notes"]);
  assignDates(record, source, ["mentor_active_start", "mentor_active_end"]);
  assignYesNo(record, "executive_committee", source.get("executive_committee"), sheet, line, plan.warnings, "Executive committee");
  const committeeCell = source.get("executive_committee");
  if (name.starred && (committeeCell === undefined || committeeCell === "")) record.executive_committee = 1;
  plan.faculty.push(record);
}

function addProgram(sheet: string, line: number, row: string[], headers: string[], plan: ExcelImportPlan) {
  const source = values(row, headers, PROGRAM_ALIASES);
  const program = source.get("program");
  if (program === undefined || program === "") return;
  const record: ProgramImport = { program };
  assignText(record, source, ["trainees_per_year", "minority_researchers", "focus", "preceptor", "notes"]);
  assignDates(record, source, ["program_start", "program_end"]);
  plan.programs.push(record);
  void line;
}

function addEvent(sheet: string, line: number, row: string[], headers: string[], plan: ExcelImportPlan) {
  const source = values(row, headers, EVENT_ALIASES);
  const title = source.get("event_title");
  const description = source.get("event_description");
  if ((title === undefined || title === "") && (description === undefined || description === "")) return;
  const record: EventImport = { event_title: title || description || "New event" };
  if (description !== undefined) record.event_description = description || null;
  assignText(record, source, ["attendance", "platform", "event_other"]);
  plan.events.push(record);
  void sheet;
  void line;
}

function readPerson(last: string | undefined, first: string | undefined, full: string | undefined) {
  const lastBlank = last === undefined || last === "";
  const firstBlank = first === undefined || first === "";
  if (lastBlank && firstBlank) {
    if (full === undefined || full === "") return null;
    return splitFullName(full);
  }
  const lastStar = starred(last ?? "");
  const firstStar = starred(first ?? "");
  return {
    last: stripStar(last ?? ""),
    first: stripStar(first ?? ""),
    starred: lastStar || firstStar,
  };
}

function splitFullName(full: string) {
  const marked = starred(full);
  const cleaned = stripStar(full);
  const comma = cleaned.indexOf(",");
  if (comma >= 0) {
    return { last: cleaned.slice(0, comma).trim(), first: cleaned.slice(comma + 1).trim(), starred: marked };
  }
  return { last: cleaned, first: "", starred: marked };
}

function starred(value: string) {
  return /\*\s*$/.test(value.trim());
}

function stripStar(value: string) {
  return value.trim().replace(/\*+\s*$/, "").trim();
}

function assignText<T extends object>(record: T, source: { get(key: string): string | undefined }, keys: string[]) {
  for (const key of keys) {
    const raw = source.get(key);
    if (raw === undefined) continue;
    (record as Record<string, string | null>)[key] = raw || null;
  }
}

function assignDates<T extends object>(record: T, source: { get(key: string): string | undefined }, keys: string[]) {
  for (const key of keys) {
    if (!DATE_FIELDS.has(key)) continue;
    const raw = source.get(key);
    if (raw === undefined) continue;
    (record as Record<string, string | null>)[key] = raw ? normalizeDate(raw) : null;
  }
}

function assignStatus(record: ScholarImport, raw: string | undefined, sheet: string, line: number, warnings: string[]) {
  if (raw === undefined) return;
  if (!raw) {
    record.current_or_past = "";
    return;
  }
  const match = raw.match(/^(current|past)\b\s*(.*)$/i);
  if (!match) {
    record.current_or_past = raw;
    warnings.push(`${sheet} row ${line}: “${raw}” is not Current or Past, so it was kept as written.`);
    return;
  }
  record.current_or_past = match[1].toLowerCase() === "past" ? "Past" : "Current";
  const extra = match[2].replace(/^\((.*)\)\s*$/, "$1").trim();
  if (extra && record.cohort_year === undefined && /\d{4}/.test(extra)) record.cohort_year = extra;
}

function assignKind(record: ScholarImport, raw: string | undefined) {
  if (raw === undefined) return;
  if (!raw) {
    record.scholar_or_trainee = "";
    return;
  }
  const scholar = /scholar/i.test(raw);
  const trainee = /trainee/i.test(raw);
  if (scholar && !trainee) record.scholar_or_trainee = "Scholar";
  else if (trainee && !scholar) record.scholar_or_trainee = "Trainee";
  else record.scholar_or_trainee = raw;
}

function assignYesNo<T extends object>(record: T, key: string, raw: string | undefined, sheet: string, line: number, warnings: string[], label: string) {
  if (!YES_NO_FIELDS.has(key) || raw === undefined) return;
  const value = raw.trim().toLowerCase();
  if (!value) {
    (record as Record<string, number | null>)[key] = key === "executive_committee" ? 0 : null;
    return;
  }
  if (value === "*" || value === "y" || value === "true" || value === "1" || value.startsWith("yes")) {
    (record as Record<string, number | null>)[key] = 1;
    return;
  }
  if (value === "n" || value === "false" || value === "0" || value.startsWith("no")) {
    (record as Record<string, number | null>)[key] = 0;
    return;
  }
  (record as Record<string, number | null>)[key] = key === "executive_committee" ? 0 : null;
  warnings.push(`${sheet} row ${line}: ${label} “${raw}” was not imported. Use Yes or No.`);
}

function assignMoney<T extends object>(record: T, key: string, raw: string | undefined, sheet: string, line: number, warnings: string[]) {
  if (!MONEY_FIELDS.has(key) || raw === undefined) return;
  if (!raw.trim()) {
    (record as Record<string, number | null>)[key] = null;
    return;
  }
  const amount = Number(raw.replace(/[$,]/g, ""));
  if (!Number.isFinite(amount)) {
    (record as Record<string, number | null>)[key] = null;
    warnings.push(`${sheet} row ${line}: budget “${raw}” is not a number, so it was left blank.`);
    return;
  }
  (record as Record<string, number | null>)[key] = amount;
}

function normalizeDate(value: string) {
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed.slice(0, 10);
  const match = trimmed.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})$/);
  if (!match) return trimmed;
  const year = match[3].length === 2 ? (Number(match[3]) > 50 ? `19${match[3]}` : `20${match[3]}`) : match[3];
  return `${year}-${match[1].padStart(2, "0")}-${match[2].padStart(2, "0")}`;
}

function foldPeople<T extends { last_name: string; first_name: string }>(rows: T[], warnings: string[], label: string) {
  const byName = new Map<string, T>();
  const order: string[] = [];
  for (const row of rows) {
    const key = `${row.last_name.toLowerCase()}|${row.first_name.toLowerCase()}`;
    const existing = byName.get(key);
    if (!existing) {
      byName.set(key, row);
      order.push(key);
      continue;
    }
    byName.set(key, { ...existing, ...stripUndefined(row) });
    warnings.push(`Combined duplicate ${label} rows for ${row.first_name} ${row.last_name}.`.replace(/\s+/g, " ").trim());
  }
  return order.map((key) => byName.get(key)!);
}

function foldPrograms(rows: ProgramImport[], warnings: string[]) {
  const byName = new Map<string, ProgramImport>();
  const order: string[] = [];
  for (const row of rows) {
    const key = row.program.toLowerCase();
    const existing = byName.get(key);
    if (!existing) {
      byName.set(key, row);
      order.push(key);
      continue;
    }
    byName.set(key, { ...existing, ...stripUndefined(row), program: row.program });
    warnings.push(`Combined duplicate program rows for ${row.program}.`);
  }
  return order.map((key) => byName.get(key)!);
}

function stripUndefined<T extends object>(row: T): T {
  const next = { ...row };
  for (const key of Object.keys(next) as (keyof T)[]) {
    if (next[key] === undefined) delete next[key];
  }
  return next;
}
