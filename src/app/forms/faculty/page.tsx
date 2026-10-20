import EditableFacultyForm from "./EditableFacultyForm";

export default function FacultyFormPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  return <EditableFacultyForm searchParams={searchParams} />;
}
