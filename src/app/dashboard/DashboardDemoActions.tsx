"use client";

import { useDemoToast } from "@/components/DemoToast";

export default function DashboardDemoActions() {
  const { show, Toast } = useDemoToast();

  return (
    <>
      {Toast}
      <div className="ml-auto flex flex-wrap gap-2">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => show("CSV export will run against the live database.")}
        >
          Export CSV
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={() => show("Roster sync will refresh metrics dashboards.")}
        >
          Rebuild roster JSON
        </button>
      </div>
    </>
  );
}
