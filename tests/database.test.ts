import { afterEach, describe, expect, it } from "vitest";
import { SCHEMA_SQL } from "@/lib/schema-sql";
import { remoteDatabaseConfig } from "@/lib/sql-db";
import {
  deleteFacultyRecord,
  deleteProgramRecord,
  deleteScholarRecord,
  saveIntake,
  updateFacultyRecord,
  updateProgramRecord,
  updateScholarRecord,
} from "@/server/rec-actions";
import { getFaculty, getProgram, getScholar, listFaculty, listPrograms, listScholars, listStoredEvents } from "@/lib/db";

function form(entries: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(entries)) data.set(key, value);
  return data;
}

describe("hosted database settings", () => {
  afterEach(() => {
    process.env.TURSO_DATABASE_URL = "";
    process.env.TURSO_AUTH_TOKEN = "";
    process.env.NEXT_PUBLIC_STATIC_SITE = "0";
  });

  it("uses the hosted database only when both settings are present", () => {
    expect(remoteDatabaseConfig()).toBeNull();
    process.env.TURSO_DATABASE_URL = "libsql://rec-faculty.example.turso.io";
    process.env.TURSO_AUTH_TOKEN = "test-token";
    expect(remoteDatabaseConfig()).toEqual({
      url: "libsql://rec-faculty.example.turso.io",
      authToken: "test-token",
    });
  });

  it("refuses to start when only one hosted setting is present", () => {
    process.env.TURSO_DATABASE_URL = "libsql://rec-faculty.example.turso.io";
    expect(() => remoteDatabaseConfig()).toThrow(/both/i);
  });

  it("ships the roster tables inside the app", () => {
    for (const table of ["faculty", "training_programs", "scholars_trainees", "rec_events", "report_snapshots"]) {
      expect(SCHEMA_SQL).toContain(`CREATE TABLE IF NOT EXISTS ${table}`);
    }
  });
});

describe("intake, edit, and delete", () => {
  afterEach(() => {
    process.env.NEXT_PUBLIC_STATIC_SITE = "0";
  });

  it("rejects an empty intake form", async () => {
    await expect(saveIntake(new FormData())).resolves.toEqual({
      error: "Enter a name, a program, or an event before submitting.",
    });
  });

  it("saves a scholar, edits the research area, and deletes the person", async () => {
    await expect(
      saveIntake(
        form({
          first_name: "Unit",
          last_name: "Scholar",
          scholar_or_trainee: "Scholar",
          research_area: "Before edit",
        })
      )
    ).resolves.toEqual({ href: "/dashboard?saved=scholar" });

    const created = (await listScholars()).find((row) => row.last_name === "Scholar" && row.first_name === "Unit");
    expect(created?.research_area).toBe("Before edit");

    await expect(
      updateScholarRecord(
        created!.id,
        form({
          first_name: "Unit",
          last_name: "Scholar",
          scholar_or_trainee: "Scholar",
          research_area: "After edit",
        })
      )
    ).resolves.toEqual({ ok: true });
    expect((await getScholar(created!.id))?.research_area).toBe("After edit");

    await expect(updateScholarRecord(created!.id, form({ first_name: "", last_name: "" }))).resolves.toEqual({
      error: "Enter a first or last name.",
    });

    await expect(deleteScholarRecord(created!.id)).resolves.toEqual({ ok: true });
    expect(await getScholar(created!.id)).toBeUndefined();
    await expect(deleteScholarRecord(created!.id)).resolves.toEqual({
      error: "That person is no longer in the database.",
    });
  });

  it("saves, edits, and deletes a faculty member", async () => {
    await expect(
      saveIntake(form({ faculty_first_name: "Unit", faculty_last_name: "Faculty", title: "Professor" }))
    ).resolves.toEqual({ href: "/dashboard?saved=faculty" });

    const created = (await listFaculty()).find((row) => row.last_name === "Faculty" && row.first_name === "Unit");
    expect(created?.title).toBe("Professor");

    await expect(
      updateFacultyRecord(created!.id, form({ faculty_first_name: "Unit", faculty_last_name: "Faculty", title: "Dean" }))
    ).resolves.toEqual({ ok: true });
    expect((await getFaculty(created!.id))?.title).toBe("Dean");

    await expect(deleteFacultyRecord(created!.id)).resolves.toEqual({ ok: true });
    expect(await getFaculty(created!.id)).toBeUndefined();
    await expect(deleteFacultyRecord(created!.id)).resolves.toEqual({
      error: "That faculty member is no longer in the database.",
    });
  });

  it("saves, edits, and deletes a training program", async () => {
    await expect(saveIntake(form({ program: "Unit Program", focus: "Aging" }))).resolves.toEqual({
      href: "/dashboard?saved=program",
    });

    const created = (await listPrograms()).find((row) => row.program === "Unit Program");
    expect(created?.focus).toBe("Aging");

    await expect(updateProgramRecord(created!.id, form({ program: "Unit Program", focus: "Imaging" }))).resolves.toEqual({
      ok: true,
    });
    expect((await getProgram(created!.id))?.focus).toBe("Imaging");

    await expect(updateProgramRecord(created!.id, form({ program: "" }))).resolves.toEqual({
      error: "Enter a program name.",
    });
    await expect(deleteProgramRecord(created!.id)).resolves.toEqual({ ok: true });
    expect(await getProgram(created!.id)).toBeUndefined();
  });

  it("saves an event onto the report list", async () => {
    await expect(saveIntake(form({ event_title: "Unit Seminar" }))).resolves.toEqual({
      href: "/rppr?saved=event",
    });
    const events = await listStoredEvents();
    expect(events.some((row) => row.includes("Unit Seminar"))).toBe(true);
  });

  it("blocks edit and delete on the read-only public preview", async () => {
    process.env.NEXT_PUBLIC_STATIC_SITE = "1";
    await expect(updateScholarRecord(1, form({ first_name: "A", last_name: "B" }))).resolves.toEqual({
      error: "Editing needs the app server and database. The public preview cannot save.",
    });
    await expect(deleteScholarRecord(1)).resolves.toEqual({
      error: "Editing needs the app server and database. The public preview cannot save.",
    });
    await expect(saveIntake(form({ first_name: "A", last_name: "B" }))).resolves.toEqual({
      error: "Saving needs the app server and database. The public preview cannot save.",
    });
  });
});
