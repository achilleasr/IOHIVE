<template>
  <form class="inspection-form" @submit.prevent="submit">
    <div class="two-col">
      <aside v-if="previous" class="prev-col">
        <div class="panel-head">
          <span class="panel-title prev">Previous Inspection</span>
          <span class="panel-date">{{ formatDate(previous.date) }}</span>
        </div>

        <div class="total-line">Total frames: <strong>{{ round1(prevState.totalFrames) }}</strong></div>

        <div class="frame-grid">
          <div v-for="f in allFrameTypes" :key="f.key" class="frame-cell static">
            <span class="cell-label">{{ f.label }}</span>
            <span class="cell-static-val">{{ round1(prevState[f.key]) }}</span>
          </div>
        </div>

        <div class="meta-lines">
          <span>Population: {{ labelFor(populationOptions, prevState.population) }}</span>
          <span>Condition: {{ labelFor(impressionOptions, prevState.impression) }}</span>
          <span>Queen seen: {{ boolLabel(prevState.queenSeen) }}</span>
          <span>Needs attention: {{ boolLabel(prevState.needsAttention) }}</span>
        </div>

        <div v-if="prevTags.length" class="tag-row">
          <span v-for="t in prevTags" :key="t" class="tag">{{ t }}</span>
        </div>

        <div v-if="prevObsNote" class="note-block">
          <span class="note-label">Observation</span>
          {{ prevObsNote }}
        </div>
        <div v-if="prevIntNote" class="note-block int">
          <span class="note-label">Intervention</span>
          {{ prevIntNote }}
        </div>
      </aside>

      <section class="new-col">
        <div class="panel-head">
          <span class="panel-title new">New Inspection</span>
          <div class="datetime">
            <input v-model="dateOnly" type="date" :disabled="submitting" />
            <input v-model="timeOnly" type="time" :disabled="submitting" />
          </div>
        </div>

        <div class="step-section">
          <div class="step-header">
            <span class="step-badge obs">Step 1</span>
            <span class="step-title">Observation</span>
          </div>

          <div class="total-row">
            <label>Total frames</label>
            <div class="stepper wide">
              <button type="button" @click="bump(observed, 'totalFrames', -1)" :disabled="submitting">−</button>
              <input v-model.number="observed.totalFrames" type="number" min="0" max="60" step="1"
                @change="normalize(observed, 'totalFrames', 0, 60)" :disabled="submitting" />
              <button type="button" @click="bump(observed, 'totalFrames', 1)" :disabled="submitting">+</button>
            </div>
          </div>

          <div class="frame-grid">
            <div v-for="f in frameTypes" :key="f.key" class="frame-cell">
              <span class="cell-label">{{ f.label }}</span>
              <div class="stepper">
                <button type="button" @click="bump(observed, f.key, -0.1)" :disabled="submitting">−</button>
                <input v-model.number="observed[f.key]" type="number" min="0" step="0.1"
                  @change="normalize(observed, f.key, 0, observed.totalFrames)" :disabled="submitting" />
                <button type="button" @click="bump(observed, f.key, 0.1)" :disabled="submitting">+</button>
              </div>
            </div>

            <div class="frame-cell locked">
              <span class="cell-label">Empty</span>
              <span class="cell-static-val muted">{{ round1(observedEmpty) }}</span>
            </div>
          </div>

          <div v-if="observedOverflow" class="warn-message">
            Frame contents ({{ round1(observedOccupied) }}) exceed total frames ({{ round1(observed.totalFrames) }}).
          </div>

          <div class="meta-grid">
            <div class="field">
              <label>Population</label>
              <div class="choice-row">
                <button v-for="o in populationOptions" :key="o.value" type="button"
                  :class="['choice-btn', observed.population === o.value ? 'selected' : '']"
                  @click="observed.population = observed.population === o.value ? null : o.value"
                  :disabled="submitting">{{ o.label }}</button>
              </div>
            </div>

            <div class="field">
              <label>Condition</label>
              <div class="choice-row">
                <button v-for="o in impressionOptions" :key="o.value" type="button"
                  :class="['choice-btn emoji', observed.impression === o.value ? 'selected' : '']"
                  @click="observed.impression = observed.impression === o.value ? null : o.value"
                  :disabled="submitting">{{ o.label }}</button>
              </div>
            </div>

            <div class="field">
              <label>Queen seen</label>
              <div class="choice-row">
                <button type="button" :class="['choice-btn', observed.queenSeen === true ? 'selected' : '']"
                  @click="observed.queenSeen = observed.queenSeen === true ? null : true"
                  :disabled="submitting">Yes</button>
                <button type="button" :class="['choice-btn', observed.queenSeen === false ? 'selected-danger' : '']"
                  @click="observed.queenSeen = observed.queenSeen === false ? null : false"
                  :disabled="submitting">No</button>
              </div>
            </div>

            <div class="field">
              <label>Needs attention</label>
              <div class="choice-row">
                <button type="button" :class="['choice-btn', observed.needsAttention === true ? 'selected-danger' : '']"
                  @click="observed.needsAttention = observed.needsAttention === true ? null : true"
                  :disabled="submitting">Yes</button>
                <button type="button" :class="['choice-btn', observed.needsAttention === false ? 'selected' : '']"
                  @click="observed.needsAttention = observed.needsAttention === false ? null : false"
                  :disabled="submitting">No</button>
              </div>
            </div>

            <div class="field field-wide">
              <label>Observation note</label>
              <textarea v-model="observed.notes" rows="2" :disabled="submitting"></textarea>
            </div>
          </div>
        </div>

        <div class="step-section">
          <div class="step-header">
            <span class="step-badge int">Step 2</span>
            <span class="step-title">Intervention</span>
            <div class="choice-row header-choice">
              <button type="button" :class="['choice-btn', hasIntervention ? 'selected-danger' : '']"
                @click="hasIntervention = true" :disabled="submitting">Yes</button>
              <button type="button" :class="['choice-btn', !hasIntervention ? 'selected' : '']"
                @click="hasIntervention = false" :disabled="submitting">No</button>
            </div>
          </div>

          <div v-if="hasIntervention">
            <div class="total-row">
              <label>Empty frames added</label>
              <div class="stepper wide">
                <button type="button" @click="bump(intervention, 'emptyAdded', -1)" :disabled="submitting">−</button>
                <input v-model.number="intervention.emptyAdded" type="number" min="0" max="60" step="1"
                  @change="normalize(intervention, 'emptyAdded', 0, 60)" :disabled="submitting" />
                <button type="button" @click="bump(intervention, 'emptyAdded', 1)" :disabled="submitting">+</button>
              </div>
            </div>

            <div class="sub-label">Frames removed</div>
            <div class="frame-grid">
              <div v-for="f in allFrameTypes" :key="f.key" class="frame-cell">
                <span class="cell-label">{{ f.label }}</span>
                <div class="stepper">
                  <button type="button" @click="bumpRemoval(f.key, -0.1)" :disabled="submitting">−</button>
                  <input v-model.number="intervention[f.key + 'Removed']" type="number" min="0" step="0.1"
                    @change="normalize(intervention, f.key + 'Removed', 0, availableFor(f.key))"
                    :disabled="submitting" />
                  <button type="button" @click="bumpRemoval(f.key, 0.1)" :disabled="submitting">+</button>
                </div>
              </div>
            </div>

            <div class="meta-grid">
              <div class="field">
                <label>Fed</label>
                <div class="choice-row">
                  <button type="button" :class="['choice-btn', intervention.fed === true ? 'selected' : '']"
                    @click="intervention.fed = true" :disabled="submitting">Yes</button>
                  <button type="button" :class="['choice-btn', intervention.fed === false ? 'selected' : '']"
                    @click="intervention.fed = false" :disabled="submitting">No</button>
                </div>
              </div>

              <div class="field">
                <label>New queen</label>
                <div class="choice-row">
                  <button type="button" :class="['choice-btn', intervention.queenReplaced === true ? 'selected' : '']"
                    @click="intervention.queenReplaced = true" :disabled="submitting">Yes</button>
                  <button type="button" :class="['choice-btn', intervention.queenReplaced === false ? 'selected' : '']"
                    @click="intervention.queenReplaced = false" :disabled="submitting">No</button>
                </div>
              </div>

              <div class="field">
                <label>Treatment</label>
                <div class="choice-row">
                  <button type="button"
                    :class="['choice-btn', intervention.treatmentApplied === true ? 'selected' : '']"
                    @click="intervention.treatmentApplied = true" :disabled="submitting">Yes</button>
                  <button type="button"
                    :class="['choice-btn', intervention.treatmentApplied === false ? 'selected' : '']"
                    @click="intervention.treatmentApplied = false" :disabled="submitting">No</button>
                </div>
              </div>

              <div class="field">
                <label>Treatment details</label>
                <input v-model="intervention.treatmentDetails" type="text"
                  :disabled="submitting || !intervention.treatmentApplied" />
              </div>

              <div class="field field-wide">
                <label>Intervention note</label>
                <textarea v-model="intervention.notes" rows="2" :disabled="submitting"></textarea>
              </div>
            </div>
          </div>
        </div>

        <div v-if="hasIntervention" class="result-panel">
          <div class="step-header">
            <span class="step-badge res">Result</span>
            <span class="step-title">Resulting state</span>
          </div>
          <div class="total-line">Total frames: <strong>{{ round1(resultingState.totalFrames) }}</strong></div>
          <div class="frame-grid">
            <div v-for="f in allFrameTypes" :key="f.key" class="frame-cell static">
              <span class="cell-label">{{ f.label }}</span>
              <span class="cell-static-val">
                {{ round1(resultingState[f.key]) }}
                <span v-if="deltaFor(f.key) !== 0" :class="['delta', deltaFor(f.key) > 0 ? 'pos' : 'neg']">
                  {{ deltaFor(f.key) > 0 ? '+' : '' }}{{ round1(deltaFor(f.key)) }}
                </span>
              </span>
            </div>
          </div>
          <div v-if="resultTags.length" class="tag-row">
            <span v-for="t in resultTags" :key="t" class="tag">{{ t }}</span>
          </div>
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="$emit('cancel')" :disabled="submitting">Cancel</button>
          <button type="submit" class="btn-primary" :disabled="submitting">
            {{ submitting ? 'Saving…' : 'Save Inspection' }}
          </button>
        </div>
      </section>
    </div>
  </form>
