"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Field } from "@/components/FormSection";
import type { FacultyRow, ProgramRow, ScholarRow } from "@/lib/types";
import {
  deleteFacultyRecord,
  deleteProgramRecord,
  deleteScholarRecord,
  updateFacultyRecord,
  updateProgramRecord,
  updateScholarRecord,
} from "@/server/rec-actions";

function displayName(first: string, last: string, fallback: string) {
  return `${first} ${last}`.trim() || fallback;
}

function dateValue(value: string | null | undefined) {
  if (!value || !/^\d{4}-\d{2}-\d{2}/.test(value)) return "";
  return value.slice(0, 10);
}

function yesNoValue(value: number | null | undefined) {
  if (value === 1) return "Yes";
  if (value === 0) return "No";
  return "";
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.86 4.49a2.1 2.1 0 1 1 2.97 2.97L8.25 19.04 3.75 20.25l1.21-4.5L16.86 4.49Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M9.5 7V5.5h5V7M7 7l.8 12h8.4L17 7" />
    </svg>
  );
}

function CardActions({ label, onEdit, onDelete }: { label: string; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="absolute right-3 top-3 z-10 flex gap-1">
      <button
        type="button"
        aria-label={`Edit ${label}`}
        title="Edit"
        onClick={onEdit}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-cpbh-navy shadow-sm hover:border-cpbh-gold hover:bg-amber-50"
      >
        <PencilIcon />
      </button>
      <button
        type="button"
        aria-label={`Delete ${label}`}
        title="Delete"
        onClick={onDelete}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-cpbh-navy shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-cpbh-cardinal"
      >
        <TrashIcon />
      </button>
    </div>
  );
}

