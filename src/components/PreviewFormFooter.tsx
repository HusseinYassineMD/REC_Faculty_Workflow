"use client";

import Link from "next/link";
import { useDemoToast } from "@/components/DemoToast";

export default function PreviewFormFooter({ backHref = "/dashboard" }: { backHref?: string }) {
  const { show, Toast } = useDemoToast();

  return (
    <>
      {Toast}
      <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 bg-slate-50/80 px-6 py-5 sm:px-8">
        <button
          type="button"
          className="btn-primary"
          onClick={() => show("Record saved — database connection coming next.")}
        >
          Save record
        </button>
        <Link href={backHref} className="btn-secondary">
          Cancel
        </Link>
      </div>
    </>
  );
}
