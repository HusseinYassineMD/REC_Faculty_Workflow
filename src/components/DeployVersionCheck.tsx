"use client";

import { useEffect } from "react";

/** If GitHub Pages was redeployed, reload once so stale JS bundles do not show old UI. */
export default function DeployVersionCheck() {
  const sha = process.env.NEXT_PUBLIC_DEPLOY_SHA ?? "";

  useEffect(() => {
    if (!sha) return;
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    fetch(`${base}/deploy-version.txt?t=${Date.now()}`, { cache: "no-store" })
      .then((r) => r.text())
      .then((live) => {
        const a = live.trim();
        const b = sha.trim();
        if (a && b && a !== b && a.slice(0, 7) !== b.slice(0, 7)) {
          window.location.reload();
        }
      })
      .catch(() => {});
  }, [sha]);

  return null;
}
