import { redirect } from "next/navigation";

/** Kept so old bookmarks resolve. next.config also redirects /dashboard → /. */
export default function DashboardPage() {
  redirect("/");
}
