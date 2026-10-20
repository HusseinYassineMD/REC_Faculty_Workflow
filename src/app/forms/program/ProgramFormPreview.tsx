"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import FormSection, { Field } from "@/components/FormSection";
import PreviewFormFooter from "@/components/PreviewFormFooter";
import { getProgram, listPrograms } from "@/lib/rec-data-demo";

export default function ProgramFormPreview() {
  const params = useSearchParams();
  const id = parseInt(params.get("id") ?? "0", 10);

  const row = useMemo(() => {
    if (id > 0) return getProgram(id);
    return listPrograms()[0];
  }, [id]);

  if (!row) {
    return (
      <AppShell title="USC training programs" activeHref="/forms/program">
        <p className="text-slate-600">No sample record found.</p>
      </AppShell>
    );
  }

  const isEdit = id > 0;
  const v = (key: keyof typeof row) => String(row[key] ?? "");

  return (
    <AppShell
      title="USC training programs"
      subtitle="ADRD and minority scholar programs — trainees per year, focus, preceptor."
      activeHref="/forms/program"
    >
      <div className="form-shell form-preview">
        <div className="form-shell-header">
          <h2 className="font-display text-2xl font-bold text-cpbh-navy">
            {isEdit ? "Update program" : "Add training program"}
          </h2>
        </div>
        <div className="form-shell-body">
          <FormSection title="Program">
            <Field label="Program name" name="program" required span2>
              <input name="program" disabled value={v("program")} />
            </Field>
            <Field label="Post-doc trainees / year" name="trainees_per_year">
              <input name="trainees_per_year" disabled value={v("trainees_per_year")} />
            </Field>
            <Field label="% minority researchers" name="minority_researchers">
              <input name="minority_researchers" disabled value={v("minority_researchers")} />
            </Field>
            <Field label="Focus" name="focus" span2>
              <textarea name="focus" rows={3} disabled value={v("focus")} />
            </Field>
            <Field label="Preceptor" name="preceptor" span2>
              <input name="preceptor" disabled value={v("preceptor")} />
            </Field>
            <Field label="Program start" name="program_start">
              <input name="program_start" type="date" disabled value={row.program_start ?? "2018-09-01"} />
            </Field>
            <Field label="Program end" name="program_end">
              <input name="program_end" type="date" disabled value={row.program_end ?? ""} />
            </Field>
            <Field label="Notes" name="notes" span2>
              <textarea name="notes" rows={2} disabled value={v("notes")} />
            </Field>
          </FormSection>
        </div>
        <PreviewFormFooter />
      </div>
    </AppShell>
  );
}
