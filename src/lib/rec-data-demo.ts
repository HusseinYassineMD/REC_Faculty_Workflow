import demoRoster from "@/data/demo-roster.json";
import type { FacultyRow, ProgramRow, ScholarRow } from "./types";

export const isStaticSite = process.env.NEXT_PUBLIC_STATIC_SITE === "1";

type DemoRoster = {
  scholars: ScholarRow[];
  faculty: FacultyRow[];
  programs: ProgramRow[];
};

function demo(): DemoRoster {
  return demoRoster as DemoRoster;
}

export function getCounts() {
  const scholars = demo().scholars;
  return {
    scholars: scholars.length,
    faculty: demo().faculty.length,
    programs: demo().programs.length,
    current_scholars: scholars.filter(
      (s) =>
        s.current_or_past.toLowerCase() === "current" &&
        s.scholar_or_trainee.toLowerCase() === "scholar"
    ).length,
    current_trainees: scholars.filter(
      (s) =>
        s.current_or_past.toLowerCase() === "current" &&
        s.scholar_or_trainee.toLowerCase() === "trainee"
    ).length,
  };
}

export function listScholars(): ScholarRow[] {
  return demo().scholars;
}

export function listFaculty(): FacultyRow[] {
  return demo().faculty;
}

export function listPrograms(): ProgramRow[] {
  return demo().programs;
}
