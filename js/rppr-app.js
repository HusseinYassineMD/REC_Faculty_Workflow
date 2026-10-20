import { fetchRosterPreview, runSyncRec } from "./api.js";

function ynLabel(v) {
  return v ? "Yes" : "No";
}

function tableFromRows(title, rpprRef, headers, rows, rowMapper) {
  const section = document.createElement("section");
  section.className = "rppr-section";
  section.innerHTML = `<h2>${title}</h2><p class="rppr-ref">${rpprRef}</p>`;

  const wrap = document.createElement("div");
  wrap.className = "table-wrap";

  const table = document.createElement("table");
  table.className = "data-table";
  const thead = document.createElement("thead");
  const hr = document.createElement("tr");
  headers.forEach((h) => {
    const th = document.createElement("th");
    th.textContent = h;
    hr.appendChild(th);
  });
  thead.appendChild(hr);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  rows.forEach((row, i) => {
    const tr = document.createElement("tr");
    rowMapper(row).forEach((cell) => {
      const td = document.createElement("td");
      td.textContent = cell;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
    if (i % 2 === 1) tr.querySelectorAll("td").forEach((td) => (td.style.background = "#fffbeb"));
  });
  table.appendChild(tbody);
  wrap.appendChild(table);
  section.appendChild(wrap);
  return section;
}

async function init() {
  const root = document.getElementById("rppr-root");
  const offline = document.getElementById("offline-banner");
  const flashEl = document.getElementById("flash");
  const meta = document.getElementById("sync-meta");

  document.getElementById("btn-print").addEventListener("click", () => window.print());

  let roster;
  try {
    roster = await fetchRosterPreview();
    offline.hidden = true;
  } catch (err) {
    offline.hidden = false;
    offline.textContent = `${err}. Save capture data and click Sync, or run: cd ClinicalCore_Aim1 && npm run sync:rec`;
    const retry = document.createElement("button");
    retry.type = "button";
    retry.className = "btn btn-primary";
    retry.style.marginLeft = "0.5rem";
    retry.textContent = "Run sync now";
    retry.addEventListener("click", async () => {
      try {
        await runSyncRec();
        location.reload();
      } catch (e) {
        flashEl.hidden = false;
        flashEl.className = "flash err";
        flashEl.textContent = String(e);
      }
    });
    offline.appendChild(retry);
    return;
  }

  meta.textContent = `Synced ${roster.meta?.syncedAt || "—"} · maintenance: ${
    roster.meta?.maintenance || ""
  }`;

  root.replaceChildren();

  root.appendChild(
    tableFromRows(
      roster.scholarsTrainees.title,
      "NACC supporting doc G1 · REC scholars and trainees",
      [
        "Name",
        "Current / past",
        "Scholar / trainee",
        "Level",
        "Area of research",
        "Progress",
        "ADRC?",
        "ADRD field?",
      ],
      roster.scholarsTrainees.rows,
      (r) => [
        r.name,
        r.currentOrPast,
        r.scholarOrTrainee,
        r.trainingLevel,
        r.researchArea,
        r.progress,
        ynLabel(r.adrcAffiliated),
        ynLabel(r.adrdField),
      ]
    )
  );

  root.appendChild(
    tableFromRows(
      roster.faculty.title,
      "NACC supporting doc G1 · Participating REC faculty (* executive committee)",
      ["Last name", "First name", "Title", "Institution / dept", "Theme", "Research area"],
      roster.faculty.rows,
      (r) => [
        r.executiveCommittee ? `${r.lastName}*` : r.lastName,
        r.firstName,
        r.title,
        r.institutionDepartment,
        r.theme,
        r.researchArea,
      ]
    )
  );

  root.appendChild(
    tableFromRows(
      roster.trainingPrograms.title,
      "NACC supporting doc G1 · Training programs (ADRD / minority scholars)",
      ["Program", "Trainees / year", "% minority", "Focus", "Preceptor"],
      roster.trainingPrograms.rows,
      (r) => [
        r.program,
        r.traineesPerYear,
        r.minorityResearchers,
        r.focus,
        r.preceptor,
      ]
    )
  );
}

init();
