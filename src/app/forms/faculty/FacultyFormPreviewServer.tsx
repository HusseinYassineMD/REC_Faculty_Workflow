import AppShell from "@/components/AppShell";
import FormSection, { Field } from "@/components/FormSection";
import PreviewFormFooter from "@/components/PreviewFormFooter";
import type { FacultyRow } from "@/lib/types";

export default function FacultyFormPreviewServer({
  row,
  mode,
}: {
  row: FacultyRow;
  mode: "new" | "edit";
}) {
  const isEdit = mode === "edit";
  const v = (key: keyof FacultyRow) => String(row[key] ?? "");

  return (
    <AppShell
      title="Participating REC faculty"
      subtitle="Matches the RPPR faculty table — title, department, theme, research area."
      activeHref="/forms/faculty"
    >
      <div className="form-shell form-preview">
        <div className="form-shell-header">
          <h2 className="font-display text-2xl font-bold text-cpbh-navy">
            {isEdit ? "Update faculty" : "New faculty member"}
          </h2>
        </div>
        <div className="form-shell-body">
          <FormSection title="Faculty record">
            <Field label="Last name" name="last_name" required>
              <input name="last_name" readOnly value={v("last_name")} />
            </Field>
            <Field label="First name" name="first_name" required>
              <input name="first_name" readOnly value={v("first_name")} />
            </Field>
            <Field label="Title" name="title">
              <input name="title" readOnly value={v("title")} />
            </Field>
            <Field label="Email" name="email">
              <input name="email" type="email" readOnly value={row.email ?? "faculty@usc.edu"} />
            </Field>
            <Field label="Institution / department" name="institution_department" span2>
              <input name="institution_department" readOnly value={v("institution_department")} />
            </Field>
            <Field label="Theme" name="theme">
              <input name="theme" readOnly value={v("theme")} />
            </Field>
            <Field label="Executive committee" name="executive_committee">
              <select name="executive_committee" disabled defaultValue={row.executive_committee ? "1" : "0"}>
                <option value="1">Yes (* on table)</option>
                <option value="0">No</option>
              </select>
            </Field>
            <Field label="Research area" name="research_area" span2>
              <textarea name="research_area" rows={3} readOnly value={v("research_area")} />
            </Field>
            <Field label="Mentor active from" name="mentor_active_start">
              <input
                name="mentor_active_start"
                type="date"
                readOnly
                value={row.mentor_active_start ?? "2020-01-01"}
              />
            </Field>
            <Field label="Mentor active until" name="mentor_active_end">
              <input name="mentor_active_end" type="date" readOnly value={row.mentor_active_end ?? ""} />
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
