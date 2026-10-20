import { NextRequest, NextResponse } from "next/server";
import { buildReportPayload } from "@/lib/rppr-export";

export async function GET(req: NextRequest) {
  const asOf = req.nextUrl.searchParams.get("as_of") ?? new Date().toISOString().slice(0, 10);
  const reportingYear =
    req.nextUrl.searchParams.get("reporting_year") ?? new Date().getFullYear().toString();
  const payload = buildReportPayload(asOf, reportingYear);
  return NextResponse.json(payload);
}
