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

export async function getCounts() {
  if (isStaticSite) return demo.getCounts();
  return db().getCounts();
}

export async function listScholars(): Promise<ScholarRow[]> {
  if (isStaticSite) return demo.listScholars();
  return db().listScholars();
}

export async function listFaculty(): Promise<FacultyRow[]> {
  if (isStaticSite) return demo.listFaculty();
  return db().listFaculty();
}

export async function listPrograms(): Promise<ProgramRow[]> {
  if (isStaticSite) return demo.listPrograms();
  return db().listPrograms();
}

export async function getScholar(id: number): Promise<ScholarRow | undefined> {
  if (isStaticSite) return demo.listScholars().find((s) => s.id === id);
  return db().getScholar(id);
}

export async function getFaculty(id: number): Promise<FacultyRow | undefined> {
  if (isStaticSite) return demo.listFaculty().find((f) => f.id === id);
  return db().getFaculty(id);
}

export async function getProgram(id: number): Promise<ProgramRow | undefined> {
  if (isStaticSite) return demo.listPrograms().find((p) => p.id === id);
  return db().getProgram(id);
}

/** Events added from the intake form. The speaker series stays in the bundled table. */
export async function listStoredEvents(): Promise<string[][]> {
  if (isStaticSite) return [];
  return db().listStoredEvents();
}
