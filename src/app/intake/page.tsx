import AppShell from "@/components/AppShell";
import IntakeForm from "./IntakeForm";

export default function IntakePage() {
  return (
    <AppShell
      title="Intake form"
      subtitle="Answer any of the questions. Nothing is required."
    >
      <IntakeForm />
    </AppShell>
  );
}
