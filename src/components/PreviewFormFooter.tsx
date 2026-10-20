import Link from "next/link";

export default function PreviewFormFooter({ backHref = "/dashboard" }: { backHref?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 bg-slate-50/80 px-6 py-5 sm:px-8">
      <button type="button" disabled className="btn-primary cursor-not-allowed opacity-70">
        Save record
      </button>
      <Link href={backHref} className="btn-secondary">
        Back to dashboard
      </Link>
      <p className="ml-auto text-xs text-slate-500">Preview — buttons show final layout</p>
    </div>
  );
}
