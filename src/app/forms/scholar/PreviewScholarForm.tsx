import { Suspense } from "react";
import ScholarFormPreview from "./ScholarFormPreview";

export default function PreviewScholarForm() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-slate-500">Loading form…</div>}>
      <ScholarFormPreview />
    </Suspense>
  );
}
