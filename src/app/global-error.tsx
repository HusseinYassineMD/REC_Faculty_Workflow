"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui", padding: "2rem", maxWidth: "32rem", margin: "0 auto" }}>
        <h1 style={{ fontSize: "1.25rem" }}>App failed to load</h1>
        <p style={{ color: "#444", fontSize: "0.9rem" }}>{error.message}</p>
        <p style={{ fontSize: "0.85rem", color: "#666" }}>The roster is still on the server. Try again.</p>
        <p>
          <a href="/dashboard">Back to the dashboard</a>
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            background: "#ffc72c",
            border: "none",
            borderRadius: "8px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
