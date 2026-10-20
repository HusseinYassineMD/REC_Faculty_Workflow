import Link from "next/link";
import AppShell from "@/components/AppShell";

export default function PreviewProgramForm() {
  return (
    <AppShell
      title="USC training programs (preview)"
      subtitle="Placeholder form — demo only on this site."
      activeHref="/forms/program"
    >
      <div className="form-shell">
        <div className="form-shell-header">
          <h2 className="font-display text-2xl font-bold text-cpbh-navy">Program form preview</h2>
        </div>
        <div className="form-shell-body space-y-4 text-sm text-slate-600">
          <p>Browse programs on the dashboard, or run the app locally to add or edit records.</p>
          <Link href="/dashboard" className="btn-primary inline-flex">
            Back to dashboard
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
