import type { ScholarRow } from "./types";

export function isActiveAsOf(row: ScholarRow, asOf: string): boolean {
  if (row.current_or_past.toLowerCase() === "past") return false;
  const ends = [
    row.project_end_date,
    row.mentorship_end_date,
    row.grant_end_date,
  ].filter(Boolean);
  if (ends.length === 0) return row.current_or_past.toLowerCase() === "current";
  return ends.some((end) => end! >= asOf);
}
