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
      <p className="mt-4 text-sm text-slate-500">
        From the project folder run: <code className="rounded bg-slate-200 px-1">npm run dev</code>
        , then open{" "}
        <a href="http://127.0.0.1:8766/" className="underline">
          http://127.0.0.1:8766/
        </a>
      </p>
      <button type="button" onClick={reset} className="btn-primary mt-6">
        Try again
      </button>
    </div>
  );
}
