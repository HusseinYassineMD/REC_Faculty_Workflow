import Link from "next/link";
import AppShell from "@/components/AppShell";
import RosterDataTable from "@/components/RosterDataTable";
import { listScholars } from "@/lib/rec-data";
import {
  SCHOLAR_VIEW_HEADERS,
  sortScholarsForTableG1,
  scholarToViewRow,
} from "@/lib/rppr-standards";

export default function ScholarsViewPage() {
  const scholars = sortScholarsForTableG1(listScholars());
  const rows = scholars.map(scholarToViewRow);
  const ids = scholars.map((s) => s.id);

  return (
    <AppShell
      title="Scholars & trainees"
      subtitle="Sorted: Current → Past, then REC Scholar → Trainee, then last name A–Z (Table G1 order)."
      activeHref="/scholars"
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Link href="/forms/scholar" className="btn-primary">
          + Intake form
        </Link>
        <Link href="/rppr" className="btn-ghost">
          Table G1 (RPPR) →
        </Link>
      </div>
      <RosterDataTable
        title="Scholar view"
        description="Export this table for working drafts; Table G1 on the RPPR tab matches NACC column labels."
        headers={[...SCHOLAR_VIEW_HEADERS]}
        rows={rows}
        exportFilename="rec-scholars-view.csv"
        editHrefPrefix="/forms/scholar"
        idByRow={ids}
      />
    </AppShell>
  );
}
