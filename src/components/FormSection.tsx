export default function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="section-accent pl-5 sm:pl-6">
      <h3 className="font-display text-lg font-semibold text-cpbh-navy">{title}</h3>
      {description ? <p className="mb-4 mt-1 text-sm text-slate-500">{description}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function Field({
  label,
  name,
  required,
  span2,
  hint,
  question,
  children,
}: {
  label: string;
  name?: string;
  required?: boolean;
  span2?: boolean;
  hint?: string;
  /** Open question for REC leadership. Rendered in red brackets. */
  question?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`field ${span2 ? "sm:col-span-2" : ""}`}>
      <label htmlFor={name}>
        {label}
        {required ? <span className="text-cpbh-cardinal"> *</span> : null}
      </label>
      {question ? (
        <p className="open-question mb-1.5 text-xs font-semibold leading-snug text-cpbh-cardinal">
          [{question}]
        </p>
      ) : null}
      {hint ? <p className="mb-1.5 text-xs leading-snug text-slate-500">{hint}</p> : null}
      {children}
    </div>
  );
}

/** Keeps two fields on one visual row, including narrow screens. */
export function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-4 sm:col-span-2">{children}</div>;
}
