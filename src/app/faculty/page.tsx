import Link from "next/link";
import AppShell from "@/components/AppShell";
import RosterDataTable from "@/components/RosterDataTable";
import { listFaculty } from "@/lib/rec-data";
import { FACULTY_VIEW_HEADERS, facultyToExportRow } from "@/lib/rppr-standards";

export default function FacultyViewPage() {
  const faculty = listFaculty().sort((a, b) =>
    a.last_name.localeCompare(b.last_name, undefined, { sensitivity: "base" })
  );
  const rows = faculty.map((f) => [
    ...facultyToExportRow(f).slice(0, 6),
    f.executive_committee ? "Yes (*)" : "No",
  ]);
  const ids = faculty.map((f) => f.id);

  return (
    <AppShell
      title="Participating REC faculty"
      subtitle="Faculty view — export for RPPR faculty tables. * = executive committee."
      activeHref="/faculty"
    >
      <div className="mb-6">
        <Link href="/forms/faculty" className="btn-primary">
          + Faculty intake
        </Link>
      </div>
      <RosterDataTable
        title="Faculty view"
        headers={[...FACULTY_VIEW_HEADERS]}
        rows={rows}
        exportFilename="rec-faculty-view.csv"
        editHrefPrefix="/forms/faculty"
        idByRow={ids}
      />
    </AppShell>
  );
}
