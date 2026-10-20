import { Suspense } from "react";
import ReportsPageClient from "./ReportsPageClient";

export default function ReportsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-600">Loading reports…</div>}>
      <ReportsPageClient />
    </Suspense>
  );
}
