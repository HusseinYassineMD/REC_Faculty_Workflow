import { isStaticSite } from "@/lib/rec-data-demo";

export default async function FacultyFormPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  if (isStaticSite) {
    const Preview = (await import("./PreviewFacultyForm")).default;
    return <Preview />;
  }
  const Editable = (await import("./EditableFacultyForm")).default;
  return <Editable searchParams={searchParams} />;
}
