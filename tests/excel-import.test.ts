import { describe, expect, it } from "vitest";
import { planFromSheets, TEMPLATE_SHEETS } from "@/lib/excel-import";

describe("excel import", () => {
  it("reads a G1-style scholar row and keeps scholar distinct from trainee", () => {
    const plan = planFromSheets([
      {
        name: "Table G1",
        rows: [
          ["Last name, First name", "Current or Past Trainee", "Scholar or Trainee", "Level of Training", "Area of Research", "Currently Affiliated with an ADRC?"],
          ["Yu, Kexin", "Past (2022-2023)", "REC Scholar", "PhD candidate", "Social isolation", "Yes"],
          ["Fenton, Laura", "Current", "Trainee", "PhD student", "Caregiving", "No"],
        ],
      },
    ]);

    expect(plan.scholars).toEqual([
      expect.objectContaining({
        last_name: "Yu",
        first_name: "Kexin",
        current_or_past: "Past",
        cohort_year: "2022-2023",
        scholar_or_trainee: "Scholar",
        training_level: "PhD candidate",
        research_area: "Social isolation",
        adrc_affiliated: 1,
      }),
      expect.objectContaining({
        last_name: "Fenton",
        first_name: "Laura",
        current_or_past: "Current",
        scholar_or_trainee: "Trainee",
        adrc_affiliated: 0,
      }),
    ]);
    expect(plan.faculty).toHaveLength(0);
  });

  it("marks a faculty name ending in * as executive committee", () => {
    const plan = planFromSheets([
      {
        name: "Faculty",
        rows: [
          ["Last name", "First name", "Title", "Research area"],
          ["Yassine*", "Hussein", "Professor", "Lipid metabolism"],
        ],
      },
    ]);
    expect(plan.faculty[0]).toMatchObject({
      last_name: "Yassine",
      first_name: "Hussein",
      title: "Professor",
      research_area: "Lipid metabolism",
      executive_committee: 1,
    });
  });

  it("reads programs and a one-row intake sheet with a person and a program", () => {
    const plan = planFromSheets([
      {
        name: "Programs",
        rows: [
          ["Program name", "Preceptor", "Program start"],
          ["RCMAR", "Dana Goldman and Julie Zissimopoulos", "3/1/2024"],
        ],
      },
      {
        name: "Sheet1",
        rows: [
          ["Title row"],
          ["Last name", "First name", "Scholar or trainee", "Faculty last name", "Faculty first name", "Program name"],
          ["Ahuja", "Ashim", "Scholar", "Ringman", "John", "New program"],
        ],
      },
    ]);
    expect(plan.programs.map((row) => row.program)).toEqual(["RCMAR", "New program"]);
    expect(plan.programs[0].program_start).toBe("2024-03-01");
    expect(plan.scholars[0]).toMatchObject({ last_name: "Ahuja", first_name: "Ashim", scholar_or_trainee: "Scholar" });
    expect(plan.faculty[0]).toMatchObject({ last_name: "Ringman", first_name: "John" });
  });

  it("accepts every column on the downloadable template", () => {
    for (const sheet of TEMPLATE_SHEETS) {
      const plan = planFromSheets([{ name: sheet.name, rows: [sheet.headers] }]);
      expect(plan.warnings.some((warning) => warning.includes(sheet.name))).toBe(true);
    }
  });
});
