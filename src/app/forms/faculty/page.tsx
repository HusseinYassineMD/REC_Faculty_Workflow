import Link from "next/link";
import AppShell from "@/components/AppShell";
import FormSection, { Field } from "@/components/FormSection";
import { saveFaculty } from "@/app/actions";
import { getFaculty } from "@/lib/db";

export default function FacultyFormPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const id = parseInt(searchParams.id ?? "0", 10);
  const row = id > 0 ? getFaculty(id) : undefined;
  const v = (key: keyof NonNullable<typeof row>) =>
    row ? String(row[key] ?? "") : "";

  return (
    <AppShell
      title="Participating REC faculty"
      subtitle="Matches the RPPR faculty table — title, department, theme, research area."
      activeHref="/forms/faculty"
    >
      <form action={saveFaculty} className="form-shell">
        <input type="hidden" name="id" value={id || ""} />
        <div className="form-shell-header">
          <h2 className="font-display text-2xl font-bold text-cpbh-navy">
            {id ? "Update faculty" : "New faculty member"}
          </h2>
        </div>
        <div className="form-shell-body">
        <FormSection title="Faculty record">
          <Field label="Last name" name="last_name" required>
            <input name="last_name" required defaultValue={v("last_name")} />
          </Field>
          <Field label="First name" name="first_name" required>
            <input name="first_name" required defaultValue={v("first_name")} />
          </Field>
          <Field label="Title" name="title">
            <input name="title" defaultValue={v("title")} />
          </Field>
          <Field label="Email" name="email">
            <input name="email" type="email" defaultValue={v("email")} />
          </Field>
          <Field label="Institution / department" name="institution_department" span2>
            <input name="institution_department" defaultValue={v("institution_department")} />
          </Field>
          <Field label="Theme" name="theme">
            <input name="theme" defaultValue={v("theme")} />
          </Field>
          <Field label="Executive committee" name="executive_committee">
            <select name="executive_committee" defaultValue={row?.executive_committee ? "1" : "0"}>
              <option value="1">Yes (* on table)</option>
              <option value="0">No</option>
            </select>
          </Field>
          <Field label="Research area" name="research_area" span2>
            <textarea name="research_area" rows={3} defaultValue={v("research_area")} />
          </Field>
          <Field label="Mentor active from" name="mentor_active_start">
            <input name="mentor_active_start" type="date" defaultValue={v("mentor_active_start")} />
          </Field>
          <Field label="Mentor active until" name="mentor_active_end">
            <input name="mentor_active_end" type="date" defaultValue={v("mentor_active_end")} />
          </Field>
          <Field label="Notes" name="notes" span2>
            <textarea name="notes" rows={2} defaultValue={v("notes")} />
          </Field>
        </FormSection>
        </div>
        <div className="flex gap-3 border-t border-slate-100 bg-slate-50/80 px-6 py-5 sm:px-8">
          <button type="submit" className="btn-primary">
            Save record
          </button>
          <Link href="/dashboard" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </AppShell>
  );
}
