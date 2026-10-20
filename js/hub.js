import { fetchStatus } from "./api.js";

function statEl(value, label) {
  const div = document.createElement("div");
  div.className = "stat";
  div.innerHTML = `<div class="value">${value}</div><div class="label">${label}</div>`;
  return div;
}

async function init() {
  const grid = document.getElementById("status-grid");
  const meta = document.getElementById("status-meta");
  const offline = document.getElementById("offline-banner");
  const footerPath = document.getElementById("footer-path");

  try {
    const status = await fetchStatus();
    offline.hidden = true;
    grid.replaceChildren();

    const summary = status.summary || {};
    grid.append(
      statEl(summary.currentScholars ?? "—", "Current scholars"),
      statEl(summary.currentTrainees ?? "—", "Current trainees"),
      statEl(summary.facultyTotal ?? "—", "REC faculty"),
      statEl(summary.programCount ?? "—", "Training programs")
    );

    const ds = status.datasets || {};
    const scholarRows = ds["scholars-trainees"]?.rowCount ?? "—";
    meta.textContent = `CSV rows · scholars: ${scholarRows} · last JSON sync: ${
      status.rosterSyncedAt || "not yet synced"
    }`;
    footerPath.textContent = status.recDir || "";
  } catch {
    offline.hidden = false;
    grid.replaceChildren(
      statEl("—", "Start server.py"),
      statEl("—", "Then reload"),
      statEl("—", ""),
      statEl("—", "")
    );
    meta.textContent =
      "Offline: open capture only after starting python3 server.py for centralized CSV read/write.";
    footerPath.textContent = "../CORES/ClinicalCore_Aim1/data/reference/rec/";
  }
}

init();
