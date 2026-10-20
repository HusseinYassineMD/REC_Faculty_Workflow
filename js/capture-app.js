import { DATASET_LIST } from "./config.js";
import { fetchDataset, fetchStatus, runSyncRec, saveDataset } from "./api.js";

let activeKey = DATASET_LIST[0].key;
/** @type {Record<string, { fields: string[], rows: Record<string, string>[] }>} */
const cache = {};

function flash(el, message, kind = "ok") {
  el.textContent = message;
  el.className = `flash ${kind}`;
  el.hidden = false;
}

function nextId(rows, field = "id") {
  const nums = rows
    .map((r) => parseInt(r[field], 10))
    .filter((n) => !Number.isNaN(n));
  return String((nums.length ? Math.max(...nums) : 0) + 1);
}

function emptyRow(dataset, rows) {
  const row = {};
  for (const col of dataset.columns) {
    if (col.key === "id") row.id = nextId(rows);
    else if (col.type === "yesno") row[col.key] = "yes";
    else row[col.key] = "";
  }
  return row;
}

function renderTabs(container, onSelect) {
  container.replaceChildren();
  for (const ds of DATASET_LIST) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `tab${ds.key === activeKey ? " active" : ""}`;
    btn.textContent = ds.label;
    btn.addEventListener("click", () => onSelect(ds.key));
    container.appendChild(btn);
  }
}

function cellInput(col, value, onChange) {
  if (col.type === "select") {
    const sel = document.createElement("select");
    for (const opt of col.options) {
      const o = document.createElement("option");
      o.value = opt;
      o.textContent = opt;
      if (value === opt) o.selected = true;
      sel.appendChild(o);
    }
    sel.addEventListener("change", () => onChange(sel.value));
    return sel;
  }
  if (col.type === "yesno") {
    const sel = document.createElement("select");
    for (const opt of ["yes", "no"]) {
      const o = document.createElement("option");
      o.value = opt;
      o.textContent = opt;
      if ((value || "yes").toLowerCase() === opt) o.selected = true;
      sel.appendChild(o);
    }
    sel.addEventListener("change", () => onChange(sel.value));
    return sel;
  }
  if (col.type === "textarea") {
    const ta = document.createElement("textarea");
    ta.value = value || "";
    ta.rows = 2;
    ta.addEventListener("input", () => onChange(ta.value));
    return ta;
  }
  const input = document.createElement("input");
  input.type = col.type === "number" ? "number" : col.type === "date" ? "date" : "text";
  input.value = value || "";
  input.addEventListener("input", () => onChange(input.value));
  return input;
}

function renderTable(wrap, dataset) {
  const data = cache[dataset.key];
  if (!data) return;

  const table = document.createElement("table");
  table.className = "data-table";

  const thead = document.createElement("thead");
  const hr = document.createElement("tr");
  for (const col of dataset.columns) {
    const th = document.createElement("th");
    th.textContent = col.label;
    hr.appendChild(th);
  }
  const thAct = document.createElement("th");
  thAct.textContent = "";
  hr.appendChild(thAct);
  thead.appendChild(hr);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  data.rows.forEach((row, rowIndex) => {
    const tr = document.createElement("tr");
    for (const col of dataset.columns) {
      const td = document.createElement("td");
      td.appendChild(
        cellInput(col, row[col.key], (val) => {
          data.rows[rowIndex][col.key] = val;
        })
      );
      tr.appendChild(td);
    }
    const tdAct = document.createElement("td");
    tdAct.className = "row-actions";
    const del = document.createElement("button");
    del.type = "button";
    del.className = "btn btn-danger";
    del.textContent = "Remove";
    del.addEventListener("click", () => {
      data.rows.splice(rowIndex, 1);
      renderTable(wrap, dataset);
    });
    tdAct.appendChild(del);
    tr.appendChild(tdAct);
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  wrap.replaceChildren(table);
}

async function loadDataset(key) {
  const payload = await fetchDataset(key);
  cache[key] = { fields: payload.fields, rows: payload.rows };
}

async function init() {
  const tabsEl = document.getElementById("tabs");
  const tableWrap = document.getElementById("table-wrap");
  const flashEl = document.getElementById("flash");
  const offline = document.getElementById("offline-banner");
  const pathEl = document.getElementById("csv-path");

  const datasetFor = (key) => DATASET_LIST.find((d) => d.key === key);

  async function selectTab(key) {
    activeKey = key;
    renderTabs(tabsEl, selectTab);
    const ds = datasetFor(key);
    if (!ds) return;
    try {
      await loadDataset(key);
      offline.hidden = true;
      pathEl.textContent = cache[key]?.rows ? `( ${cache[key].rows.length} rows )` : "";
      renderTable(tableWrap, ds);
    } catch (err) {
      offline.hidden = false;
      flash(flashEl, String(err), "err");
    }
  }

  document.getElementById("btn-add").addEventListener("click", () => {
    const ds = datasetFor(activeKey);
    const data = cache[activeKey];
    if (!ds || !data) return;
    data.rows.push(emptyRow(ds, data.rows));
    renderTable(tableWrap, ds);
  });

  document.getElementById("btn-save").addEventListener("click", async () => {
    const data = cache[activeKey];
    if (!data) return;
    try {
      const res = await saveDataset(activeKey, data.rows);
      flash(flashEl, `Saved ${res.rowCount} rows → ${res.path}`, "ok");
      const st = await fetchStatus();
      pathEl.textContent = `Last CSV update · roster JSON: ${st.rosterSyncedAt || "run sync"}`;
    } catch (err) {
      flash(flashEl, String(err), "err");
    }
  });

  document.getElementById("btn-sync").addEventListener("click", async () => {
    try {
      const res = await runSyncRec();
      flash(flashEl, "Dashboard JSON updated. Open Clinical Core REC section to verify.", "ok");
      if (res.status?.rosterSyncedAt) {
        pathEl.textContent = `recRoster.json synced at ${res.status.rosterSyncedAt}`;
      }
    } catch (err) {
      flash(flashEl, String(err), "err");
    }
  });

  document.getElementById("btn-reload").addEventListener("click", () => selectTab(activeKey));

  try {
    await fetchStatus();
    offline.hidden = true;
  } catch {
    offline.hidden = false;
  }

  renderTabs(tabsEl, selectTab);
  await selectTab(activeKey);
}

init();
