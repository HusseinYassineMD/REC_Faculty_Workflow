import { readFileSync } from "fs";
import { expect, it } from "vitest";

function loadHostedEnv() {
  const text = readFileSync(".env", "utf8");
  for (const line of text.split("\n")) {
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const index = line.indexOf("=");
    const key = line.slice(0, index);
    if (key === "TURSO_DATABASE_URL" || key === "TURSO_AUTH_TOKEN") process.env[key] = line.slice(index + 1);
  }
}

it.skipIf(process.env.RUN_HOSTED_DB !== "1")("imports and removes a throwaway row on the hosted database three times", async () => {
  loadHostedEnv();
  const { deleteFacultyRecord, deleteProgramRecord, deleteScholarRecord, importExcelRoster } = await import(
    "@/server/rec-actions"
  );
  const { listFaculty, listPrograms, listScholars } = await import("@/lib/db");

  const snapshot = async () => ({
    scholars: (await listScholars()).map((row) => `${row.scholar_or_trainee}|${row.current_or_past}|${row.first_name}|${row.last_name}|${row.research_area}`).sort(),
    faculty: (await listFaculty()).map((row) => `${row.executive_committee}|${row.first_name}|${row.last_name}|${row.title}`).sort(),
    programs: (await listPrograms()).map((row) => `${row.program}|${row.preceptor}|${row.focus}`).sort(),
  });

  async function clearThrowaway() {
    for (const row of await listScholars()) {
      if (row.last_name === "Zzlive") await deleteScholarRecord(row.id);
    }
    for (const row of await listFaculty()) {
      if (row.last_name === "Zzlive") await deleteFacultyRecord(row.id);
    }
    for (const row of await listPrograms()) {
      if (row.program === "Zzlive Program") await deleteProgramRecord(row.id);
    }
  }

  await clearThrowaway();
  const before = await snapshot();
  expect(before.scholars).toHaveLength(15);
  expect(before.faculty).toHaveLength(13);
  expect(before.programs).toHaveLength(7);

  for (let pass = 1; pass <= 3; pass += 1) {
    const added = await importExcelRoster([
      {
        name: "Scholars and trainees",
        rows: [
          ["Last name", "First name", "Scholar or trainee", "Current or past", "Area of research"],
          ["Zzlive", "Check", "Trainee", "Past", `Hosted ${pass}`],
        ],
      },
      {
        name: "Faculty",
        rows: [
          ["Last name", "First name", "Title", "Executive committee"],
          ["Zzlive", "Check", "Lecturer", "Yes (*)"],
        ],
      },
      {
        name: "Programs",
        rows: [
          ["Program name", "Focus"],
          ["Zzlive Program", `Hosted focus ${pass}`],
        ],
      },
    ]);
    expect("error" in added).toBe(false);
    const scholar = (await listScholars()).find((row) => row.last_name === "Zzlive");
    const faculty = (await listFaculty()).find((row) => row.last_name === "Zzlive");
    const program = (await listPrograms()).find((row) => row.program === "Zzlive Program");
    expect(scholar?.scholar_or_trainee).toBe("Trainee");
    expect(scholar?.current_or_past).toBe("Past");
    expect(scholar?.research_area).toBe(`Hosted ${pass}`);
    expect(faculty?.executive_committee).toBe(1);
    expect(program?.focus).toBe(`Hosted focus ${pass}`);
    expect((await listScholars()).filter((row) => row.last_name === "Zzlive")).toHaveLength(1);
    await clearThrowaway();
  }

  const after = await snapshot();
  expect(after).toEqual(before);
}, 60000);