function Dialog({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-cpbh-navy/45 p-4 sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="panel-3d max-h-[88vh] w-full max-w-3xl overflow-y-auto p-5 sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-bold text-cpbh-navy">{title}</h3>
          <button type="button" className="btn-secondary px-3 py-1.5 text-xs" onClick={onClose}>
            Close
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}

function DeleteDialog({
  title,
  detail,
  pending,
  error,
  onCancel,
  onConfirm,
}: {
  title: string;
  detail: string;
  pending: boolean;
  error: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog title={`Delete ${title}`} onClose={onCancel}>
      <p className="text-sm leading-relaxed text-slate-600">{detail}</p>
      {error ? <p className="mt-3 text-sm font-semibold text-cpbh-cardinal">{error}</p> : null}
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-full bg-cpbh-cardinal px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          disabled={pending}
          onClick={onConfirm}
        >
          {pending ? "Deleting…" : "Delete"}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={pending}>
          Cancel
        </button>
      </div>
    </Dialog>
  );
}

function FormError({ message }: { message: string }) {
  if (!message) return null;
  return <p className="sm:col-span-2 text-sm font-semibold text-cpbh-cardinal">{message}</p>;
}

export function ScholarCard({ person }: { person: ScholarRow }) {
  const router = useRouter();
  const [mode, setMode] = useState<"edit" | "delete" | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const title = displayName(person.first_name, person.last_name, "New record");

  function close() {
    if (pending) return;
    setMode(null);
    setError("");
  }

  async function save(formData: FormData) {
    setPending(true);
    setError("");
    const result = await updateScholarRecord(person.id, formData);
    setPending(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setMode(null);
    router.refresh();
  }

  async function remove() {
    setPending(true);
    setError("");
    const result = await deleteScholarRecord(person.id);
    setPending(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setMode(null);
    router.refresh();
  }

  return (
    <article className="record-card">
      <CardActions label={title} onEdit={() => setMode("edit")} onDelete={() => setMode("delete")} />
      <div className="pr-16">
        <h3 className="font-display text-lg font-semibold text-cpbh-navy">{title}</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {person.current_or_past?.trim() ? <span className="pill-teal">{person.current_or_past}</span> : null}
          {person.scholar_or_trainee?.trim() ? <span className="pill-navy">{person.scholar_or_trainee}</span> : null}
        </div>
        {person.training_level ? <p className="text-sm font-medium text-slate-700">{person.training_level}</p> : null}
        {person.research_area ? <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">{person.research_area}</p> : null}
        {person.progress ? <p className="line-clamp-1 text-xs font-semibold text-cpbh-teal">{person.progress}</p> : null}
      </div>
      {mode === "delete" ? (
        <DeleteDialog
          title={title}
          detail="This removes them from the dashboard, Views, and Table G1."
          pending={pending}
          error={error}
          onCancel={close}
          onConfirm={() => void remove()}
        />
      ) : null}
      {mode === "edit" ? (
        <Dialog title={`Edit ${title}`} onClose={close}>
          <form
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              void save(new FormData(event.currentTarget));
            }}
          >
            <Field label="First name" name="first_name">
              <input id="first_name" name="first_name" defaultValue={person.first_name} />
            </Field>
            <Field label="Last name" name="last_name">
              <input id="last_name" name="last_name" defaultValue={person.last_name} />
            </Field>
            <Field label="Current or past" name="current_or_past">
              <select id="current_or_past" name="current_or_past" defaultValue={person.current_or_past === "Past" || person.current_or_past === "Current" ? person.current_or_past : ""}>
                <option value="">—</option>
                <option>Current</option>
                <option>Past</option>
              </select>
            </Field>
            <Field label="Scholar or trainee" name="scholar_or_trainee">
              <select id="scholar_or_trainee" name="scholar_or_trainee" defaultValue={person.scholar_or_trainee === "Trainee" || person.scholar_or_trainee === "Scholar" ? person.scholar_or_trainee : ""}>
                <option value="">—</option>
                <option>Scholar</option>
                <option>Trainee</option>
              </select>
            </Field>
            <Field label="Level of training" name="training_level">
              <input id="training_level" name="training_level" defaultValue={person.training_level ?? ""} />
            </Field>
            <Field label="Email" name="email">
              <input id="email" name="email" type="email" defaultValue={person.email ?? ""} />
            </Field>
            <Field label="Department / school" name="department">
              <input id="department" name="department" defaultValue={person.department ?? ""} />
            </Field>
            <Field label="Cohort / training year" name="cohort_year">
              <input id="cohort_year" name="cohort_year" defaultValue={person.cohort_year ?? ""} />
            </Field>
            <Field label="Area of research" name="research_area" span2>
              <textarea id="research_area" name="research_area" rows={3} defaultValue={person.research_area ?? ""} />
            </Field>
            <Field label="Progress" name="progress" span2>
              <textarea id="progress" name="progress" rows={3} defaultValue={person.progress ?? ""} />
            </Field>
            <Field label="Currently affiliated with an ADRC?" name="adrc_affiliated">
              <select id="adrc_affiliated" name="adrc_affiliated" defaultValue={yesNoValue(person.adrc_affiliated)}>
                <option value="">—</option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </Field>
            <Field label="Working / collaborating within the ADRD field?" name="adrd_field">
              <select id="adrd_field" name="adrd_field" defaultValue={yesNoValue(person.adrd_field)}>
                <option value="">—</option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </Field>
            <Field label="Mentor(s)" name="mentors">
              <textarea id="mentors" name="mentors" rows={2} defaultValue={person.mentors ?? ""} />
            </Field>
            <Field label="Primary preceptor" name="primary_preceptor">
              <input id="primary_preceptor" name="primary_preceptor" defaultValue={person.primary_preceptor ?? ""} />
            </Field>
            <Field label="Mentorship start" name="mentorship_start_date">
              <input id="mentorship_start_date" name="mentorship_start_date" type="date" defaultValue={dateValue(person.mentorship_start_date)} />
            </Field>
            <Field label="Mentorship end" name="mentorship_end_date">
              <input id="mentorship_end_date" name="mentorship_end_date" type="date" defaultValue={dateValue(person.mentorship_end_date)} />
            </Field>
            <Field label="Project title" name="project_title" span2>
              <input id="project_title" name="project_title" defaultValue={person.project_title ?? ""} />
            </Field>
            <Field label="Project description" name="project_description" span2>
              <textarea id="project_description" name="project_description" rows={3} defaultValue={person.project_description ?? ""} />
            </Field>
            <Field label="Project start" name="project_start_date">
              <input id="project_start_date" name="project_start_date" type="date" defaultValue={dateValue(person.project_start_date)} />
            </Field>
            <Field label="Project end" name="project_end_date">
              <input id="project_end_date" name="project_end_date" type="date" defaultValue={dateValue(person.project_end_date)} />
            </Field>
            <Field label="Grant mechanism" name="grant_mechanism">
              <input id="grant_mechanism" name="grant_mechanism" defaultValue={person.grant_mechanism ?? ""} />
            </Field>
            <Field label="Grant number" name="grant_number">
              <input id="grant_number" name="grant_number" defaultValue={person.grant_number ?? ""} />
            </Field>
            <Field label="Grant title" name="grant_name" span2>
              <input id="grant_name" name="grant_name" defaultValue={person.grant_name ?? ""} />
            </Field>
            <Field label="Grant start" name="grant_start_date">
              <input id="grant_start_date" name="grant_start_date" type="date" defaultValue={dateValue(person.grant_start_date)} />
            </Field>
            <Field label="Grant end" name="grant_end_date">
              <input id="grant_end_date" name="grant_end_date" type="date" defaultValue={dateValue(person.grant_end_date)} />
            </Field>
            <Field label="Total budget (USD)" name="budget_total">
              <input id="budget_total" name="budget_total" type="number" step="0.01" defaultValue={person.budget_total ?? ""} />
            </Field>
            <Field label="Annual budget (USD)" name="budget_annual">
              <input id="budget_annual" name="budget_annual" type="number" step="0.01" defaultValue={person.budget_annual ?? ""} />
            </Field>
            <Field label="Fiscal year" name="budget_fiscal_year">
              <input id="budget_fiscal_year" name="budget_fiscal_year" defaultValue={person.budget_fiscal_year ?? ""} />
            </Field>
            <Field label="Notes" name="notes" span2>
              <textarea id="notes" name="notes" rows={2} defaultValue={person.notes ?? ""} />
            </Field>
            <FormError message={error} />
            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <button type="submit" className="btn-primary disabled:opacity-60" disabled={pending}>
                {pending ? "Saving…" : "Save changes"}
              </button>
              <button type="button" className="btn-secondary" onClick={close} disabled={pending}>
                Cancel
              </button>
            </div>
          </form>
        </Dialog>
      ) : null}
    </article>
  );
}

export function FacultyCard({ person }: { person: FacultyRow }) {
  const router = useRouter();
  const [mode, setMode] = useState<"edit" | "delete" | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const title = displayName(person.first_name, person.last_name, "New faculty");

  function close() {
    if (pending) return;
    setMode(null);
    setError("");
  }

  async function save(formData: FormData) {
    setPending(true);
    setError("");
    const result = await updateFacultyRecord(person.id, formData);
    setPending(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setMode(null);
    router.refresh();
  }

  async function remove() {
    setPending(true);
    setError("");
    const result = await deleteFacultyRecord(person.id);
    setPending(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setMode(null);
    router.refresh();
  }

  return (
    <article className="record-card">
      <CardActions label={title} onEdit={() => setMode("edit")} onDelete={() => setMode("delete")} />
      <div className="pr-16">
        <h3 className="font-display text-lg font-semibold text-cpbh-navy">
          {title}
          {person.executive_committee ? " *" : ""}
        </h3>
        {person.title ? <p className="text-sm font-medium text-slate-700">{person.title}</p> : null}
        {person.institution_department ? <p className="text-xs text-slate-500">{person.institution_department}</p> : null}
        <div className="mt-1 flex flex-wrap gap-2">
          {person.theme ? <span className="pill-navy">{person.theme}</span> : null}
          {person.executive_committee ? <span className="pill-gold">Executive committee</span> : null}
        </div>
        {person.research_area ? <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">{person.research_area}</p> : null}
      </div>
      {mode === "delete" ? (
        <DeleteDialog
          title={title}
          detail="This removes them from the dashboard and the Faculty view."
          pending={pending}
          error={error}
          onCancel={close}
          onConfirm={() => void remove()}
        />
      ) : null}
      {mode === "edit" ? (
        <Dialog title={`Edit ${title}`} onClose={close}>
          <form
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              void save(new FormData(event.currentTarget));
            }}
          >
            <Field label="Faculty first name" name="faculty_first_name">
              <input id="faculty_first_name" name="faculty_first_name" defaultValue={person.first_name} />
            </Field>
            <Field label="Faculty last name" name="faculty_last_name">
              <input id="faculty_last_name" name="faculty_last_name" defaultValue={person.last_name} />
            </Field>
            <Field label="Title" name="title">
              <input id="title" name="title" defaultValue={person.title ?? ""} />
            </Field>
            <Field label="Faculty email" name="faculty_email">
              <input id="faculty_email" name="faculty_email" type="email" defaultValue={person.email ?? ""} />
            </Field>
            <Field label="Institution / department" name="institution_department" span2>
              <input id="institution_department" name="institution_department" defaultValue={person.institution_department ?? ""} />
            </Field>
            <Field label="Theme" name="theme">
              <input id="theme" name="theme" defaultValue={person.theme ?? ""} />
            </Field>
            <Field label="Executive committee" name="executive_committee">
              <select id="executive_committee" name="executive_committee" defaultValue={person.executive_committee ? "Yes" : "No"}>
                <option value="">—</option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </Field>
            <Field label="Faculty research area" name="faculty_research_area" span2>
              <textarea id="faculty_research_area" name="faculty_research_area" rows={3} defaultValue={person.research_area ?? ""} />
            </Field>
            <Field label="Mentor active from" name="mentor_active_start">
              <input id="mentor_active_start" name="mentor_active_start" type="date" defaultValue={dateValue(person.mentor_active_start)} />
            </Field>
            <Field label="Mentor active until" name="mentor_active_end">
              <input id="mentor_active_end" name="mentor_active_end" type="date" defaultValue={dateValue(person.mentor_active_end)} />
            </Field>
            <Field label="Notes" name="notes" span2>
              <textarea id="notes" name="notes" rows={2} defaultValue={person.notes ?? ""} />
            </Field>
            <FormError message={error} />
            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <button type="submit" className="btn-primary disabled:opacity-60" disabled={pending}>
                {pending ? "Saving…" : "Save changes"}
              </button>
              <button type="button" className="btn-secondary" onClick={close} disabled={pending}>
                Cancel
              </button>
            </div>
          </form>
        </Dialog>
      ) : null}
    </article>
  );
}

export function ProgramCard({ program }: { program: ProgramRow }) {
  const router = useRouter();
  const [mode, setMode] = useState<"edit" | "delete" | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const title = program.program.trim() || "New program";

  function close() {
    if (pending) return;
    setMode(null);
    setError("");
  }

  async function save(formData: FormData) {
    setPending(true);
    setError("");
    const result = await updateProgramRecord(program.id, formData);
    setPending(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setMode(null);
    router.refresh();
  }

  async function remove() {
    setPending(true);
    setError("");
    const result = await deleteProgramRecord(program.id);
    setPending(false);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setMode(null);
    router.refresh();
  }

  return (
    <article className="record-card">
      <CardActions label={title} onEdit={() => setMode("edit")} onDelete={() => setMode("delete")} />
      <div className="pr-16">
        <h3 className="font-display text-lg font-semibold text-cpbh-navy">{title}</h3>
        {program.trainees_per_year ? <p className="text-sm font-medium text-slate-700">{program.trainees_per_year}</p> : null}
        {program.preceptor ? <p className="text-sm text-slate-600">Preceptor: {program.preceptor}</p> : null}
        {program.focus ? <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">{program.focus}</p> : null}
        {program.minority_researchers ? (
          <p className="text-xs text-slate-500">Minority researchers: {program.minority_researchers}</p>
        ) : null}
      </div>
      {mode === "delete" ? (
        <DeleteDialog
          title={title}
          detail="This removes the program from the dashboard and the Programs view."
          pending={pending}
          error={error}
          onCancel={close}
          onConfirm={() => void remove()}
        />
      ) : null}
      {mode === "edit" ? (
        <Dialog title={`Edit ${title}`} onClose={close}>
          <form
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              void save(new FormData(event.currentTarget));
            }}
          >
            <Field label="Program name" name="program" span2>
              <input id="program" name="program" defaultValue={program.program} />
            </Field>
            <Field label="Post-doc trainees / year" name="trainees_per_year">
              <input id="trainees_per_year" name="trainees_per_year" defaultValue={program.trainees_per_year ?? ""} />
            </Field>
            <Field label="% minority researchers" name="minority_researchers">
              <input id="minority_researchers" name="minority_researchers" defaultValue={program.minority_researchers ?? ""} />
            </Field>
            <Field label="Focus" name="focus" span2>
              <textarea id="focus" name="focus" rows={3} defaultValue={program.focus ?? ""} />
            </Field>
            <Field label="Preceptor" name="preceptor" span2>
              <input id="preceptor" name="preceptor" defaultValue={program.preceptor ?? ""} />
            </Field>
            <Field label="Program start" name="program_start">
              <input id="program_start" name="program_start" type="date" defaultValue={dateValue(program.program_start)} />
            </Field>
            <Field label="Program end" name="program_end">
              <input id="program_end" name="program_end" type="date" defaultValue={dateValue(program.program_end)} />
            </Field>
            <Field label="Notes" name="notes" span2>
              <textarea id="notes" name="notes" rows={2} defaultValue={program.notes ?? ""} />
            </Field>
            <FormError message={error} />
            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <button type="submit" className="btn-primary disabled:opacity-60" disabled={pending}>
                {pending ? "Saving…" : "Save changes"}
              </button>
              <button type="button" className="btn-secondary" onClick={close} disabled={pending}>
                Cancel
              </button>
            </div>
          </form>
        </Dialog>
      ) : null}
    </article>
  );
}
