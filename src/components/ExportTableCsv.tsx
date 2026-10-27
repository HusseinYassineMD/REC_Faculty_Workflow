"use client";

import { downloadCsv } from "@/lib/download-table";

export default function ExportTableCsv({
  filename,
  headers,
  rows,
  label = "Export table (CSV)",
}: {
  filename: string;
  headers: string[];
  rows: string[][];
  label?: string;
}) {
  return (
    <button type="button" onClick={() => downloadCsv(filename, headers, rows)} className="btn-secondary">
      {label}
    </button>
  );
}
