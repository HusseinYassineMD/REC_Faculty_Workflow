import { readFileSync } from "fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { FacultyCard, ProgramCard, ScholarCard } from "@/components/RosterCards";
import ViewsBrowser from "@/app/views/ViewsBrowser";
import type { FacultyRow, ProgramRow, ScholarRow } from "@/lib/types";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh() {}, push() {} }),
  useSearchParams: () => new URLSearchParams(),
}));

function scholar(): ScholarRow {
  return {
    id: 41,
    last_name: "Ahuja",
    first_name: "Ashim",
    email: null,
    department: null,
    cohort_year: null,
    current_or_past: "Current",
    scholar_or_trainee: "Scholar",
    training_level: "MD",
    research_area: "Lewy body disease",
    progress: null,
    adrc_affiliated: null,
    adrd_field: null,
    mentors: null,
    primary_preceptor: null,
    project_title: null,
    project_description: null,
    project_start_date: null,
    project_end_date: null,
    mentorship_start_date: null,
    mentorship_end_date: null,
    grant_name: null,
    grant_number: null,
    grant_mechanism: null,
    grant_start_date: null,
    grant_end_date: null,
    budget_total: null,
    budget_annual: null,
    budget_fiscal_year: null,
    notes: null,
    form_status: "submitted",
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
  };
}

function faculty(): FacultyRow {
  return {
    id: 7,
    last_name: "Yassine",
    first_name: "Hussein",
    title: "Associate Professor",
    institution_department: "USC / Medicine",
    theme: "Metabolism",
    research_area: null,
    executive_committee: 1,
    email: "hyassine@usc.edu",
    mentor_active_start: null,
    mentor_active_end: null,
    notes: null,
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
  };
}

function program(): ProgramRow {
  return {
    id: 3,
    program: "T32 Gerontology",
    trainees_per_year: "5",
    minority_researchers: null,
    focus: "Aging",
    preceptor: "Eileen Crimmins",
    program_start: null,
    program_end: null,
    notes: null,
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
  };
}

describe("edit and delete controls", () => {
  it("shows Edit and Delete on a scholar card", () => {
    const html = renderToStaticMarkup(<ScholarCard person={scholar()} />);
    expect(html).toContain("Edit");
    expect(html).toContain("Delete");
    expect(html).toContain("Ashim Ahuja");
  });

  it("shows Edit and Delete on a faculty card", () => {
    const html = renderToStaticMarkup(<FacultyCard person={faculty()} />);
    expect(html).toContain("Edit");
    expect(html).toContain("Delete");
    expect(html).toContain("Hussein Yassine");
  });

  it("shows Edit and Delete on a program card", () => {
    const html = renderToStaticMarkup(<ProgramCard program={program()} />);
    expect(html).toContain("Edit");
    expect(html).toContain("Delete");
    expect(html).toContain("T32 Gerontology");
  });

  it("shows Edit and Delete on each Views row", () => {
    const html = renderToStaticMarkup(
      <ViewsBrowser scholars={[scholar()]} faculty={[faculty()]} programs={[program()]} />
    );
    expect(html).toContain("Edit");
    expect(html).toContain("Delete");
    expect(html).toContain("Actions");
  });

  it("does not send a public error back to this computer", () => {
    const errorPage = readFileSync("src/app/error.tsx", "utf8");
    const globalError = readFileSync("src/app/global-error.tsx", "utf8");
    expect(errorPage).not.toMatch(/127\.0\.0\.1|localhost/);
    expect(globalError).not.toMatch(/127\.0\.0\.1|localhost|npm run dev/);
    expect(errorPage).toContain("Back to the overview");
    expect(errorPage).toContain('href="/"');
  });
});
