import { exportCsvAction, syncDashboardAction } from "@/server/rec-actions";

export default function DashboardExportActions() {
  return (
    <div className="ml-auto flex flex-wrap gap-2">
      <form action={exportCsvAction}>
        <button type="submit" className="btn-secondary">
          Export CSV
        </button>
      </form>
      <form action={syncDashboardAction}>
        <button type="submit" className="btn-primary">
          Rebuild roster JSON
        </button>
      </form>
    </div>
  );
}
