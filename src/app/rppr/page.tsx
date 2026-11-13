import AppShell from "@/components/AppShell";
import { listScholars, listStoredEvents } from "@/lib/rec-data";
import RpprDocuments from "./RpprDocuments";
import RpprSwitcher from "./RpprSwitcher";
import {
  OPEN_QUESTIONS,
  TABLE_G1_HEADERS,
  TABLE_G2_HEADERS,
  TABLE_G2_ROWS,
  sortScholarsForTableG1,
  scholarToTableG1Row,
} from "@/lib/rppr-standards";

export default async function RpprPreviewPage({
  searchParams,
}: {
  searchParams: { table?: string };
}) {
  const scholars = sortScholarsForTableG1(await listScholars());
  const g1Rows = scholars.map(scholarToTableG1Row);
  const g2Rows = [...TABLE_G2_ROWS, ...(await listStoredEvents())];
  const initial = searchParams.table === "g2" ? "g2" : "g1";

  return (
    <AppShell
      title="RPPR"
      subtitle="Choose G1 or G2 at the top."
    >
      <RpprSwitcher
        initial={initial}
        g1={{
          kicker: "Table G1",
          title: "REC scholars and trainees",
          note: "Sorted current, then scholar, then last name.",
          headers: [...TABLE_G1_HEADERS],
          questions: [
            null,
            OPEN_QUESTIONS.currentOrPast,
            OPEN_QUESTIONS.scholarOrTrainee,
            null,
            OPEN_QUESTIONS.researchArea,
            OPEN_QUESTIONS.progress,
            OPEN_QUESTIONS.adrc,
            OPEN_QUESTIONS.adrd,
          ],
          rows: g1Rows,
        }}
        g2={{
          kicker: "Table G2",
          title: "REC events",
          note: "Speaker series first. Events added from the intake form are at the end.",
          headers: [...TABLE_G2_HEADERS],
          rows: g2Rows,
        }}
      />

      <RpprDocuments
        g1Headers={[...TABLE_G1_HEADERS]}
        g1Rows={g1Rows}
        g2Headers={[...TABLE_G2_HEADERS]}
        g2Rows={g2Rows}
      />
    </AppShell>
  );
}
