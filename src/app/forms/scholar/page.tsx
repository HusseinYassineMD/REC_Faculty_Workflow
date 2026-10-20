import EditableScholarForm from "./EditableScholarForm";

export default function ScholarFormPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  return <EditableScholarForm searchParams={searchParams} />;
}
