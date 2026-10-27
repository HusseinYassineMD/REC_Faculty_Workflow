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
    <nav className="nav-dock">
      {nav.map((item) => {
        const active = item.match.includes(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition sm:text-sm ${
              active
                ? "bg-cpbh-gold text-cpbh-navy shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_8px_16px_-8px_rgba(0,0,0,0.45)]"
                : "text-white/90 hover:bg-white/15 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
