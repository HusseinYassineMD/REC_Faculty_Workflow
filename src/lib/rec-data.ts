import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import type { FacultyRow, ProgramRow, ScholarRow } from "./types";
import * as demo from "./rec-data-demo";

export const isStaticSite = demo.isStaticSite;

function db() {
  noStore();
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("@/lib/db") as typeof import("@/lib/db");
}

export function getCounts() {
  if (isStaticSite) return demo.getCounts();
  return db().getCounts();
}

export function listScholars(): ScholarRow[] {
  if (isStaticSite) return demo.listScholars();
  return db().listScholars();
}

export function listFaculty(): FacultyRow[] {
  if (isStaticSite) return demo.listFaculty();
  return db().listFaculty();
}

export function listPrograms(): ProgramRow[] {
  if (isStaticSite) return demo.listPrograms();
  return db().listPrograms();
}

export function getScholar(id: number): ScholarRow | undefined {
  if (isStaticSite) return demo.listScholars().find((s) => s.id === id);
  return db().getScholar(id);
}

export function getFaculty(id: number): FacultyRow | undefined {
  if (isStaticSite) return demo.listFaculty().find((f) => f.id === id);
  return db().getFaculty(id);
}

export function getProgram(id: number): ProgramRow | undefined {
  if (isStaticSite) return demo.listPrograms().find((p) => p.id === id);
  return db().getProgram(id);
}

/** Events added from the intake form. The speaker series stays in the bundled table. */
export function listStoredEvents(): string[][] {
  if (isStaticSite) return [];
  return db().listStoredEvents();
}
