import { Suspense } from "react";
import ProgramFormPreview from "./ProgramFormPreview";

export default function PreviewProgramForm() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-slate-500">Loading form…</div>}>
      <ProgramFormPreview />
    </Suspense>
  );
}
