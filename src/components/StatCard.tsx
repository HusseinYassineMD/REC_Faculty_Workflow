export default function StatCard({
  label,
  value,
  accent = "gold",
}: {
  label: string;
  value: number;
  accent?: "gold" | "teal" | "navy";
}) {
  const accentBar = {
    gold: "from-cpbh-gold to-amber-300",
    teal: "from-cpbh-teal to-teal-400",
    navy: "from-cpbh-navy to-cpbh-deep",
  }[accent];

  return (
    <div className="stat-card">
      <div className={`mb-3 h-1 w-12 rounded-full bg-gradient-to-r ${accentBar}`} />
      <p className="font-display text-3xl font-bold tabular-nums text-cpbh-navy">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
    </div>
  );
}
