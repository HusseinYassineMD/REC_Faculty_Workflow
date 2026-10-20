const API_BASE = "";

export async function fetchStatus() {
  const res = await fetch(`${API_BASE}/api/status`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchDataset(key) {
  const res = await fetch(`${API_BASE}/api/datasets/${encodeURIComponent(key)}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function saveDataset(key, rows) {
  const res = await fetch(`${API_BASE}/api/datasets/${encodeURIComponent(key)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rows }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function runSyncRec() {
  const res = await fetch(`${API_BASE}/api/sync/rec`, { method: "POST" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchRosterPreview() {
  const res = await fetch(`${API_BASE}/api/preview/rec-roster`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
