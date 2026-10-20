#!/usr/bin/env node
/** Export roster JSON for GitHub Pages static demo (no sqlite in CI). */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dbPath = path.join(root, "data/rec_workflow.sqlite");
const outPath = path.join(root, "src/data/demo-roster.json");

async function main() {
  if (!fs.existsSync(dbPath)) {
    console.error("No sqlite at", dbPath, "— run npm run dev once locally first.");
    process.exit(1);
  }
  const Database = (await import("better-sqlite3")).default;
  const db = new Database(dbPath, { readonly: true });
  const payload = {
    exportedAt: new Date().toISOString(),
    scholars: db.prepare("SELECT * FROM scholars_trainees ORDER BY updated_at DESC").all(),
    faculty: db.prepare("SELECT * FROM faculty ORDER BY last_name, first_name").all(),
    programs: db.prepare("SELECT * FROM training_programs ORDER BY program").all(),
  };
  db.close();
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2) + "\n");
  console.log("Wrote", outPath, {
    scholars: payload.scholars.length,
    faculty: payload.faculty.length,
    programs: payload.programs.length,
  });
}

main();
