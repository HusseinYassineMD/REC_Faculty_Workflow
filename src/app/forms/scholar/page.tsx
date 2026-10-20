import { isStaticSite } from "@/lib/rec-data-demo";

export default async function ScholarFormPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  if (isStaticSite) {
    const Preview = (await import("./PreviewScholarForm")).default;
    return <Preview />;
  }
  const Editable = (await import("./EditableScholarForm")).default;
  return <Editable searchParams={searchParams} />;
}
