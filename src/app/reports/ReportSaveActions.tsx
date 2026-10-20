import { saveReportSnapshot } from "@/server/rec-actions";

export default function ReportSaveActions({
  asOf,
  reportingYear,
}: {
  asOf: string;
  reportingYear: string;
}) {
  return (
    <>
      <a
        href={`/api/report?as_of=${encodeURIComponent(asOf)}&reporting_year=${encodeURIComponent(reportingYear)}`}
        className="btn-secondary"
      >
        Download JSON
      </a>
      <form action={saveReportSnapshot}>
        <input type="hidden" name="as_of" value={asOf} />
        <input type="hidden" name="reporting_year" value={reportingYear} />
        <button type="submit" className="btn-secondary">
          Save snapshot
        </button>
      </form>
    </>
  );
}
