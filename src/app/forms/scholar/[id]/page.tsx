import AppShell from "@/components/AppShell";
import RedirectTo from "@/components/RedirectTo";
import { listScholars } from "@/lib/rec-data-demo";

export function generateStaticParams() {
  if (process.env.NEXT_PUBLIC_STATIC_SITE !== "1") return [];
  return listScholars().map((s) => ({ id: String(s.id) }));
}

export default function ScholarRecordRedirectPage() {
  return (
    <AppShell title="Intake form">
      <RedirectTo href="/intake" />
    </AppShell>
  );
}
