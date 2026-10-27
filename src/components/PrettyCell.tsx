export default function PrettyCell({ value, emphasize = false }: { value: string; emphasize?: boolean }) {
  const text = value ?? "";
  const trimmed = text.trim();

  if (!trimmed || trimmed === "—") {
    return <span className="text-slate-300">—</span>;
  }

  if (trimmed.length <= 32) {
    if (/^current\b/i.test(trimmed)) return <span className="pill-teal">{trimmed}</span>;
    if (/^past\b/i.test(trimmed)) return <span className="pill-navy">{trimmed}</span>;
    if (trimmed === "Yes") return <span className="pill-teal">Yes</span>;
    if (trimmed === "No") return <span className="pill-navy">No</span>;
    if (/scholar|trainee/i.test(trimmed)) return <span className="pill-navy">{trimmed}</span>;
  }

  if (emphasize) return <span className="font-semibold text-cpbh-navy">{text}</span>;
  return <span className="text-slate-600">{text}</span>;
}
