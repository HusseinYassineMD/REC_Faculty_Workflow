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
  children,
}: {
  label: string;
  name?: string;
  required?: boolean;
  span2?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`field ${span2 ? "sm:col-span-2" : ""}`}>
      <label htmlFor={name}>
        {label}
        {required ? <span className="text-cpbh-cardinal"> *</span> : null}
      </label>
      {hint ? <p className="mb-1.5 text-xs leading-snug text-slate-500">{hint}</p> : null}
      {children}
    </div>
  );
}
