import { Suspense } from "react";
import FacultyFormPreview from "./FacultyFormPreview";

export default function PreviewFacultyForm() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-slate-500">Loading form…</div>}>
      <FacultyFormPreview />
    </Suspense>
  );
}
