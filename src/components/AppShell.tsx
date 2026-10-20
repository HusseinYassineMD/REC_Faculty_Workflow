import Link from "next/link";
import { LINKS } from "@/lib/paths";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/forms/scholar", label: "Scholars" },
  { href: "/forms/faculty", label: "Faculty" },
  { href: "/forms/program", label: "Programs" },
  { href: "/reports", label: "Reports" },
  { href: "/rppr", label: "RPPR" },
];

export default function AppShell({
  title,
  subtitle,
  children,
  activeHref,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  activeHref?: string;
}) {
  return (
    <div className="relative min-h-screen pb-12">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-hero-bar opacity-[0.97]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-0 top-24 h-64 w-64 rounded-full bg-cpbh-gold/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-8 top-48 h-48 w-48 rounded-full bg-cpbh-teal/15 blur-3xl"
        aria-hidden
      />

      <header className="relative border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 pb-6 pt-8 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="pill-gold mb-3">USC ADRC · Research Education Component</p>
              <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-2 text-sm leading-relaxed text-white/75 sm:text-base">{subtitle}</p>
              ) : null}
            </div>
          </div>

          <nav className="mt-6 flex flex-wrap gap-2">
            {nav.map((item) => {
              const active = activeHref === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                    active
                      ? "bg-cpbh-gold text-cpbh-navy shadow-glow"
                      : "border border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-4 pt-2 sm:px-6">{children}</main>

      <footer className="relative mx-auto mt-10 max-w-6xl px-4 text-center text-xs text-slate-500 sm:px-6">
        REC faculty workflow ·{" "}
        <a href={LINKS.naccRppr} className="font-medium text-cpbh-navy/70 underline-offset-2 hover:underline">
          NACC reporting reference
        </a>
      </footer>
    </div>
  );
}
