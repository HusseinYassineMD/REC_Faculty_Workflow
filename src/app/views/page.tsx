import { Suspense } from "react";
import AppShell from "@/components/AppShell";
import { listFaculty, listPrograms, listScholars } from "@/lib/rec-data";
import ViewsBrowser from "./ViewsBrowser";

export default function ViewsPage() {
  return (
    <AppShell
      title="Views"
      subtitle="Look up the roster by scholar / trainee, faculty, or program. Export the table you are looking at."
    >
      <Suspense fallback={<p className="text-sm text-slate-500">Loading views…</p>}>
        <ViewsBrowser
          scholars={listScholars()}
          faculty={listFaculty()}
          programs={listPrograms()}
        />
      </Suspense>
    </AppShell>
  );
}
