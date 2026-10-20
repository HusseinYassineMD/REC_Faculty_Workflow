"use client";

export default function DownloadReportJson({
  filename,
  json,
}: {
  filename: string;
  json: string;
}) {
  function download() {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button type="button" onClick={download} className="btn-secondary">
      Download JSON
    </button>
  );
}
