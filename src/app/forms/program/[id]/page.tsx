import AppShell from "@/components/AppShell";
import RedirectTo from "@/components/RedirectTo";
import { listPrograms } from "@/lib/rec-data-demo";

export function generateStaticParams() {
  if (process.env.NEXT_PUBLIC_STATIC_SITE !== "1") return [];
  return listPrograms().map((p) => ({ id: String(p.id) }));
}

export default function ProgramRecordRedirectPage() {
  return (
    <AppShell title="Intake form">
      <RedirectTo href="/intake" />
    </AppShell>
  );
}
