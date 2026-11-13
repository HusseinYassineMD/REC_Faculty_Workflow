"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="text-xl font-bold text-cpbh-navy">Something went wrong</h1>
      <p className="mt-2 text-sm text-slate-600">{error.message}</p>
      <p className="mt-4 text-sm text-slate-500">The roster is still on the server. Try again, or return to the dashboard.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="btn-primary">
          Try again
        </button>
        <a href="/dashboard" className="btn-secondary">
          Back to the dashboard
        </a>
      </div>
    </div>
  );
}
