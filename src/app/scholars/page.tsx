import AppShell from "@/components/AppShell";
import RedirectTo from "@/components/RedirectTo";

export default function ScholarsRedirectPage() {
  return (
    <AppShell title="Scholar / trainee view">
      <RedirectTo href="/views?tab=scholars" />
    </AppShell>
  );
}
