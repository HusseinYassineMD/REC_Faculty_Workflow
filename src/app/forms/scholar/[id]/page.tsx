import { notFound } from "next/navigation";
import {
  getScholar,
  isStaticSite,
  listScholars,
} from "@/lib/rec-data-demo";
import ScholarFormPreviewServer from "../ScholarFormPreviewServer";
import EditableScholarForm from "../EditableScholarForm";

export function generateStaticParams() {
  if (process.env.NEXT_PUBLIC_STATIC_SITE !== "1") return [];
  return listScholars().map((s) => ({ id: String(s.id) }));
}

export default function ScholarRecordPage({ params }: { params: { id: string } }) {
  const id = params.id;
  if (isStaticSite) {
    const row = getScholar(parseInt(id, 10));
    if (!row) notFound();
    return <ScholarFormPreviewServer row={row} mode="edit" />;
  }
  return <EditableScholarForm searchParams={{ id }} />;
}
