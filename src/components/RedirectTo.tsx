"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectTo({ href }: { href: string }) {
  const router = useRouter();
  useEffect(() => {
    router.replace(href);
  }, [href, router]);
  return <p className="px-4 py-8 text-sm text-slate-600">Opening the updated page…</p>;
}
