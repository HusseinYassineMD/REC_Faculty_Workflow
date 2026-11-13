import AppShell from "@/components/AppShell";
import ExcelImport from "./ExcelImport";
import IntakeForm from "./IntakeForm";

export default function IntakePage() {
  return (
    <AppShell
      title="Intake form"
      subtitle="Fill in the questions for one record, or import those same fields from Excel."
    >
      <ExcelImport />
      <IntakeForm />
    </AppShell>
  );
}
