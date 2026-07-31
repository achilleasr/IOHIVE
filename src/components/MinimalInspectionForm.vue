<template>
  <form class="two-col" @submit.prevent="submit">
    <aside v-if="previous" class="prev-col">
      <div class="title-row">
        <span class="panel-title prev">Previous Inspection</span>
        <span class="panel-date">{{ formatDate(previous.date) }}</span>
      </div>
      <div v-for="p in prevPanels" :key="p.title" class="box prev-box">
        <span class="panel-sub" :class="p.cls">{{ p.title }}</span>
        <div class="total-line">
          Total frames: <strong>{{ fmt1(p.state.totalFrames) }}</strong>
          <span v-if="p.delta && signed(p.delta.totalFrames)" class="delta"
            :class="p.delta.totalFrames > 0 ? 'pos' : 'neg'">{{ signed(p.delta.totalFrames) }}</span>
        </div>
        <div class="frame-grid">
          <div v-for="f in allFrames" :key="f.key" class="cell">
            <span class="cell-label">{{ f.label }}</span>
            <span class="cell-val">
              {{ fmt1(p.state[f.key]) }}
              <span v-if="p.delta && signed(p.delta.frames[f.key])" class="delta"
                :class="p.delta.frames[f.key] > 0 ? 'pos' : 'neg'">{{ signed(p.delta.frames[f.key]) }}</span>
            </span>
          </div>
        </div>
        <div v-if="p.lines" class="lines">
          <div v-for="l in p.lines" :key="l.kind" class="line" :class="l.kind">{{ l.text }}</div>
        </div>
        <div v-if="p.showMeta" class="meta-lines">
          <span v-for="f in obsFields" :key="f.key">{{ f.label }}: {{ labelFor(f.options, p.state[f.key]) }}</span>
        </div>
        <div v-if="p.tags && p.tags.length" class="tag-row">
          <span v-for="t in p.tags" :key="t" class="tag">{{ t }}</span>
        </div>
        <div v-if="p.note" class="note" :class="p.cls === 'int' ? 'int' : ''">{{ p.note }}</div>
      </div>
    </aside>

    <section class="new-col">
      <div class="title-row">
        <span class="panel-title new">New Inspection</span>
        <div class="datetime">
          <input v-model="dateOnly" type="date" :disabled="submitting" />
          <input v-model="timeOnly" type="time" :disabled="submitting" />
        </div>
      </div>

      <div class="box">
        <div class="step-head"><span class="badge obs">Step 1</span><span class="step-title">Observation</span></div>

        <div class="total-row">
          <label>Total frames</label>
          <div class="stepper wide">
            <button type="button" @click="bump(observed, 'totalFrames', -1)" :disabled="submitting">−</button>
            <input v-model.number="observed.totalFrames" type="number" min="0" max="60" step="1"
              @change="clamp(observed, 'totalFrames', 60)" :disabled="submitting" />
            <button type="button" @click="bump(observed, 'totalFrames', 1)" :disabled="submitting">+</button>
          </div>
        </div>

        <div class="frame-grid">
          <div v-for="f in frames" :key="f.key" class="cell">
            <span class="cell-label">{{ f.label }}</span>
            <div class="stepper">
              <button type="button" @click="bump(observed, f.key, -0.1)" :disabled="submitting">−</button>
              <input v-model.number="observed[f.key]" type="number" min="0" step="0.1"
                @change="clamp(observed, f.key, observed.totalFrames)" :disabled="submitting" />
              <button type="button" @click="bump(observed, f.key, 0.1)" :disabled="submitting">+</button>
            </div>
          </div>
          <div class="cell locked">
            <span class="cell-label">Empty</span>
            <span class="cell-val muted">{{ fmt1(observedEmpty) }}</span>
          </div>
        </div>

        <div v-if="overflow" class="warn">
          Frame contents ({{ fmt1(observedOccupied) }}) exceed total frames ({{ fmt1(observed.totalFrames) }}).
        </div>

        <div class="meta-grid">
          <div v-for="f in obsFields" :key="f.key" class="field">
            <label>{{ f.label }}</label>
            <div class="choice-row">
              <button v-for="o in f.options" :key="String(o.value)" type="button"
                :class="['btn-choice', f.emoji ? 'emoji' : '', observed[f.key] === o.value ? (o.value === f.danger ? 'sel-danger' : 'sel') : '']"
                @click="pick(observed, f.key, o.value, true)" :disabled="submitting">{{ o.label }}</button>
            </div>
          </div>
          <div class="field wide">
            <label>Observation note</label>
            <textarea v-model="observed.notes" rows="2" :disabled="submitting"></textarea>
          </div>
        </div>
      </div>

      <div class="box">
        <div class="step-head">
          <span class="badge int">Step 2</span><span class="step-title">Intervention</span>
          <div class="choice-row push">
            <button type="button" :class="['btn-choice', hasIntervention ? 'sel-danger' : '']"
              @click="hasIntervention = true" :disabled="submitting">Yes</button>
            <button type="button" :class="['btn-choice', !hasIntervention ? 'sel' : '']"
              @click="hasIntervention = false" :disabled="submitting">No</button>
          </div>
        </div>

        <div v-if="hasIntervention">
          <div class="total-row">
            <label>Empty frames added</label>
            <div class="stepper wide">
              <button type="button" @click="bump(intervention, 'emptyAdded', -1)" :disabled="submitting">−</button>
              <input v-model.number="intervention.emptyAdded" type="number" min="0" max="60" step="1"
                @change="clamp(intervention, 'emptyAdded', 60)" :disabled="submitting" />
              <button type="button" @click="bump(intervention, 'emptyAdded', 1)" :disabled="submitting">+</button>
            </div>
          </div>

          <div class="sub-label">Frames removed</div>
          <div class="frame-grid">
            <div v-for="f in allFrames" :key="f.key" class="cell">
              <span class="cell-label">{{ f.label }}</span>
              <div class="stepper">
                <button type="button" @click="bumpRemoval(f.key, -0.1)" :disabled="submitting">−</button>
                <input v-model.number="intervention[f.key + 'Removed']" type="number" min="0" step="0.1"
                  @change="clamp(intervention, f.key + 'Removed', availableFor(f.key))" :disabled="submitting" />
                <button type="button" @click="bumpRemoval(f.key, 0.1)" :disabled="submitting">+</button>
              </div>
            </div>
          </div>

          <div class="meta-grid">
            <div v-for="f in intFields" :key="f.key" class="field">
              <label>{{ f.label }}</label>
              <div class="choice-row">
                <button v-for="o in yesNo" :key="String(o.value)" type="button"
                  :class="['btn-choice', intervention[f.key] === o.value ? 'sel' : '']"
                  @click="pick(intervention, f.key, o.value, false)" :disabled="submitting">{{ o.label }}</button>
              </div>
            </div>
            <div class="field" v-if="intervention.treatmentApplied">
              <label>Treatment details</label>
              <input v-model="intervention.treatmentDetails" type="text" :disabled="submitting" />
            </div>
            <div class="field wide">
              <label>Intervention note</label>
              <textarea v-model="intervention.notes" rows="2" :disabled="submitting"></textarea>
            </div>
          </div>
        </div>
      </div>

      <div class="box result">
        <div class="step-head"><span class="badge res">Result</span><span class="step-title">Resulting state</span>
        </div>
        <div class="total-line">
          Total frames: <strong>{{ fmt1(result.totalFrames) }}</strong>
          <span v-if="delta('totalFrames')" :class="['delta', delta('totalFrames') > 0 ? 'pos' : 'neg']">
            {{ signed(delta('totalFrames')) }}
          </span>
        </div>
        <div class="frame-grid">
          <div v-for="f in allFrames" :key="f.key" class="cell">
            <span class="cell-label">{{ f.label }}</span>
            <span class="cell-val">
              {{ fmt1(result[f.key]) }}
              <span v-if="delta(f.key)" :class="['delta', delta(f.key) > 0 ? 'pos' : 'neg']">
                {{ signed(delta(f.key)) }}
              </span>
            </span>
          </div>
        </div>
        <div v-if="resultTags.length" class="tag-row">
          <span v-for="t in resultTags" :key="t" class="tag">{{ t }}</span>
        </div>
      </div>

      <div v-if="error" class="err">{{ error }}</div>

      <div class="actions">
        <button type="button" class="btn-sec" @click="$emit('cancel')" :disabled="submitting">Cancel</button>
        <button type="submit" class="btn-pri" :disabled="submitting">{{ submitting ? 'Saving…' : 'Save Inspection'
          }}</button>
      </div>
    </section>
  </form>
