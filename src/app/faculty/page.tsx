import AppShell from "@/components/AppShell";
import RedirectTo from "@/components/RedirectTo";

export default function FacultyRedirectPage() {
  return (
    <AppShell title="Faculty view">
      <RedirectTo href="/views?tab=faculty" />
    </AppShell>
  );
}
