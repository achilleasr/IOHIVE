<template>
  <div class="history">
    <div v-if="loading" class="msg">Loading…</div>
    <div v-else-if="error" class="msg err">{{ error }}</div>
    <div v-else-if="!inspections.length" class="msg">No inspections recorded yet.</div>

    <div v-else class="list">
      <div v-for="(item, i) in inspections" :key="item._id || i" class="entry">
        <div class="entry-head" @click="toggle(i)">
          <span class="date">{{ formatDate(item.date) }}</span>
          <span class="tags">
            <span class="tag obs">Observation</span>
            <span v-if="item.mutation" class="tag int">Intervention</span>
          </span>
          <span class="total">Total frames: {{ fmt1(stateOf(item).totalFrames) }}</span>
          <img src="../assets/Hives/i_arrow_down.svg" class="chev" :class="{ rotated: open[i] }" />
        </div>

        <div v-if="open[i]" class="entry-body">
          <div v-for="p in panelsFor(item, inspections[i + 1])" :key="p.title" class="panel">
            <span class="panel-title" :class="p.cls">{{ p.title }}</span>

            <div class="total-line">
              Total frames: <strong>{{ fmt1(p.state.totalFrames) }}</strong>
              <span v-if="p.delta && signed(p.delta.totalFrames)" class="delta"
                :class="p.delta.totalFrames > 0 ? 'pos' : 'neg'">{{ signed(p.delta.totalFrames) }}</span>
            </div>

            <div class="frame-grid">
              <div v-for="f in frames" :key="f.key" class="cell">
                <span class="cell-label">{{ f.label }}</span>
                <span class="cell-val">{{ fmt1(p.state[f.key]) }}</span>
                <span v-if="p.delta && signed(p.delta.frames[f.key])" class="delta"
                  :class="p.delta.frames[f.key] > 0 ? 'pos' : 'neg'">{{ signed(p.delta.frames[f.key]) }}</span>
              </div>
            </div>

            <div v-if="p.lines" class="lines">
              <div v-for="l in p.lines" :key="l.kind" class="line" :class="l.kind">{{ l.text }}</div>
              <div v-if="!p.lines.length" class="line none">No frames added or removed.</div>
            </div>

            <div v-if="p.showMeta" class="meta">
              <span>Population: {{ label(POP, p.state.population) }}</span>
              <span>Condition: {{ label(COND, p.state.impression) }}</span>
              <span>Queen seen: {{ bool(p.state.queenSeen) }}</span>
              <span>Needs attention: {{ bool(p.state.needsAttention) }}</span>
            </div>

            <div v-if="p.tags && p.tags.length" class="tag-row">
              <span v-for="t in p.tags" :key="t" class="tag int">{{ t }}</span>
            </div>
            <div v-if="p.note" class="note">{{ p.note }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  FRAMES, fmt1, signed, finalStateOf, observationDelta, interventionDelta, frameDeltaLines,
} from './InspectionDeltas.js';

const POP = [{ value: 1, label: 'Weak' }, { value: 2, label: 'Medium' }, { value: 3, label: 'Strong' }];
const COND = [{ value: 1, label: '😞' }, { value: 2, label: '😐' }, { value: 3, label: '😊' }];

export default {
  name: 'InspectionHistory',
  props: {
    // newest first, as returned by getHistory
    inspections: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    error: { type: String, default: null },
  },
  data() { return { open: {}, frames: FRAMES, POP, COND }; },
  methods: {
    fmt1, signed,
    label(opts, v) { const f = opts.find((o) => o.value === v); return f ? f.label : '—'; },
    bool(v) { return v === true ? 'Yes' : v === false ? 'No' : '—'; },
    stateOf(item) { return finalStateOf(item) || {}; },
    toggle(i) { this.open = { ...this.open, [i]: !this.open[i] }; },
    formatDate(v) {
      const d = new Date(String(v || '').replace(' ', 'T'));
      return Number.isNaN(d.getTime()) ? String(v || '') : d.toLocaleString('en-GB',
        { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    },
    tagsOf(m) {
      if (!m) return [];
      const t = [];
      if (m.fed) t.push('Fed');
      if (m.queenReplaced) t.push('Queen changed');
      if (m.treatmentApplied) t.push(m.treatmentDetails ? `Treatment: ${m.treatmentDetails}` : 'Treatment');
      return t;
    },
    panelsFor(item, previous) {
      // observation: deltas against the state the previous inspection left behind
      const obs = {
        title: 'Observation', cls: 'obs',
        state: item.observedState || {}, note: item.observedState?.notes || '',
        delta: observationDelta(item, previous), showMeta: true,
      };
      if (!item.mutation) return [obs];
      // intervention: only what changed during the visit, no observation judgements
      const d = interventionDelta(item);
      return [obs, {
        title: 'After intervention', cls: 'int',
        state: item.resultingState || {}, note: item.mutation?.notes || '',
        delta: d, lines: frameDeltaLines(d), tags: this.tagsOf(item.mutation),
      }];
    },
  },
};
</script>

<style scoped>
.history {
  color: #333;
}

.msg {
  font-size: .9rem;
  color: #999;
  padding: 10px 0;
}

.msg.err {
  color: #c43030;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.entry {
  border: 1px solid #e3e4f3;
  border-radius: 12px;
  overflow: hidden;
}

.entry-head {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  background: #f9fafe;
  cursor: pointer;
  user-select: none;
}

.date {
  font-size: .92rem;
  font-weight: bold;
}

.total {
  font-size: .85rem;
  color: #777;
}

.chev {
  height: 1.1vw;
  min-height: 12px;
  margin-left: auto;
  transition: transform .15s;
}

.rotated {
  transform: rotate(180deg);
}

.tags {
  display: flex;
  gap: 5px;
}

.tag {
  border-radius: 100px;
  padding: 2px 10px;
  font-size: .72rem;
  font-weight: bold;
}

.tag.obs {
  background: #e0e3f8;
  color: #575EAE;
}

.tag.int {
  background: #fde8e8;
  color: #a32020;
}

.entry-body {
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  align-items: flex-start;
}

.panel {
  flex: 1;
  min-width: 0;
  border: 1px solid #e3e4f3;
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.panel-title {
  font-size: .85rem;
  font-weight: bold;
}

.panel-title.obs {
  color: #575EAE;
}

.panel-title.int {
  color: #a32020;
}

.total-line {
  font-size: .82rem;
  color: #666;
}

.delta {
  font-size: .72rem;
  font-weight: bold;
  margin-left: 3px;
}

.delta.pos {
  color: #2a7a40;
}

.delta.neg {
  color: #a32020;
}

.lines {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: .8rem;
}

.line.added {
  color: #2a7a40;
}

.line.removed {
  color: #a32020;
}

.line.none {
  color: #999;
}

.frame-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.cell {
  background: #fbfbfe;
  border: 1px solid #eceef8;
  border-radius: 8px;
  padding: 5px 7px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1px;
  min-width: 0;
}

.cell-label {
  font-size: .65rem;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: .04em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.cell-val {
  font-size: .95rem;
  font-weight: bold;
  color: #333;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: .8rem;
  color: #666;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.note {
  font-size: .82rem;
  color: #555;
  background: #f7f7fb;
  border-radius: 8px;
  padding: 7px 9px;
  white-space: pre-wrap;
}

@media (max-width: 900px) {
  .entry-body {
    flex-direction: column;
  }
}
</style>