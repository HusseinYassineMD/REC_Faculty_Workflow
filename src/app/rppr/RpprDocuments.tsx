"use client";

import { useState } from "react";
import { useDemoToast } from "@/components/DemoToast";
import { downloadRpprPdf } from "@/lib/download-table";

export default function RpprDocuments({
  g1Headers,
  g1Rows,
  g2Headers,
  g2Rows,
}: {
  g1Headers: string[];
  g1Rows: string[][];
  g2Headers: string[];
  g2Rows: string[][];
}) {
  const { show, Toast } = useDemoToast();
  const [busy, setBusy] = useState(false);

  return (
    <section className="panel-3d mb-8 flex flex-wrap items-center justify-between gap-4 p-5 print:hidden sm:p-6">
      {Toast}
      <div>
        <h2 className="font-display text-xl font-bold text-cpbh-navy">Download report</h2>
        <p className="mt-1 max-w-xl text-sm text-slate-600">
          One PDF with every row in Table G1 and Table G2.
        </p>
      </div>
      <button
        type="button"
        className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
        disabled={busy}
        onClick={() => {
          setBusy(true);
          void downloadRpprPdf({
            filename: "rec-rppr.pdf",
            title: "REC RPPR",
            g1Headers,
            g1Rows,
            g2Headers,
            g2Rows,
          })
            .then(() => show("Downloaded rec-rppr.pdf"))
            .catch(() => show("The PDF could not be created. Try again."))
            .finally(() => setBusy(false));
        }}
      >
        {busy ? "Preparing PDF…" : "Download report"}
      </button>
    </section>
  );
}
