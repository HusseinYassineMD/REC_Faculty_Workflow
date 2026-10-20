import { isStaticSite } from "@/lib/rec-data";

export default async function ReportsPage(props: {
  searchParams: { as_of?: string; reporting_year?: string; saved?: string };
}) {
  if (isStaticSite) {
    const Static = (await import("./page.static")).default;
    return <Static />;
  }
  const Server = (await import("./ReportsPageServer")).default;
  return <Server searchParams={props.searchParams} />;
}
