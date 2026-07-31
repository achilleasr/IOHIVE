export const FRAMES = [
  { key: "eggs", label: "Eggs", noun: "Egg" },
  { key: "larvae", label: "Larvae", noun: "Larvae" },
  { key: "brood", label: "Capped brood", noun: "Capped brood" },
  { key: "honey", label: "Honey", noun: "Honey" },
  { key: "pollen", label: "Pollen", noun: "Pollen" },
  { key: "empty", label: "Empty", noun: "Empty" },
];

export function r1(v) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n * 10) / 10 : 0;
}

export function fmt1(v) {
  return r1(v).toFixed(1);
}

// "+2.0", "-3.5", or null
export function signed(v) {
  const n = r1(v);
  return n === 0 ? null : (n > 0 ? "+" : "-") + Math.abs(n).toFixed(1);
}

export function finalStateOf(inspection) {
  return inspection
    ? inspection.resultingState || inspection.observedState || null
    : null;
}

export function diffStates(from, to) {
  if (!from || !to) return null;
  const frames = {};
  for (const f of FRAMES) frames[f.key] = r1(r1(to[f.key]) - r1(from[f.key]));
  return { frames, totalFrames: r1(r1(to.totalFrames) - r1(from.totalFrames)) };
}

// [{ kind: 'added', text: 'Added: 2.0 Empty frames' }, { kind: 'removed', text: 'Removed: 3.5 Egg frames' }]
export function frameDeltaLines(delta) {
  if (!delta || !delta.frames) return [];
  const added = [];
  const removed = [];
  for (const f of FRAMES) {
    const d = r1(delta.frames[f.key]);
    if (d > 0) added.push(`${d.toFixed(1)} ${f.noun} frames`);
    if (d < 0) removed.push(`${Math.abs(d).toFixed(1)} ${f.noun} frames`);
  }
  const lines = [];
  if (added.length)
    lines.push({
      kind: "added",
      text: `Added: ${added.join(", ")}`,
    });
  if (removed.length)
    lines.push({ kind: " removed", text: `Removed: ${removed.join(", ")}` });
  return lines;
}

// Observation of an inspection  compared with the previous inspectio
export function observationDelta(item, previous) {
  if (item && item.deltas && item.deltas.fromPrevious)
    return item.deltas.fromPrevious;
  return diffStates(finalStateOf(previous), item && item.observedState);
}

// Intervention compared with the observation of the same inspection
export function interventionDelta(item) {
  if (!item || !item.mutation) return null;
  if (item.deltas && item.deltas.fromObservation)
    return item.deltas.fromObservation;
  return diffStates(item.observedState, item.resultingState);
}
