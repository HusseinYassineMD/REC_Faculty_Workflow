import AppShell from "@/components/AppShell";
import FormSection, { Field } from "@/components/FormSection";
import PreviewFormFooter from "@/components/PreviewFormFooter";
import type { ProgramRow } from "@/lib/types";

export default function ProgramFormPreviewServer({
  row,
  mode,
}: {
  row: ProgramRow;
  mode: "new" | "edit";
}) {
  const isEdit = mode === "edit";
  const v = (key: keyof ProgramRow) => String(row[key] ?? "");

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
              <input name="program" readOnly value={v("program")} />
            </Field>
            <Field label="Post-doc trainees / year" name="trainees_per_year">
              <input name="trainees_per_year" readOnly value={v("trainees_per_year")} />
            </Field>
            <Field label="% minority researchers" name="minority_researchers">
              <input name="minority_researchers" readOnly value={v("minority_researchers")} />
            </Field>
            <Field label="Focus" name="focus" span2>
              <textarea name="focus" rows={3} readOnly value={v("focus")} />
            </Field>
            <Field label="Preceptor" name="preceptor" span2>
              <input name="preceptor" readOnly value={v("preceptor")} />
            </Field>
            <Field label="Program start" name="program_start">
              <input name="program_start" type="date" readOnly value={row.program_start ?? "2018-09-01"} />
            </Field>
            <Field label="Program end" name="program_end">
              <input name="program_end" type="date" readOnly value={row.program_end ?? ""} />
            </Field>
            <Field label="Notes" name="notes" span2>
              <textarea name="notes" rows={2} readOnly value={v("notes")} />
            </Field>
          </FormSection>
        </div>
        <PreviewFormFooter />
      </div>
    </AppShell>
  );
}
