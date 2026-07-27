const BASE = "/.netlify/functions";

export async function saveIohiveInspection(payload) {
  const res = await fetch(`${BASE}/saveInspection`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to save inspection");
  }
  return res.json();
}

export async function getIohiveHistory(hiveId) {
  const res = await fetch(`${BASE}/getHistory?hiveId=${hiveId}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to load history");
  }
  return res.json();
}
