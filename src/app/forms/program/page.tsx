import { isStaticSite } from "@/lib/rec-data-demo";

export default async function ProgramFormPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  if (isStaticSite) {
    const Preview = (await import("./PreviewProgramForm")).default;
    return <Preview />;
  }
  const Editable = (await import("./EditableProgramForm")).default;
  return <Editable searchParams={searchParams} />;
}
