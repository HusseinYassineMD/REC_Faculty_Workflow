import { isStaticSite, listScholars } from "@/lib/rec-data-demo";
import ScholarFormPreviewServer from "./ScholarFormPreviewServer";
import EditableScholarForm from "./EditableScholarForm";

export default function ScholarFormPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  if (isStaticSite) {
    const row =
      listScholars().find((s) => s.current_or_past === "Current") ?? listScholars()[0];
    return <ScholarFormPreviewServer row={row} mode="new" />;
  }
  return <EditableScholarForm searchParams={searchParams} />;
}
