import AppShell from "@/components/AppShell";
import RedirectTo from "@/components/RedirectTo";

export default function ProgramsRedirectPage() {
  return (
    <AppShell title="Programs view">
      <RedirectTo href="/views?tab=programs" />
    </AppShell>
  );
}
