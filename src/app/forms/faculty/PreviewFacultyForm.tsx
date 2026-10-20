import Link from "next/link";
import AppShell from "@/components/AppShell";

export default function PreviewFacultyForm() {
  return (
    <AppShell
      title="Participating REC faculty (preview)"
      subtitle="Form layout preview — editing is available in the local app only."
      activeHref="/forms/faculty"
    >
      <div className="form-shell">
        <div className="form-shell-header">
          <h2 className="font-display text-2xl font-bold text-cpbh-navy">Faculty form preview</h2>
        </div>
        <div className="form-shell-body space-y-4 text-sm text-slate-600">
          <p>Browse faculty on the dashboard, or run the app locally to add or edit records.</p>
          <Link href="/dashboard" className="btn-primary inline-flex">
            Back to dashboard
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
