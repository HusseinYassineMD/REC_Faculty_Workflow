import Link from "next/link";
import AppShell from "@/components/AppShell";
import RosterDataTable from "@/components/RosterDataTable";
import { listPrograms } from "@/lib/rec-data";
import { PROGRAM_VIEW_HEADERS, programToExportRow } from "@/lib/rppr-standards";

export default function ProgramsViewPage() {
  const programs = listPrograms().sort((a, b) =>
    a.program.localeCompare(b.program, undefined, { sensitivity: "base" })
  );
  const rows = programs.map(programToExportRow);
  const ids = programs.map((p) => p.id);

  return (
    <AppShell
      title="USC training programs"
      subtitle="Programs view — ADRD and minority scholar pathways."
      activeHref="/programs"
    >
      <div className="mb-6">
        <Link href="/forms/program" className="btn-primary">
          + Program intake
        </Link>
      </div>
      <RosterDataTable
        title="Programs view"
        headers={[...PROGRAM_VIEW_HEADERS]}
        rows={rows}
        exportFilename="rec-programs-view.csv"
        editHrefPrefix="/forms/program"
        idByRow={ids}
      />
    </AppShell>
  );
}