</template>

<script>
import { mapState } from 'vuex';
import { createInspection } from '@/services/api/inspectionsApi';
import { saveIohiveInspection, getIohiveHistory } from '@/services/api/iohiveApi';

export default {
  name: 'MinimalInspectionForm',
  props: {
    hive: { type: Object, required: true },
  },
  emits: ['saved', 'cancel'],
  data() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return {
      submitting: false,
      error: null,
      previous: null,
      dateOnly: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
      timeOnly: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
      hasIntervention: false,
      frameTypes: [
        { key: 'eggs', label: 'Eggs' },
        { key: 'larvae', label: 'Larvae' },
        { key: 'brood', label: 'Capped brood' },
        { key: 'honey', label: 'Honey' },
        { key: 'pollen', label: 'Pollen' },
      ],
      populationOptions: [
        { value: 1, label: 'Weak' },
        { value: 2, label: 'Medium' },
        { value: 3, label: 'Good' },
      ],
      impressionOptions: [
        { value: 1, label: '😞' },
        { value: 2, label: '😐' },
        { value: 3, label: '😊' },
      ],
      observed: {
        totalFrames: 10,
        eggs: 0,
        larvae: 0,
        brood: 0,
        honey: 0,
        pollen: 0,
        population: null,
        impression: null,
        queenSeen: null,
        needsAttention: null,
        notes: '',
      },
      intervention: {
        emptyAdded: 0,
        eggsRemoved: 0,
        larvaeRemoved: 0,
        broodRemoved: 0,
        honeyRemoved: 0,
        pollenRemoved: 0,
        emptyRemoved: 0,
        fed: false,
        queenReplaced: false,
        treatmentApplied: false,
        treatmentDetails: '',
        notes: '',
      },
    };
  },
  computed: {
    ...mapState(['defaultChecklist']),

    allFrameTypes() {
      return [...this.frameTypes, { key: 'empty', label: 'Empty' }];
    },

    observedOccupied() {
      return this.frameTypes.reduce((s, f) => s + (this.observed[f.key] || 0), 0);
    },

    observedEmpty() {
      return Math.max(0, (this.observed.totalFrames || 0) - this.observedOccupied);
    },

    observedOverflow() {
      return this.observedOccupied > (this.observed.totalFrames || 0) + 0.001;
    },

    prevState() {
      const p = this.previous;
      if (!p) return {};
      return p.resultingState || p.observedState || {};
    },

    prevObsNote() {
      return this.previous?.observedState?.notes || '';
    },

    prevIntNote() {
      return this.previous?.mutation?.notes || '';
    },

    prevTags() {
      const m = this.previous?.mutation;
      if (!m) return [];
      const tags = [];
      if (m.fed) tags.push('Fed');
      if (m.queenReplaced) tags.push('Queen changed');
      if (m.treatmentApplied) tags.push(m.treatmentDetails ? `Treatment: ${m.treatmentDetails}` : 'Treatment');
      return tags;
    },

    resultTags() {
      if (!this.hasIntervention) return [];
      const i = this.intervention;
      const tags = [];
      if (i.fed) tags.push('Fed');
      if (i.queenReplaced) tags.push('Queen changed');
      if (i.treatmentApplied) tags.push(i.treatmentDetails ? `Treatment: ${i.treatmentDetails}` : 'Treatment');
      return tags;
    },

    resultingState() {
      const o = this.observed;
      const i = this.intervention;
      const on = this.hasIntervention;

      const out = {
        population: o.population,
        impression: o.impression,
        needsAttention: o.needsAttention,
        queenSeen: on && i.queenReplaced ? true : o.queenSeen,
        notes: o.notes,
      };

      let removedTotal = 0;
      for (const f of this.frameTypes) {
        const removed = on ? (i[f.key + 'Removed'] || 0) : 0;
        out[f.key] = Math.max(0, this.round1((o[f.key] || 0) - removed));
        removedTotal += removed;
      }
      removedTotal += on ? (i.emptyRemoved || 0) : 0;

      const added = on ? (i.emptyAdded || 0) : 0;
      out.totalFrames = Math.max(0, this.round1((o.totalFrames || 0) + added - removedTotal));

      const occupied = this.frameTypes.reduce((s, f) => s + (out[f.key] || 0), 0);
      out.empty = Math.max(0, this.round1(out.totalFrames - occupied));

      return out;
    },
  },
  async created() {
    await this.$store.dispatch('loadChecklists');
    await this.loadPrevious();
  },
  methods: {
    round1(v) {
      const n = Number(v);
      if (!Number.isFinite(n)) return 0;
      return Math.round(n * 10) / 10;
    },

    labelFor(options, value) {
      const found = options.find((o) => o.value === value);
      return found ? found.label : '—';
    },

    boolLabel(v) {
      if (v === true) return 'Yes';
      if (v === false) return 'No';
      return '—';
    },

    formatDate(v) {
      if (!v) return '';
      const d = new Date(String(v).replace(' ', 'T'));
      if (Number.isNaN(d.getTime())) return String(v);
      return d.toLocaleString('en-GB', {
        day: 'numeric', month: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
    },

    availableFor(key) {
      if (key === 'empty') return this.observedEmpty;
      return this.observed[key] || 0;
    },

    bump(obj, field, delta) {
      obj[field] = Math.max(0, this.round1((obj[field] || 0) + delta));
    },

    bumpRemoval(key, delta) {
      const field = key + 'Removed';
      const next = this.round1((this.intervention[field] || 0) + delta);
      const max = this.round1(this.availableFor(key));
      this.intervention[field] = Math.min(Math.max(0, next), max);
    },

    normalize(obj, field, min, max) {
      let v = Number(obj[field]);
      if (!Number.isFinite(v)) v = min;
      v = this.round1(v);
      if (v < min) v = min;
      if (max != null && v > max) v = this.round1(max);
      obj[field] = v;
    },

    deltaFor(key) {
      const before = key === 'empty' ? this.observedEmpty : (this.observed[key] || 0);
      return this.round1((this.resultingState[key] || 0) - before);
    },

    async loadPrevious() {
      try {
        const data = await getIohiveHistory(this.hive.id);
        const list = data?.inspections || [];
        if (list.length === 0) return;
        this.previous = list[0];
        const src = this.prevState;
        this.observed.totalFrames = src.totalFrames != null ? src.totalFrames : 10;
        for (const f of this.frameTypes) {
          this.observed[f.key] = src[f.key] != null ? src[f.key] : 0;
        }
        this.observed.queenSeen = src.queenSeen != null ? src.queenSeen : null;
        this.observed.population = src.population != null ? src.population : null;
        this.observed.impression = src.impression != null ? src.impression : null;
        this.observed.needsAttention = src.needsAttention != null ? src.needsAttention : null;
      } catch {
        this.previous = null;
      }
    },

    buildMergedNotes() {
      const parts = [];
      if (this.observed.notes && this.observed.notes.trim()) {
        parts.push(`Observation: ${this.observed.notes.trim()}`);
      }
      if (this.hasIntervention) {
        const i = this.intervention;
        const actions = [];
        if (i.emptyAdded) actions.push(`${this.round1(i.emptyAdded)} empty frame(s) added`);
        for (const f of this.allFrameTypes) {
          const r = i[f.key + 'Removed'] || 0;
          if (r) actions.push(`${this.round1(r)} ${f.label.toLowerCase()} removed`);
        }
        if (i.fed) actions.push('fed');
        if (i.queenReplaced) actions.push('new queen');
        if (i.treatmentApplied) {
          actions.push(i.treatmentDetails ? `treatment: ${i.treatmentDetails}` : 'treatment applied');
        }
        const note = i.notes && i.notes.trim() ? i.notes.trim() : '';
        const combined = [actions.join(', '), note].filter(Boolean).join('. ');
        if (combined) parts.push(`Intervention: ${combined}`);
      }
      return parts.join('\n');
    },

    buildBeepPayload() {
      const pad = (n) => String(n).padStart(2, '0');
      const time = this.timeOnly || '00:00';
      const d = this.dateOnly ? new Date(`${this.dateOnly}T${time}:00`) : new Date();
      const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
      const rs = this.resultingState;

      const items = {};

      const totalBrood = this.round1((rs.eggs || 0) + (rs.larvae || 0) + (rs.brood || 0));
      if (totalBrood > 0) items[264] = totalBrood;

      items[270] = rs.eggs > 0 ? 1 : 0;
      items[276] = rs.larvae > 0 ? 1 : 0;
      items[273] = rs.brood > 0 ? 1 : 0;

      if (rs.eggs > 0) items[870] = rs.eggs;
      if (rs.larvae > 0) items[871] = rs.larvae;
      if (rs.brood > 0) items[872] = rs.brood;

      items[494] = rs.honey || 0;
      items[900] = rs.pollen || 0;
      items[80] = rs.empty || 0;
      items[774] = this.round1((rs.totalFrames || 0) - (rs.empty || 0));

      if (rs.queenSeen != null) items[399] = rs.queenSeen ? 1 : 0;

      if (this.hasIntervention && this.intervention.queenReplaced) items[429] = 1;
      if (this.hasIntervention && this.intervention.treatmentApplied) {
        items[595] = 1;
        if (this.intervention.treatmentDetails) items[600] = this.intervention.treatmentDetails;
      }

      const payload = {
        date,
        checklist_id: this.defaultChecklist?.id ?? null,
        hive_ids: [this.hive.id],
        items,
      };

      if (rs.impression != null) payload.impression = rs.impression;
      if (rs.needsAttention != null) payload.attention = rs.needsAttention ? 1 : 0;

      const notes = this.buildMergedNotes();
      if (notes) payload.notes = notes;

      return payload;
    },

    async submit() {
      if (this.observedOverflow) {
        this.error = 'Frame contents cannot exceed the total number of frames.';
        return;
      }
      this.submitting = true;
      this.error = null;
      try {
        const beepPayload = this.buildBeepPayload();
        const beepRes = await createInspection(beepPayload);
        const beepId = beepRes?.data?.id || null;

        const iohivePayload = {
          beepInspectionId: beepId,
          hiveId: this.hive.id,
          hiveName: this.hive.name || '',
          apiaryId: this.hive.location_id || null,
          date: beepPayload.date,
          observedState: { ...this.observed, empty: this.round1(this.observedEmpty) },
          mutation: this.hasIntervention ? { ...this.intervention } : null,
          resultingState: { ...this.resultingState },
        };

        try {
          await saveIohiveInspection(iohivePayload);
        } catch (mongoErr) {
          console.warn('IOHIVE save failed (BEEP save succeeded):', mongoErr);
        }

        this.$store.commit('clearHiveInspections', this.hive.id);
        await this.$store.dispatch('loadHiveInspections', this.hive.id);
        this.$emit('saved');
      } catch (err) {
        const data = err?.response?.data;
        const msg = data?.message || Object.values(data?.errors || {})?.[0]?.[0];
        this.error = msg || 'Failed to save. Please try again.';
      } finally {
        this.submitting = false;
      }
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
  position: sticky;
  top: 0;
  background: #f4f5fb;
  border: 2px solid #cfd3ee;
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.new-col {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 6px;
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
  font-size: 0.78rem;
  color: #999;
}

.datetime {
  display: flex;
  gap: 6px;
}

.datetime input {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 6px 9px;
  font-family: TwCen, sans-serif;
  font-size: 0.88rem;
  background: #F9FAFE;
  color: #333;
}

.total-line {
  font-size: 0.88rem;
  color: #555;
}

.frame-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.frame-cell {
  background: white;
  border: 1px solid #e3e4f3;
  border-radius: 10px;
  padding: 7px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.frame-cell.locked {
  background: #f0f0f0;
}

.cell-label {
  font-size: 0.66rem;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cell-static-val {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
}

.cell-static-val.muted {
  color: #888;
}

.delta {
  font-size: 0.72rem;
  margin-left: 3px;
}

.delta.pos {
  color: #2a7a40;
}

.delta.neg {
  color: #a32020;
}

.meta-lines {
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: 0.82rem;
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
  font-size: 0.74rem;
  font-weight: bold;
}

.note-block {
  font-size: 0.8rem;
  color: #555;
  background: white;
  border-radius: 8px;
  padding: 7px 9px;
  white-space: pre-wrap;
  border-left: 3px solid #cfd3ee;
}

.note-block.int {
  border-left-color: #e9b7b7;
}

.note-label {
  display: block;
  font-size: 0.66rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #999;
  margin-bottom: 2px;
}

.step-section {
  border: 1px solid #e3e4f3;
  border-radius: 14px;
  padding: 16px 18px;
}

.step-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.header-choice {
  margin-left: auto;
}

.step-badge {
  padding: 3px 12px;
  border-radius: 100px;
  font-size: 0.72rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.step-badge.obs {
  background: #e0e3f8;
  color: #575EAE;
}

.step-badge.int {
  background: #fde8e8;
  color: #a32020;
}

.step-badge.res {
  background: #d4f0dc;
  color: #2a7a40;
}

.step-title {
  font-size: 1.02rem;
  font-weight: bold;
  color: #333;
}

.total-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}

.total-row label {
  font-size: 0.88rem;
  color: #555;
  min-width: 140px;
}

.sub-label {
  font-size: 0.76rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #a32020;
  margin: 4px 0 10px;
}

.stepper {
  display: flex;
  align-items: stretch;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: #F9FAFE;
}

.stepper.wide {
  max-width: 160px;
}

.stepper button {
  border: none;
  background: #eceef8;
  color: #575EAE;
  width: 26px;
  flex-shrink: 0;
  font-size: 1.05rem;
  cursor: pointer;
  transition: background 0.15s;
}

.stepper button:hover:not(:disabled) {
  background: #dcdff0;
}

.stepper button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.stepper input {
  border: none;
  background: transparent;
  text-align: center;
  width: 100%;
  min-width: 0;
  padding: 6px 2px;
  font-family: TwCen, sans-serif;
  font-size: 0.92rem;
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
  margin-top: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.field-wide {
  grid-column: 1 / -1;
}

.field label {
  font-size: 0.82rem;
  color: #666;
}

.field input[type="text"],
.field textarea {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 7px 10px;
  font-family: TwCen, sans-serif;
  font-size: 0.95rem;
  background: #F9FAFE;
  color: #333;
  width: 100%;
  box-sizing: border-box;
  resize: vertical;
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

.choice-btn {
  padding: 5px 14px;
  border-radius: 100px;
  border: 2px solid #ddd;
  background: white;
  color: #555;
  font-family: TwCen, sans-serif;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.15s;
}

.choice-btn.emoji {
  font-size: 1.05rem;
  padding: 3px 14px;
}

.choice-btn.selected {
  border-color: #575EAE;
  background: #575EAE;
  color: white;
}

.choice-btn.selected-danger {
  border-color: #e46268;
  background: #e46268;
  color: white;
}

.choice-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.result-panel {
  background: #f0faf3;
  border: 2px solid #b8e0c4;
  border-radius: 14px;
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.warn-message {
  color: #8a5b00;
  background: #fff6e0;
  border-left: 3px solid #e0a800;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  margin-top: 10px;
}

.error-message {
  color: #c43030;
  font-size: 0.9rem;
  background: #fdeaea;
  padding: 9px 12px;
  border-radius: 8px;
  border-left: 3px solid #d05050;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-primary,
.btn-secondary {
  padding: 10px 22px;
  border-radius: 100px;
  font-family: TwCen, sans-serif;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;
}

.btn-primary {
  background: #575EAE;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #3e4379;
}

.btn-primary:disabled {
  background: #b5b8d4;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f0f0f0;
  color: #555;
}

.btn-secondary:hover:not(:disabled) {
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
    box-sizing: border-box;
  }

  .meta-grid {
    grid-template-columns: 1fr;
  }
}
</style>