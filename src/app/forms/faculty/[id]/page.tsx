import { notFound } from "next/navigation";
import { getFaculty, isStaticSite, listFaculty } from "@/lib/rec-data-demo";
import FacultyFormPreviewServer from "../FacultyFormPreviewServer";
import EditableFacultyForm from "../EditableFacultyForm";

export function generateStaticParams() {
  if (process.env.NEXT_PUBLIC_STATIC_SITE !== "1") return [];
  return listFaculty().map((f) => ({ id: String(f.id) }));
}

export default function FacultyRecordPage({ params }: { params: { id: string } }) {
  const id = params.id;
  if (isStaticSite) {
    const row = getFaculty(parseInt(id, 10));
    if (!row) notFound();
    return <FacultyFormPreviewServer row={row} mode="edit" />;
  }
  return <EditableFacultyForm searchParams={{ id }} />;
}
