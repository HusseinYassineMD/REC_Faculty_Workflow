import EditableProgramForm from "./EditableProgramForm";

export default function ProgramFormPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  return <EditableProgramForm searchParams={searchParams} />;
}
