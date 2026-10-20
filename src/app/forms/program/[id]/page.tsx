import { notFound } from "next/navigation";
import { getProgram, isStaticSite, listPrograms } from "@/lib/rec-data-demo";
import ProgramFormPreviewServer from "../ProgramFormPreviewServer";
import EditableProgramForm from "../EditableProgramForm";

export function generateStaticParams() {
  if (process.env.NEXT_PUBLIC_STATIC_SITE !== "1") return [];
  return listPrograms().map((p) => ({ id: String(p.id) }));
}

export default function ProgramRecordPage({ params }: { params: { id: string } }) {
  const id = params.id;
  if (isStaticSite) {
    const row = getProgram(parseInt(id, 10));
    if (!row) notFound();
    return <ProgramFormPreviewServer row={row} mode="edit" />;
  }
  return <EditableProgramForm searchParams={{ id }} />;
}
