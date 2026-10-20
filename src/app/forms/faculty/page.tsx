import { isStaticSite, listFaculty } from "@/lib/rec-data-demo";
import FacultyFormPreviewServer from "./FacultyFormPreviewServer";
import EditableFacultyForm from "./EditableFacultyForm";

export default function FacultyFormPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  if (isStaticSite) {
    const row = listFaculty().find((f) => f.executive_committee === 1) ?? listFaculty()[0];
    return <FacultyFormPreviewServer row={row} mode="new" />;
  }
  return <EditableFacultyForm searchParams={searchParams} />;
}
