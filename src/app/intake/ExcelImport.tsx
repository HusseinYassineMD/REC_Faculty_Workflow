"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemoToast } from "@/components/DemoToast";
import { planFromSheets, summarizePlan, type ExcelImportPlan, type SheetGrid } from "@/lib/excel-import";
import { downloadIntakeTemplate, readWorkbook } from "@/lib/read-workbook";
import { importExcelRoster } from "@/server/rec-actions";

export default function ExcelImport() {
  const { show, Toast } = useDemoToast();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [fileName, setFileName] = useState("");
  const [sheets, setSheets] = useState<SheetGrid[] | null>(null);
  const [plan, setPlan] = useState<ExcelImportPlan | null>(null);

  async function onFile(file: File | null) {
    setSheets(null);
    setPlan(null);
    setFileName(file?.name ?? "");
    if (!file) return;
    try {
      const next = await readWorkbook(await file.arrayBuffer());
      const parsed = planFromSheets(next);
      setSheets(next);
      setPlan(parsed);
    } catch {
      show("That file could not be read. Use an Excel workbook or the template.");
    }
  }

  function importRows() {
    if (!sheets || !plan) return;
    if (process.env.NEXT_PUBLIC_STATIC_SITE === "1") {
      show("This preview does not save. Run the local app to import rows into the database.");
      return;
    }
    setPending(true);
    void importExcelRoster(sheets)
      .then((result) => {
        if ("error" in result) {
          show(result.error);
          setPending(false);
          return;
        }
        router.push(result.href);
        router.refresh();
      })
      .catch(() => {
        show("Could not import that spreadsheet. Try again.");
        setPending(false);
      });
  }

  const ready = plan !== null && (plan.scholars.length + plan.faculty.length + plan.programs.length + plan.events.length > 0);

  return (
    <section className="panel-3d mb-8 p-5 sm:p-6">
      {Toast}
      <h2 className="font-display text-xl font-bold text-cpbh-navy">Import from Excel</h2>
      <p className="mt-1 text-sm text-slate-600">
        Upload a workbook to fill the same scholar, faculty, program, and event fields as the form below. A matching
        name is updated. A new name is added. One row at a time still goes through the questions.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" className="btn-secondary" onClick={() => void downloadIntakeTemplate()}>
          Download template
        </button>
        <label className="btn-secondary cursor-pointer">
          Choose Excel file
          <input
            type="file"
            accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
            className="sr-only"
            onChange={(event) => void onFile(event.target.files?.[0] ?? null)}
          />
        </label>
        <button type="button" className="btn-primary disabled:cursor-not-allowed disabled:opacity-50" disabled={!ready || pending} onClick={importRows}>
          {pending ? "Importing…" : "Import rows"}
        </button>
      </div>
      {fileName ? <p className="mt-3 text-sm text-slate-500">{fileName}</p> : null}
      {plan ? (
        <div className="mt-4 border-t border-slate-100 pt-4">
          <p className="text-sm font-semibold text-cpbh-navy">{summarizePlan(plan)}</p>
          {plan.warnings.length > 0 ? (
            <ul className="mt-2 space-y-1 text-sm text-cpbh-cardinal">
              {plan.warnings.slice(0, 8).map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
