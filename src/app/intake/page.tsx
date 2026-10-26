import AppShell from "@/components/AppShell";
import IntakeForm from "./IntakeForm";

export default function IntakePage() {
  return (
    <AppShell
      title="Intake form"
      subtitle="A single form for scholars, trainees, faculty, programs, and REC events."
    >
      <IntakeForm />
    </AppShell>
  );
}
