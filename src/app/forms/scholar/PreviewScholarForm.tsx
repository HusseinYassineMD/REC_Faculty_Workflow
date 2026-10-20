import Link from "next/link";
import AppShell from "@/components/AppShell";

export default function PreviewScholarForm() {
  return (
    <AppShell
      title="Scholar / trainee intake (preview)"
      subtitle="Form layout preview — editing is available in the local app only."
      activeHref="/forms/scholar"
    >
      <div className="form-shell">
        <div className="form-shell-header">
          <h2 className="font-display text-2xl font-bold text-cpbh-navy">Intake form preview</h2>
          <p className="mt-1 text-sm text-slate-500">
            Sections include identity, research, mentorship, project, grant timeline, and budget.
          </p>
        </div>
        <div className="form-shell-body space-y-4 text-sm text-slate-600">
          <p>Use the dashboard cards to browse real demo records, or clone the repo to run full data entry locally.</p>
          <Link href="/dashboard" className="btn-primary inline-flex">
            Back to dashboard
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
