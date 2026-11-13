import type { SheetGrid } from "./excel-import";
import { TEMPLATE_SHEETS } from "./excel-import";

export async function readWorkbook(file: ArrayBuffer): Promise<SheetGrid[]> {
  const XLSX = await import("xlsx");
  const book = XLSX.read(file, { type: "array", cellDates: false });
  return book.SheetNames.map((name) => {
    const grid = XLSX.utils.sheet_to_json<(string | number | boolean | null)[]>(book.Sheets[name], {
      header: 1,
      raw: false,
      defval: "",
      blankrows: false,
    });
    return {
      name,
      rows: grid.map((row) => (Array.isArray(row) ? row : []).map((cell) => String(cell ?? "").trim())),
    };
  });
}

export async function downloadIntakeTemplate() {
  const XLSX = await import("xlsx");
  const book = XLSX.utils.book_new();
  for (const sheet of TEMPLATE_SHEETS) {
    const worksheet = XLSX.utils.aoa_to_sheet([sheet.headers]);
    worksheet["!cols"] = sheet.headers.map((header) => ({ wch: Math.min(Math.max(header.length + 2, 16), 42) }));
    XLSX.utils.book_append_sheet(book, worksheet, sheet.name);
  }
  XLSX.writeFile(book, "rec-intake-template.xlsx");
}
