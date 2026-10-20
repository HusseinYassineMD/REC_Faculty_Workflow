import { isStaticSite, listPrograms } from "@/lib/rec-data-demo";
import ProgramFormPreviewServer from "./ProgramFormPreviewServer";
import EditableProgramForm from "./EditableProgramForm";

export default function ProgramFormPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  if (isStaticSite) {
    return <ProgramFormPreviewServer row={listPrograms()[0]} mode="new" />;
  }
  return <EditableProgramForm searchParams={searchParams} />;
}
