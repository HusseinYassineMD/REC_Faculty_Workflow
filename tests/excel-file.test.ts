import { mkdtemp, readFile, rm, writeFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { afterAll, describe, expect, it } from "vitest";
import * as XLSX from "xlsx";
import recEvents from "@/data/rec-events.json";
import { deleteFacultyRecord, deleteProgramRecord, deleteScholarRecord, importExcelRoster } from "@/server/rec-actions";
import { getFaculty, getProgram, getScholar, listFaculty, listPrograms, listScholars, listStoredEvents } from "@/lib/db";
import { readWorkbook } from "@/lib/read-workbook";

const dir = await mkdtemp(path.join(tmpdir(), "rec-xlsx-"));

afterAll(async () => {
  await rm(dir, { recursive: true, force: true });
});

function workbook(sheets: { name: string; rows: (string | number)[][] }[]) {
  const book = XLSX.utils.book_new();
  for (const sheet of sheets) {
    XLSX.utils.book_append_sheet(book, XLSX.utils.aoa_to_sheet(sheet.rows), sheet.name);
  }
  return book;
}

async function asImport(fileName: string, sheets: { name: string; rows: (string | number)[][] }[]) {
  const file = path.join(dir, fileName);
  XLSX.writeFile(workbook(sheets), file);
  return readWorkbook(await readFile(file));
}

describe("excel files imported three times", () => {
  it("adds, updates, and keeps scholar, faculty, and program distinctions", async () => {
    const before = {
      scholars: (await listScholars()).length,
      faculty: (await listFaculty()).length,
      programs: (await listPrograms()).length,
    };

    for (let pass = 1; pass <= 3; pass += 1) {
      const created = await importExcelRoster(
        await asImport(`pass-${pass}-add.xlsx`, [
          {
            name: "Scholars and trainees",
            rows: [
              ["Last name", "First name", "Scholar or trainee", "Current or past", "Area of research", "Currently affiliated with an ADRC?"],
              ["Zzfile", "Pass", "REC Scholar", "Current", `Topic ${pass}`, "Yes"],
            ],
          },
          {
            name: "Faculty",
            rows: [
              ["Last name", "First name", "Title", "Executive committee"],
              ["Zzfac*", "Pass", "Professor", ""],
            ],
          },
          {
            name: "Programs",
            rows: [
              ["Program name", "Focus", "Program start"],
              ["Zz Program", `Focus ${pass}`, "4/2/2024"],
            ],
          },
        ])
      );
      expect("error" in created).toBe(false);
      expect((await listScholars()).filter((row) => row.last_name === "Zzfile")).toHaveLength(1);
      expect((await listFaculty()).filter((row) => row.last_name === "Zzfac")).toHaveLength(1);
      expect((await listPrograms()).filter((row) => row.program === "Zz Program")).toHaveLength(1);
    }

    const scholar = (await listScholars()).find((row) => row.last_name === "Zzfile" && row.first_name === "Pass");
    const faculty = (await listFaculty()).find((row) => row.last_name === "Zzfac" && row.first_name === "Pass");
    const program = (await listPrograms()).find((row) => row.program === "Zz Program");
    expect(scholar?.scholar_or_trainee).toBe("Scholar");
    expect(scholar?.current_or_past).toBe("Current");
    expect(scholar?.research_area).toBe("Topic 3");
    expect(scholar?.adrc_affiliated).toBe(1);
    expect(faculty?.executive_committee).toBe(1);
    expect(faculty?.title).toBe("Professor");
    expect(program?.focus).toBe("Focus 3");
    expect(program?.program_start).toBe("2024-04-02");

    const narrowed = await importExcelRoster(
      await asImport("narrow.xlsx", [
        {
          name: "Scholars and trainees",
          rows: [
            ["Last name", "First name", "Area of research"],
            ["Zzfile", "Pass", "Only the topic"],
          ],
        },
      ])
    );
    expect(narrowed).toEqual({ href: "/?saved=1%20scholar%2Ftrainee%20updated" });
    expect((await getScholar(scholar!.id))?.research_area).toBe("Only the topic");
    expect((await getScholar(scholar!.id))?.current_or_past).toBe("Current");
    expect((await getScholar(scholar!.id))?.scholar_or_trainee).toBe("Scholar");
    expect((await getScholar(scholar!.id))?.adrc_affiliated).toBe(1);

    await deleteScholarRecord(scholar!.id);
    await deleteFacultyRecord(faculty!.id);
    await deleteProgramRecord(program!.id);
    expect((await listScholars()).some((row) => row.last_name === "Zzfile")).toBe(false);
    expect((await listFaculty()).some((row) => row.last_name === "Zzfac")).toBe(false);
    expect((await listPrograms()).some((row) => row.program === "Zz Program")).toBe(false);
    expect((await listScholars()).length).toBe(before.scholars);
    expect((await listFaculty()).length).toBe(before.faculty);
    expect((await listPrograms()).length).toBe(before.programs);
  });

  it("reads a G1 workbook, a view export, and a csv without duplicating people", async () => {
    const g1 = await asImport("g1.xlsx", [
      {
        name: "Table G1",
        rows: [
          ["Report title"],
          ["Last name, First name", "Current or Past Trainee", "Scholar or Trainee", "Level of Training", "Area of Research"],
          ["Yu, Kexin", "Past", "REC Scholar", "PhD candidate", "Social isolation"],
          ["Fenton, Laura", "Current", "Trainee", "PhD student", "Caregiving"],
        ],
      },
    ]);
    const first = await importExcelRoster(g1);
    expect("error" in first).toBe(false);
    const second = await importExcelRoster(g1);
    expect("error" in second).toBe(false);
    expect((await listScholars()).filter((row) => row.last_name === "Yu" && row.first_name === "Kexin")).toHaveLength(1);
    expect((await listScholars()).filter((row) => row.last_name === "Fenton" && row.first_name === "Laura")).toHaveLength(1);
    expect((await listScholars()).find((row) => row.last_name === "Fenton")?.scholar_or_trainee).toBe("Trainee");

    const view = await asImport("view.xlsx", [
      {
        name: "Faculty",
        rows: [
          ["Last name", "First name", "Title", "Institution / department", "Theme", "Research area", "Executive committee"],
          ["Yassine*", "Hussein", "Professor", "USC", "Clinical", "Lipids", "Yes (*)"],
        ],
      },
    ]);
    expect("error" in (await importExcelRoster(view))).toBe(false);
    expect((await listFaculty()).filter((row) => row.last_name === "Yassine")).toHaveLength(1);
    expect((await getFaculty((await listFaculty()).find((row) => row.last_name === "Yassine")!.id))?.executive_committee).toBe(1);

    const csvPath = path.join(dir, "events.csv");
    await writeFile(csvPath, `"Event, date(s), sponsors",Attendance\nZzfile seminar check,12\n`, "utf8");
    const csv = await readWorkbook(await readFile(csvPath));
    const added = await importExcelRoster(csv);
    expect(added).toEqual({ href: "/?saved=1%20event%20added" });
    expect((await listStoredEvents()).some((row) => row[0] === "Zzfile seminar check")).toBe(true);
    const again = await importExcelRoster(csv);
    expect(again).toEqual({ error: "Those events are already on the report. Nothing new was imported." });
    expect((await listStoredEvents()).filter((row) => row[0] === "Zzfile seminar check")).toHaveLength(1);

    const known = await importExcelRoster(
      await asImport("known-event.xlsx", [
        {
          name: "Events",
          rows: [["Event, date(s), sponsors"], [recEvents[0][0]]],
        },
      ])
    );
    expect(known).toEqual({ error: "Those events are already on the report. Nothing new was imported." });
  });
});