</template>

<script>
import { mapState } from 'vuex';
import { createInspection, listInspectionsForHive } from '@/services/api/inspectionsApi';
import { saveIohiveInspection } from '@/services/api/iohiveApi';
import {
  fmt1, signed, r1, frameDeltaLines, interventionDelta,
} from './InspectionDeltas.js';

const FRAMES = [
  { key: 'eggs', label: 'Eggs' },
  { key: 'larvae', label: 'Larvae' },
  { key: 'brood', label: 'Capped brood' },
  { key: 'honey', label: 'Honey' },
  { key: 'pollen', label: 'Pollen' },
];
const YESNO = [{ value: true, label: 'Yes' }, { value: false, label: 'No' }];
const POP = [{ value: 1, label: 'Weak' }, { value: 2, label: 'Medium' }, { value: 3, label: 'Strong' }];
const COND = [{ value: 1, label: '😞' }, { value: 2, label: '😐' }, { value: 3, label: '😊' }];

export default {
  name: 'MinimalInspectionForm',
  props: {
    hive: { type: Object, required: true },
    previous: { type: Object, default: null },
  },
  emits: ['saved', 'cancel'],
  data() {
    const p = (n) => String(n).padStart(2, '0');
    const now = new Date();
    const zero = {};
    for (const f of FRAMES) zero[f.key] = 0;
    const removals = {};
    for (const k of [...FRAMES.map((f) => f.key), 'empty']) removals[k + 'Removed'] = 0;
    return {
      submitting: false,
      error: null,
      hasIntervention: false,
      frames: FRAMES,
      yesNo: YESNO,
      dateOnly: `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`,
      timeOnly: `${p(now.getHours())}:${p(now.getMinutes())}`,
      obsFields: [
        { key: 'population', label: 'Population', options: POP },
        { key: 'impression', label: 'Condition', options: COND, emoji: true },
        { key: 'queenSeen', label: 'Queen seen', options: YESNO, danger: false },
        { key: 'needsAttention', label: 'Needs attention', options: YESNO, danger: true },
      ],
      intFields: [
        { key: 'fed', label: 'Fed' },
        { key: 'queenReplaced', label: 'New queen' },
        { key: 'treatmentApplied', label: 'Treatment' },
      ],
      observed: {
        totalFrames: 10, ...zero,
        population: null, impression: null, queenSeen: null, needsAttention: null, notes: '',
      },
      intervention: {
        emptyAdded: 0, ...removals,
        fed: false, queenReplaced: false, treatmentApplied: false, treatmentDetails: '', notes: '',
      },
    };
  },
  computed: {
    ...mapState(['defaultChecklist']),
    allFrames() { return [...FRAMES, { key: 'empty', label: 'Empty' }]; },
    observedOccupied() { return FRAMES.reduce((s, f) => s + (this.observed[f.key] || 0), 0); },
    observedEmpty() { return Math.max(0, (this.observed.totalFrames || 0) - this.observedOccupied); },
    overflow() { return this.observedOccupied > (this.observed.totalFrames || 0) + 0.001; },
    prevState() { return this.previous ? (this.previous.resultingState || this.previous.observedState || {}) : {}; },
    prevPanels() {
      const p = this.previous;
      if (!p) return [];
      const obs = {
        title: p.mutation ? 'Observed' : 'Recorded state', cls: 'obs',
        state: p.observedState || {}, delta: p.deltas?.fromPrevious || null,
        showMeta: true, note: p.observedState?.notes || '',
      };
      if (!p.mutation) return [obs];
      const d = interventionDelta(p);
      return [obs, {
        title: 'After intervention', cls: 'int',
        state: p.resultingState || {}, delta: d, lines: frameDeltaLines(d),
        tags: this.tagsOf(p.mutation), note: p.mutation?.notes || '',
      }];
    },
    resultTags() { return this.hasIntervention ? this.tagsOf(this.intervention) : []; },
    result() {
      const o = this.observed;
      const i = this.intervention;
      const on = this.hasIntervention;
      const out = {
        population: o.population, impression: o.impression, needsAttention: o.needsAttention,
        queenSeen: on && i.queenReplaced ? true : o.queenSeen, notes: o.notes,
      };
      let removed = on ? (i.emptyRemoved || 0) : 0;
      for (const f of FRAMES) {
        const r = on ? (i[f.key + 'Removed'] || 0) : 0;
        out[f.key] = Math.max(0, r1((o[f.key] || 0) - r));
        removed += r;
      }
      out.totalFrames = Math.max(0, r1((o.totalFrames || 0) + (on ? i.emptyAdded || 0 : 0) - removed));
      out.empty = Math.max(0, r1(out.totalFrames - FRAMES.reduce((s, f) => s + out[f.key], 0)));
      return out;
    },
  },
  created() {
    this.$store.dispatch('loadChecklists');
    const s = this.prevState;
    if (!this.previous) return;
    this.observed.totalFrames = s.totalFrames != null ? s.totalFrames : 10;
    for (const f of FRAMES) this.observed[f.key] = s[f.key] != null ? s[f.key] : 0;
    for (const k of ['queenSeen', 'population', 'impression', 'needsAttention']) {
      this.observed[k] = s[k] != null ? s[k] : null;
    }
  },
  methods: {
    r1, fmt1, signed,
    labelFor(options, value) { const f = options.find((o) => o.value === value); return f ? f.label : '—'; },
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
    pick(obj, key, value, nullable) { obj[key] = nullable && obj[key] === value ? null : value; },
    availableFor(key) { return key === 'empty' ? this.observedEmpty : this.observed[key] || 0; },
    bump(obj, field, d) { obj[field] = Math.max(0, r1((obj[field] || 0) + d)); },
    bumpRemoval(key, d) {
      const f = key + 'Removed';
      this.intervention[f] = Math.min(Math.max(0, r1((this.intervention[f] || 0) + d)), r1(this.availableFor(key)));
    },
    clamp(obj, field, max) {
      let v = r1(obj[field]);
      if (v < 0) v = 0;
      if (max != null && v > max) v = r1(max);
      obj[field] = v;
    },
    delta(key) {
      if (!this.previous) return 0;
      const before = this.prevState[key] != null ? this.prevState[key] : 0;
      return r1((this.result[key] || 0) - before);
    },
    mergedNotes() {
      const parts = [];
      const on = this.observed.notes?.trim();
      if (on) parts.push(`Observation: ${on}`);
      if (this.hasIntervention) {
        const i = this.intervention;
        const acts = [];
        if (i.emptyAdded) acts.push(`${this.fmt1(i.emptyAdded)} empty frame(s) added`);
        for (const f of this.allFrames) {
          const r = i[f.key + 'Removed'] || 0;
          if (r) acts.push(`${this.fmt1(r)} ${f.label.toLowerCase()} removed`);
        }
        if (i.fed) acts.push('fed');
        if (i.queenReplaced) acts.push('new queen');
        if (i.treatmentApplied) acts.push(i.treatmentDetails ? `treatment: ${i.treatmentDetails}` : 'treatment applied');
        const combined = [acts.join(', '), i.notes?.trim()].filter(Boolean).join('. ');
        if (combined) parts.push(`Intervention: ${combined}`);
      }
      return parts.join('\n');
    },
    beepPayload() {
      const p = (n) => String(n).padStart(2, '0');
      const d = new Date(`${this.dateOnly}T${this.timeOnly || '00:00'}:00`);
      const date = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:00`;
      const rs = this.result;
      const items = {
        270: rs.eggs > 0 ? 1 : 0,
        276: rs.larvae > 0 ? 1 : 0,
        273: rs.brood > 0 ? 1 : 0,
        494: rs.honey || 0,
        900: rs.pollen || 0,
        80: rs.empty || 0,
        774: r1((rs.totalFrames || 0) - (rs.empty || 0)),
      };
      const brood = r1(rs.eggs + rs.larvae + rs.brood);
      if (brood > 0) items[264] = brood;
      if (rs.eggs > 0) items[870] = rs.eggs;
      if (rs.larvae > 0) items[871] = rs.larvae;
      if (rs.brood > 0) items[872] = rs.brood;
      if (rs.queenSeen != null) items[399] = rs.queenSeen ? 1 : 0;
      if (this.hasIntervention && this.intervention.queenReplaced) items[429] = 1;
      if (this.hasIntervention && this.intervention.treatmentApplied) {
        items[595] = 1;
        if (this.intervention.treatmentDetails) items[600] = this.intervention.treatmentDetails;
      }
      const payload = { date, checklist_id: this.defaultChecklist?.id ?? null, hive_ids: [this.hive.id], items };
      if (rs.impression != null) payload.impression = rs.impression;
      if (rs.needsAttention != null) payload.attention = rs.needsAttention ? 1 : 0;
      const notes = this.mergedNotes();
      if (notes) payload.notes = notes;
      return payload;
    },
    async newestBeepId() {
      try {
        const r = await listInspectionsForHive(this.hive.id);
        return r?.data?.inspections?.data?.[0]?.id ?? null;
      } catch { return null; }
    },
    async submit() {
      if (this.overflow) { this.error = 'Frame contents cannot exceed the total number of frames.'; return; }
      this.submitting = true;
      this.error = null;
      try {
        const payload = this.beepPayload();
        await createInspection(payload);
        try {
          await saveIohiveInspection({
            beepInspectionId: await this.newestBeepId(),
            hiveId: this.hive.id,
            hiveName: this.hive.name || '',
            apiaryId: this.hive.location_id || null,
            date: payload.date,
            observedState: { ...this.observed, empty: r1(this.observedEmpty) },
            mutation: this.hasIntervention ? { ...this.intervention } : null,
            resultingState: { ...this.result },
          });
        } catch (e) { console.warn('IOHIVE save failed (BEEP save succeeded):', e); }
        this.$store.commit('clearHiveInspections', this.hive.id);
        this.$emit('saved');
      } catch (err) {
        const d = err?.response?.data;
        this.error = d?.message || Object.values(d?.errors || {})?.[0]?.[0] || 'Failed to save. Please try again.';
      } finally { this.submitting = false; }
    },
  },
};
</script>

<style scoped>
.two-col {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.prev-col {
  flex: 0 0 290px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: sticky;
  top: 0;
}

.new-col {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.panel-title {
  font-size: 1rem;
  font-weight: bold;
}

.panel-title.prev {
  color: #6b6f8f;
}

.panel-title.new {
  color: #575EAE;
}

.panel-date {
  font-size: .78rem;
  color: #999;
}

.datetime {
  display: flex;
  gap: 6px;
}

.box {
  border: 1px solid #e3e4f3;
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.prev-box {
  background: #f4f5fb;
  border: 2px solid #cfd3ee;
}

.result {
  background: #f0faf3;
  border: 2px solid #b8e0c4;
}

.step-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.step-title {
  font-size: 1.02rem;
  font-weight: bold;
  color: #333;
}

.badge {
  padding: 3px 12px;
  border-radius: 100px;
  font-size: .72rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: .05em;
}

.badge.obs {
  background: #e0e3f8;
  color: #575EAE;
}

.badge.int {
  background: #fde8e8;
  color: #a32020;
}

.badge.res {
  background: #d4f0dc;
  color: #2a7a40;
}

.push {
  margin-left: auto;
}

.total-line {
  font-size: .88rem;
  color: #555;
}

.total-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.total-row label {
  font-size: .88rem;
  color: #555;
  min-width: 140px;
}

.sub-label {
  font-size: .76rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: .06em;
  color: #a32020;
}

.frame-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.cell {
  background: #fff;
  border: 1px solid #e3e4f3;
  border-radius: 10px;
  padding: 7px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;
  min-width: 0;
}

.cell.locked {
  background: #f0f0f0;
}

.cell-label {
  font-size: .66rem;
  color: #999;
  text-transform: uppercase;
  letter-spacing: .04em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.cell-val {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
}

.cell-val.muted {
  color: #888;
}

.delta {
  font-size: .72rem;
  font-weight: bold;
  margin-left: 3px;
}

.panel-sub {
  font-size: .85rem;
  font-weight: bold;
}

.panel-sub.obs {
  color: #575EAE;
}

.panel-sub.int {
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

.delta.pos {
  color: #2a7a40;
}

.delta.neg {
  color: #a32020;
}

.stepper {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: #F9FAFE;
  width: 100%;
}

.stepper.wide {
  max-width: 160px;
}

.stepper button {
  border: 0;
  background: #eceef8;
  color: #575EAE;
  width: 26px;
  flex-shrink: 0;
  font-size: 1.05rem;
  cursor: pointer;
}

.stepper button:hover:not(:disabled) {
  background: #dcdff0;
}

.stepper button:disabled {
  opacity: .4;
  cursor: not-allowed;
}

.stepper input {
  border: 0;
  background: transparent;
  text-align: center;
  width: 100%;
  min-width: 0;
  padding: 6px 2px;
  font-family: TwCen, sans-serif;
  font-size: .92rem;
  color: #333;
  -moz-appearance: textfield;
  appearance: textfield;
}

.stepper input::-webkit-outer-spin-button,
.stepper input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.stepper input:focus {
  outline: none;
}

.meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.field.wide {
  grid-column: 1 / -1;
}

.field label {
  font-size: .82rem;
  color: #666;
}

.field input[type="text"],
.field textarea,
.datetime input {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 7px 10px;
  font-family: TwCen, sans-serif;
  font-size: .92rem;
  background: #F9FAFE;
  color: #333;
  width: 100%;
  box-sizing: border-box;
  resize: vertical;
}

.datetime input {
  width: auto;
}

.field input:focus,
.field textarea:focus {
  outline: none;
  border-color: #575EAE;
}

.choice-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.btn-choice {
  padding: 5px 14px;
  border-radius: 100px;
  border: 2px solid #ddd;
  background: #fff;
  color: #555;
  font-family: TwCen, sans-serif;
  font-size: .85rem;
  cursor: pointer;
  transition: all .15s;
}

.btn-choice.emoji {
  font-size: 1.05rem;
  padding: 3px 14px;
}

.btn-choice.sel {
  border-color: #575EAE;
  background: #575EAE;
  color: #fff;
}

.btn-choice.sel-danger {
  border-color: #e46268;
  background: #e46268;
  color: #fff;
}

.btn-choice:disabled {
  opacity: .5;
  cursor: not-allowed;
}

.meta-lines {
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: .82rem;
  color: #666;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag {
  background: #fde8e8;
  color: #a32020;
  border-radius: 100px;
  padding: 2px 10px;
  font-size: .74rem;
  font-weight: bold;
}

.note {
  font-size: .8rem;
  color: #555;
  background: #fff;
  border-radius: 8px;
  padding: 7px 9px;
  white-space: pre-wrap;
  border-left: 3px solid #cfd3ee;
}

.note.int {
  border-left-color: #e9b7b7;
}

.note-label {
  display: block;
  font-size: .66rem;
  text-transform: uppercase;
  letter-spacing: .05em;
  color: #999;
  margin-bottom: 2px;
}

.warn {
  color: #8a5b00;
  background: #fff6e0;
  border-left: 3px solid #e0a800;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: .85rem;
}

.err {
  color: #c43030;
  background: #fdeaea;
  border-left: 3px solid #d05050;
  padding: 9px 12px;
  border-radius: 8px;
  font-size: .9rem;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-pri,
.btn-sec {
  padding: 10px 22px;
  border-radius: 100px;
  border: 0;
  font-family: TwCen, sans-serif;
  font-size: 1rem;
  cursor: pointer;
  transition: all .15s;
}

.btn-pri {
  background: #575EAE;
  color: #fff;
}

.btn-pri:hover:not(:disabled) {
  background: #3e4379;
}

.btn-pri:disabled {
  background: #b5b8d4;
  cursor: not-allowed;
}

.btn-sec {
  background: #f0f0f0;
  color: #555;
}

.btn-sec:hover:not(:disabled) {
  background: #e0e0e0;
}

@media (max-width: 900px) {
  .two-col {
    flex-direction: column;
  }

  .prev-col {
    position: static;
    flex: none;
    width: 100%;
  }

  .meta-grid {
    grid-template-columns: 1fr;
  }
}
</style>