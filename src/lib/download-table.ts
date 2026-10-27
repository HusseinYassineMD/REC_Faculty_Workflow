export function downloadCsv(filename: string, headers: string[], rows: string[][]) {
  const escape = (cell: string) => {
    const value = String(cell ?? "").replace(/"/g, '""');
    return /[",\n]/.test(value) ? `"${value}"` : value;
  };
  const lines = [headers.map(escape).join(","), ...rows.map((row) => row.map(escape).join(","))];
  const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "application/octet-stream" });
  saveBlob(filename, blob);
}

export async function downloadRpprPdf(doc: {
  filename: string;
  title: string;
  g1Headers: string[];
  g1Rows: string[][];
  g2Headers: string[];
  g2Rows: string[][];
}) {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;
  const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "letter" });
  const margin = 36;
  const navy: [number, number, number] = [26, 39, 68];

  const drawTable = (heading: string, headers: string[], rows: string[][], startY: number) => {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(...navy);
    pdf.text(heading, margin, startY);
    autoTable(pdf, {
      startY: startY + 10,
      head: [headers],
      body: rows.length ? rows : [headers.map(() => "")],
      margin: { left: margin, right: margin },
      styles: {
        font: "helvetica",
        fontSize: 7,
        cellPadding: 3,
        overflow: "linebreak",
        textColor: navy,
        lineColor: [213, 219, 230],
        lineWidth: 0.4,
      },
      headStyles: { fillColor: navy, textColor: 255, fontStyle: "bold", fontSize: 7 },
      alternateRowStyles: { fillColor: [245, 247, 251] },
    });
  };

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.setTextColor(...navy);
  pdf.text(doc.title, margin, 40);
  drawTable(
    "Table G1. Summary table of REC SCHOLARS and TRAINEES",
    doc.g1Headers,
    doc.g1Rows,
    64
  );
  pdf.addPage();
  drawTable(
    "Table G2. Summary table of REC EVENTS",
    doc.g2Headers,
    doc.g2Rows,
    40
  );
  pdf.save(doc.filename);
}

function saveBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  window.setTimeout(() => {
    link.remove();
    URL.revokeObjectURL(url);
  }, 1500);
}
