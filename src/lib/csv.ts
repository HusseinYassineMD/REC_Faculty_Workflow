import fs from "fs";
import path from "path";

export function parseCsv(filePath: string): Record<string, string>[] {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf-8");
  const lines = raw.split(/\r?\n/).filter((l) => l.trim() !== "");
  if (lines.length < 2) return [];
  const header = parseLine(lines[0]);
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseLine(lines[i]);
    const row: Record<string, string> = {};
    header.forEach((key, idx) => {
      row[key] = (cols[idx] ?? "").trim();
    });
    rows.push(row);
  }
  return rows;
}

function parseLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else inQuotes = !inQuotes;
    } else if (c === "," && !inQuotes) {
      out.push(cur);
      cur = "";
    } else cur += c;
  }
  out.push(cur);
  return out;
}

export function writeCsv(
  filePath: string,
  header: string[],
  rows: Record<string, string>[]
): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const lines = [
    header.join(","),
    ...rows.map((row) =>
      header
        .map((col) => {
          const v = row[col] ?? "";
          if (v.includes(",") || v.includes('"') || v.includes("\n")) {
            return `"${v.replace(/"/g, '""')}"`;
          }
          return v;
        })
        .join(",")
    ),
  ];
  fs.writeFileSync(filePath, lines.join("\n") + "\n", "utf-8");
}

export function parseBool(v: string | undefined): boolean {
  if (!v) return false;
  return ["1", "true", "yes", "y", "on"].includes(v.trim().toLowerCase());
}
