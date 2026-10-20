import Link from "next/link";
import AppShell from "@/components/AppShell";
import FormSection, { Field } from "@/components/FormSection";
import { saveProgram } from "@/server/rec-actions";
import { getProgram } from "@/lib/rec-data";

export default function EditableProgramForm({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const id = parseInt(searchParams.id ?? "0", 10);
  const row = id > 0 ? getProgram(id) : undefined;
  const v = (key: keyof NonNullable<typeof row>) =>
    row ? String(row[key] ?? "") : "";

  return (
    <AppShell
      title="USC training programs"
      subtitle="ADRD and minority scholar programs — trainees per year, focus, preceptor."
      activeHref="/forms/program"
    >
      <form action={saveProgram} className="form-shell">
        <input type="hidden" name="id" value={id || ""} />
        <div className="form-shell-header">
          <h2 className="font-display text-2xl font-bold text-cpbh-navy">
            {id ? "Update program" : "Add training program"}
          </h2>
        </div>
        <div className="form-shell-body">
          <FormSection title="Program">
            <Field label="Program name" name="program" required span2>
              <input name="program" required defaultValue={v("program")} />
            </Field>
            <Field label="Post-doc trainees / year" name="trainees_per_year">
              <input name="trainees_per_year" defaultValue={v("trainees_per_year")} />
            </Field>
            <Field label="% minority researchers" name="minority_researchers">
              <input name="minority_researchers" defaultValue={v("minority_researchers")} />
            </Field>
            <Field label="Focus" name="focus" span2>
              <textarea name="focus" rows={3} defaultValue={v("focus")} />
            </Field>
            <Field label="Preceptor" name="preceptor" span2>
              <input name="preceptor" defaultValue={v("preceptor")} />
            </Field>
            <Field label="Program start" name="program_start">
              <input name="program_start" type="date" defaultValue={v("program_start")} />
            </Field>
            <Field label="Program end" name="program_end">
              <input name="program_end" type="date" defaultValue={v("program_end")} />
            </Field>
            <Field label="Notes" name="notes" span2>
              <textarea name="notes" rows={2} defaultValue={v("notes")} />
            </Field>
          </FormSection>
        </div>
        <div className="flex gap-3 border-t border-slate-100 bg-slate-50/80 px-6 py-5 sm:px-8">
          <button type="submit" className="btn-primary">
            Save program
          </button>
          <Link href="/dashboard" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </AppShell>
  );
}
