import Link from "next/link";
import AppShell from "@/components/AppShell";
import StatCard from "@/components/StatCard";
import { getCounts } from "@/lib/rec-data";

export default function HomePage() {
  const counts = getCounts();

  const cards = [
    {
      href: "/dashboard",
      tag: "Start here",
      title: "REC dashboard",
      body: "Card-based rosters with export when you need files for reporting.",
      primary: true,
      icon: "◆",
    },
    {
      href: "/forms/scholar",
      tag: "Intake",
      title: "Scholar / trainee form",
      body: "Mentors, projects, grants, and budgets with timeline fields.",
      icon: "✦",
    },
    {
      href: "/forms/faculty",
      tag: "Intake",
      title: "Faculty form",
      body: "Title, theme, department, and executive committee for the RPPR faculty table.",
      icon: "◈",
    },
    {
      href: "/forms/program",
      tag: "Intake",
      title: "Training programs",
      body: "Trainees per year, focus areas, and preceptors for USC programs.",
      icon: "◎",
    },
    {
      href: "/reports",
      tag: "Timeline",
      title: "Reporting slices",
      body: "As-of date views for annual RPPR table generation.",
      icon: "◇",
    },
    {
      href: "/rppr",
      tag: "NACC G1",
      title: "RPPR preview",
      body: "Print-friendly layouts when you need the formal table view.",
      icon: "▣",
    },
  ];

  return (
    <AppShell
      title="Faculty & RPPR workflow"
      subtitle="One place to capture REC scholars, faculty, and programs — then slice timelines for annual RPPR."
      activeHref="/"
    >
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Current scholars" value={counts.current_scholars} accent="gold" />
        <StatCard label="Current trainees" value={counts.current_trainees} accent="teal" />
        <StatCard label="Faculty" value={counts.faculty} accent="navy" />
        <StatCard label="Programs" value={counts.programs} accent="gold" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className={`card-elevated group flex flex-col gap-3 p-6 ${
              c.primary ? "ring-2 ring-cpbh-gold/50 shadow-glow" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="pill-gold">{c.tag}</span>
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-cpbh-navy/5 text-lg text-cpbh-navy/40 transition group-hover:bg-cpbh-gold/20 group-hover:text-cpbh-navy"
                aria-hidden
              >
                {c.icon}
              </span>
            </div>
            <h2 className="font-display text-xl font-bold text-cpbh-navy">{c.title}</h2>
            <p className="flex-1 text-sm leading-relaxed text-slate-600">{c.body}</p>
            <span className="text-sm font-semibold text-cpbh-teal group-hover:underline">
              Open →
            </span>
          </Link>
        ))}
      </div>

      <div className="card mt-8 p-6">
        <h2 className="font-display text-lg font-bold text-cpbh-navy">Annual workflow</h2>
        <ol className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
          <li className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cpbh-gold/30 text-xs font-bold">
              1
            </span>
            Submit or edit records through the intake forms.
          </li>
          <li className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cpbh-gold/30 text-xs font-bold">
              2
            </span>
            Export CSV and rebuild roster JSON from the dashboard when files are due.
          </li>
          <li className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cpbh-gold/30 text-xs font-bold">
              3
            </span>
            Use timeline reports and RPPR preview for your NACC workbooks.
          </li>
        </ol>
      </div>
    </AppShell>
  );
}
