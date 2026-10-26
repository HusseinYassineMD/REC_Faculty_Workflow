import AppShell from "@/components/AppShell";
import RedirectTo from "@/components/RedirectTo";

export default function ProgramFormRedirectPage() {
  return (
    <AppShell title="Intake form">
      <RedirectTo href="/intake" />
    </AppShell>
  );
}
