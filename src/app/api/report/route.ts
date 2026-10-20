import { buildReportPayload } from "@/lib/report-payload";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const asOf = url.searchParams.get("as_of") ?? new Date().toISOString().slice(0, 10);
  const reportingYear =
    url.searchParams.get("reporting_year") ?? new Date().getFullYear().toString();
  const payload = buildReportPayload(asOf, reportingYear);
  return Response.json(payload);
}
