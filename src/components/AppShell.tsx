import DeployVersionCheck from "@/components/DeployVersionCheck";
import SiteNav from "@/components/SiteNav";
import StaticSiteBanner from "@/components/StaticSiteBanner";
import { LINKS } from "@/lib/paths";

export default function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  /** Kept so older pages still compile. The nav highlights from the current URL. */
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

          <SiteNav />
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-4 pt-2 sm:px-6">
        <DeployVersionCheck />
        <StaticSiteBanner />
        {children}
      </main>

      <footer className="relative mx-auto mt-10 max-w-6xl px-4 text-center text-xs text-slate-500 sm:px-6">
        REC faculty workflow ·{" "}
        <a href={LINKS.naccRppr} className="font-medium text-cpbh-navy/70 underline-offset-2 hover:underline">
          NACC reporting reference
        </a>
      </footer>
    </div>
  );
}
