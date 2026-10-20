"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import FormSection, { Field } from "@/components/FormSection";
import PreviewFormFooter from "@/components/PreviewFormFooter";
import { getFaculty, listFaculty } from "@/lib/rec-data-demo";

export default function FacultyFormPreview() {
  const params = useSearchParams();
  const id = parseInt(params.get("id") ?? "0", 10);

  const row = useMemo(() => {
    if (id > 0) return getFaculty(id);
    return listFaculty().find((f) => f.executive_committee === 1) ?? listFaculty()[0];
  }, [id]);

  if (!row) {
    return (
      <AppShell title="Participating REC faculty" activeHref="/forms/faculty">
        <p className="text-slate-600">No sample record found.</p>
      </AppShell>
    );
  }

  const isEdit = id > 0;
  const v = (key: keyof typeof row) => String(row[key] ?? "");

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
              <input name="last_name" disabled value={v("last_name")} />
            </Field>
            <Field label="First name" name="first_name" required>
              <input name="first_name" disabled value={v("first_name")} />
            </Field>
            <Field label="Title" name="title">
              <input name="title" disabled value={v("title")} />
            </Field>
            <Field label="Email" name="email">
              <input name="email" type="email" disabled value={row.email ?? "faculty@usc.edu"} />
            </Field>
            <Field label="Institution / department" name="institution_department" span2>
              <input name="institution_department" disabled value={v("institution_department")} />
            </Field>
            <Field label="Theme" name="theme">
              <input name="theme" disabled value={v("theme")} />
            </Field>
            <Field label="Executive committee" name="executive_committee">
              <select name="executive_committee" disabled value={row.executive_committee ? "1" : "0"}>
                <option value="1">Yes (* on table)</option>
                <option value="0">No</option>
              </select>
            </Field>
            <Field label="Research area" name="research_area" span2>
              <textarea name="research_area" rows={3} disabled value={v("research_area")} />
            </Field>
            <Field label="Mentor active from" name="mentor_active_start">
              <input
                name="mentor_active_start"
                type="date"
                disabled
                value={row.mentor_active_start ?? "2020-01-01"}
              />
            </Field>
            <Field label="Mentor active until" name="mentor_active_end">
              <input name="mentor_active_end" type="date" disabled value={row.mentor_active_end ?? ""} />
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
