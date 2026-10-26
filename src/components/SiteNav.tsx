"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/dashboard", label: "Dashboard", match: ["/", "/dashboard"] },
  { href: "/intake", label: "Intake form", match: ["/intake"] },
  { href: "/views", label: "Views", match: ["/views", "/scholars", "/faculty", "/programs"] },
  { href: "/rppr", label: "RPPR", match: ["/rppr"] },
];

function normalize(path: string) {
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path || "/";
}

export default function SiteNav() {
  const pathname = normalize(usePathname() || "/");

  return (
    <nav className="mt-6 flex flex-wrap gap-2">
      {nav.map((item) => {
        const active = item.match.includes(pathname);
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
  );
}
