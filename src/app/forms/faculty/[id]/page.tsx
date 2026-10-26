import AppShell from "@/components/AppShell";
import RedirectTo from "@/components/RedirectTo";
import { listFaculty } from "@/lib/rec-data-demo";

export function generateStaticParams() {
  if (process.env.NEXT_PUBLIC_STATIC_SITE !== "1") return [];
  return listFaculty().map((f) => ({ id: String(f.id) }));
}

export default function FacultyRecordRedirectPage() {
  return (
    <AppShell title="Intake form">
      <RedirectTo href="/intake" />
    </AppShell>
  );
}
