import { Suspense } from "react";
import AppShell from "@/components/AppShell";
import { listFaculty, listPrograms, listScholars } from "@/lib/rec-data";
import ViewsBrowser from "./ViewsBrowser";

export default async function ViewsPage() {
  const [scholars, faculty, programs] = await Promise.all([
    listScholars(),
    listFaculty(),
    listPrograms(),
  ]);

  return (
    <AppShell
      title="Views"
      subtitle="Filter the roster, check the people you want, and export that selection as CSV."
    >
      <Suspense fallback={<p className="text-sm text-slate-500">Loading views…</p>}>
        <ViewsBrowser scholars={scholars} faculty={faculty} programs={programs} />
      </Suspense>
    </AppShell>
  );
}
