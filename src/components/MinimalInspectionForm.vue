<template>
  <form class="inspection-form" @submit.prevent="submit">
    <div class="form-row form-row-datetime">
      <label>Date</label>
      <input v-model="dateOnly" type="date" :disabled="submitting" />
      <label>Time</label>
      <input v-model="timeOnly" type="time" :disabled="submitting" />
    </div>

    <div class="step-section">
      <div class="step-header">
        <span class="step-badge obs">Step 1</span>
        <span class="step-title">Observation</span>
      </div>
      <p class="step-desc">
        Record what you see when you open the hive.
        <span v-if="prefilled" class="prefill-note">Pre-filled from your last inspection.</span>
      </p>

      <div class="field-grid">
        <div class="field">
          <label>Population</label>
          <div class="choice-row">
            <button v-for="opt in populationOptions" :key="opt.value" type="button"
              :class="['choice-btn', observed.population === opt.value ? 'selected' : '']"
              @click="observed.population = observed.population === opt.value ? null : opt.value"
              :disabled="submitting">{{ opt.label }}</button>
          </div>
        </div>

        <div class="field">
          <label>Total frames</label>
          <input v-model.number="observed.totalFrames" type="number" min="0" max="30" step="0.5" :disabled="submitting"
            placeholder="0" />
        </div>

        <div class="field">
          <label>Brood frames (eggs)</label>
          <input v-model.number="observed.broodEggs" type="number" min="0" max="30" step="0.5" :disabled="submitting"
            placeholder="0" />
        </div>

        <div class="field">
          <label>Brood frames (larvae)</label>
          <input v-model.number="observed.broodLarvae" type="number" min="0" max="30" step="0.5" :disabled="submitting"
            placeholder="0" />
        </div>

        <div class="field">
          <label>Brood frames (capped)</label>
          <input v-model.number="observed.broodCapped" type="number" min="0" max="30" step="0.5" :disabled="submitting"
            placeholder="0" />
        </div>

        <div class="field">
          <label>Honey frames</label>
          <input v-model.number="observed.honeyFrames" type="number" min="0" max="30" step="0.5" :disabled="submitting"
            placeholder="0" />
        </div>

        <div class="field">
          <label>Pollen frames</label>
          <input v-model.number="observed.pollenFrames" type="number" min="0" max="30" step="0.5" :disabled="submitting"
            placeholder="0" />
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
          <label>Overall impression</label>
          <div class="choice-row">
            <button v-for="opt in impressionOptions" :key="opt.value" type="button"
              :class="['choice-btn', observed.impression === opt.value ? 'selected' : '']"
              @click="observed.impression = observed.impression === opt.value ? null : opt.value"
              :disabled="submitting">{{ opt.label }}</button>
          </div>
        </div>

        <div class="field">
          <label>Needs attention</label>
          <div class="choice-row">
            <button type="button"
              :class="['choice-btn danger', observed.needsAttention === true ? 'selected-danger' : '']"
              @click="observed.needsAttention = observed.needsAttention === true ? null : true"
              :disabled="submitting">Yes</button>
            <button type="button" :class="['choice-btn', observed.needsAttention === false ? 'selected' : '']"
              @click="observed.needsAttention = observed.needsAttention === false ? null : false"
              :disabled="submitting">No</button>
          </div>
        </div>

        <div class="field field-wide">
          <label>Notes</label>
          <textarea v-model="observed.notes" rows="2" :disabled="submitting"
            placeholder="What did you observe?"></textarea>
        </div>
      </div>
    </div>

    <div class="step-section">
      <div class="step-header">
        <span class="step-badge mut">Step 2</span>
        <span class="step-title">Mutation</span>
        <button type="button" class="toggle-mutation" @click="hasMutation = !hasMutation" :disabled="submitting">
          {{ hasMutation ? 'Skip this step' : 'I made changes to the hive' }}
        </button>
      </div>
      <p class="step-desc">Did you add/remove specific frame types, feed, treat, or replace the queen? If not, skip.</p>

      <div v-if="hasMutation" class="field-grid">
        <div class="field col-header-label field-wide">
          <span class="section-label">Frames added</span>
        </div>

        <div class="field">
          <label>Brood frames added (eggs)</label>
          <input v-model.number="mutation.broodEggsAdded" type="number" min="0" max="20" step="0.5"
            :disabled="submitting" placeholder="0" />
        </div>

        <div class="field">
          <label>Brood frames added (larvae)</label>
          <input v-model.number="mutation.broodLarvaeAdded" type="number" min="0" max="20" step="0.5"
            :disabled="submitting" placeholder="0" />
        </div>

        <div class="field">
          <label>Brood frames added (capped)</label>
          <input v-model.number="mutation.broodCappedAdded" type="number" min="0" max="20" step="0.5"
            :disabled="submitting" placeholder="0" />
        </div>

        <div class="field">
          <label>Honey frames added</label>
          <input v-model.number="mutation.honeyFramesAdded" type="number" min="0" max="20" step="0.5"
            :disabled="submitting" placeholder="0" />
        </div>

        <div class="field">
          <label>Pollen frames added</label>
          <input v-model.number="mutation.pollenFramesAdded" type="number" min="0" max="20" step="0.5"
            :disabled="submitting" placeholder="0" />
        </div>

        <div class="field">
          <label>Empty frames added</label>
          <input v-model.number="mutation.emptyFramesAdded" type="number" min="0" max="20" step="0.5"
            :disabled="submitting" placeholder="0" />
        </div>

        <div class="field col-header-label field-wide">
          <span class="section-label">Frames removed</span>
        </div>

        <div class="field">
          <label>Brood frames removed (eggs)</label>
          <input v-model.number="mutation.broodEggsRemoved" type="number" min="0" max="20" step="0.5"
            :disabled="submitting" placeholder="0" />
        </div>

        <div class="field">
          <label>Brood frames removed (larvae)</label>
          <input v-model.number="mutation.broodLarvaeRemoved" type="number" min="0" max="20" step="0.5"
            :disabled="submitting" placeholder="0" />
        </div>

        <div class="field">
          <label>Brood frames removed (capped)</label>
          <input v-model.number="mutation.broodCappedRemoved" type="number" min="0" max="20" step="0.5"
            :disabled="submitting" placeholder="0" />
        </div>

        <div class="field">
          <label>Honey frames removed</label>
          <input v-model.number="mutation.honeyFramesRemoved" type="number" min="0" max="20" step="0.5"
            :disabled="submitting" placeholder="0" />
        </div>

        <div class="field">
          <label>Pollen frames removed</label>
          <input v-model.number="mutation.pollenFramesRemoved" type="number" min="0" max="20" step="0.5"
            :disabled="submitting" placeholder="0" />
        </div>

        <div class="field">
          <label>Empty frames removed</label>
          <input v-model.number="mutation.emptyFramesRemoved" type="number" min="0" max="20" step="0.5"
            :disabled="submitting" placeholder="0" />
        </div>

        <div class="field col-header-label field-wide">
          <span class="section-label">Other interventions</span>
        </div>

        <div class="field">
          <label>Feeding</label>
          <div class="choice-row">
            <button v-for="opt in feedingOptions" :key="opt" type="button"
              :class="['choice-btn', mutation.feeding === opt ? 'selected' : '']"
              @click="mutation.feeding = mutation.feeding === opt ? null : opt" :disabled="submitting">{{ opt
              }}</button>
          </div>
        </div>

        <div class="field">
          <label>Feed amount</label>
          <input v-model="mutation.feedAmount" type="text" :disabled="submitting || !mutation.feeding"
            placeholder="e.g. 500ml syrup" />
        </div>

        <div class="field">
          <label>Treatment applied</label>
          <div class="choice-row">
            <button type="button" :class="['choice-btn', mutation.treatmentApplied === true ? 'selected' : '']"
              @click="mutation.treatmentApplied = mutation.treatmentApplied === true ? null : true"
              :disabled="submitting">Yes</button>
            <button type="button" :class="['choice-btn', mutation.treatmentApplied === false ? 'selected' : '']"
              @click="mutation.treatmentApplied = mutation.treatmentApplied === false ? null : false"
              :disabled="submitting">No</button>
          </div>
        </div>

        <div class="field">
          <label>Treatment details</label>
          <input v-model="mutation.treatmentDetails" type="text" :disabled="submitting || !mutation.treatmentApplied"
            placeholder="e.g. Oxalic acid" />
        </div>

        <div class="field">
          <label>Queen replaced</label>
          <div class="choice-row">
            <button type="button" :class="['choice-btn', mutation.queenReplaced === true ? 'selected' : '']"
              @click="mutation.queenReplaced = mutation.queenReplaced === true ? null : true"
              :disabled="submitting">Yes</button>
            <button type="button" :class="['choice-btn', mutation.queenReplaced === false ? 'selected' : '']"
              @click="mutation.queenReplaced = mutation.queenReplaced === false ? null : false"
              :disabled="submitting">No</button>
          </div>
        </div>

        <div class="field field-wide">
          <label>Mutation notes</label>
          <textarea v-model="mutation.notes" rows="2" :disabled="submitting"
            placeholder="What changes did you make?"></textarea>
        </div>
      </div>
    </div>

    <div class="result-preview" v-if="hasMutation && hasAnyMutationData">
      <div class="step-header">
        <span class="step-badge res">Result</span>
        <span class="step-title">Resulting state</span>
      </div>
      <div class="result-grid">
        <div class="result-item" v-if="resultingState.totalFrames !== observed.totalFrames">
          <span class="result-label">Total frames</span>
          <span class="result-val">
            {{ observed.totalFrames || 0 }}
            <span class="result-delta"
              :class="(resultingState.totalFrames - (observed.totalFrames || 0)) > 0 ? 'pos' : 'neg'">
              {{ (resultingState.totalFrames - (observed.totalFrames || 0)) > 0 ? '+' : '' }}{{
                (resultingState.totalFrames - (observed.totalFrames || 0)).toFixed(1) }}
            </span>
            → {{ resultingState.totalFrames }}
          </span>
        </div>
        <div class="result-item" v-if="resultingState.broodEggs !== observed.broodEggs">
          <span class="result-label">Brood (eggs)</span>
          <span class="result-val">{{ observed.broodEggs || 0 }} → {{ resultingState.broodEggs }}</span>
        </div>
        <div class="result-item" v-if="resultingState.broodLarvae !== observed.broodLarvae">
          <span class="result-label">Brood (larvae)</span>
          <span class="result-val">{{ observed.broodLarvae || 0 }} → {{ resultingState.broodLarvae }}</span>
        </div>
        <div class="result-item" v-if="resultingState.broodCapped !== observed.broodCapped">
          <span class="result-label">Brood (capped)</span>
          <span class="result-val">{{ observed.broodCapped || 0 }} → {{ resultingState.broodCapped }}</span>
        </div>
        <div class="result-item" v-if="resultingState.honeyFrames !== observed.honeyFrames">
          <span class="result-label">Honey frames</span>
          <span class="result-val">{{ observed.honeyFrames || 0 }} → {{ resultingState.honeyFrames }}</span>
        </div>
        <div class="result-item" v-if="resultingState.pollenFrames !== observed.pollenFrames">
          <span class="result-label">Pollen frames</span>
          <span class="result-val">{{ observed.pollenFrames || 0 }} → {{ resultingState.pollenFrames }}</span>
        </div>
        <div class="result-item" v-if="mutation.feeding">
          <span class="result-label">Fed</span>
          <span class="result-val">{{ mutation.feeding }} {{ mutation.feedAmount || '' }}</span>
        </div>
        <div class="result-item" v-if="mutation.treatmentApplied">
          <span class="result-label">Treatment</span>
          <span class="result-val">{{ mutation.treatmentDetails || 'Yes' }}</span>
        </div>
        <div class="result-item" v-if="mutation.queenReplaced">
          <span class="result-label">Queen</span>
          <span class="result-val">Replaced</span>
        </div>
      </div>
    </div>

    <div v-if="error" class="error-message">{{ error }}</div>

    <div class="form-actions">
      <button type="button" class="btn-secondary" @click="$emit('cancel')" :disabled="submitting">Cancel</button>
      <button type="submit" class="btn-primary" :disabled="submitting">
        {{ submitting ? 'Saving…' : 'Save Inspection' }}
      </button>
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
      prefilled: false,
      dateOnly: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
      timeOnly: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
      hasMutation: false,
      observed: {
        population: null,
        totalFrames: null,
        broodEggs: null,
        broodLarvae: null,
        broodCapped: null,
        honeyFrames: null,
        pollenFrames: null,
        queenSeen: null,
        impression: null,
        needsAttention: null,
        notes: '',
      },
      mutation: {
        broodEggsAdded: null,
        broodLarvaeAdded: null,
        broodCappedAdded: null,
        honeyFramesAdded: null,
        pollenFramesAdded: null,
        emptyFramesAdded: null,
        broodEggsRemoved: null,
        broodLarvaeRemoved: null,
        broodCappedRemoved: null,
        honeyFramesRemoved: null,
        pollenFramesRemoved: null,
        emptyFramesRemoved: null,
        feeding: null,
        feedAmount: '',
        treatmentApplied: null,
        treatmentDetails: '',
        queenReplaced: null,
        notes: '',
      },
      populationOptions: [
        { value: 1, label: 'Weak' },
        { value: 2, label: 'Medium' },
        { value: 3, label: 'Strong' },
      ],
      impressionOptions: [
        { value: 1, label: '😞 Bad' },
        { value: 2, label: '😐 Ok' },
        { value: 3, label: '😊 Good' },
      ],
      feedingOptions: ['Syrup', 'Fondant', 'Pollen patty', 'Other'],
    };
  },
  computed: {
    ...mapState(['defaultChecklist']),

    hasAnyMutationData() {
      const m = this.mutation;
      return (
        m.broodEggsAdded || m.broodLarvaeAdded || m.broodCappedAdded ||
        m.honeyFramesAdded || m.pollenFramesAdded || m.emptyFramesAdded ||
        m.broodEggsRemoved || m.broodLarvaeRemoved || m.broodCappedRemoved ||
        m.honeyFramesRemoved || m.pollenFramesRemoved || m.emptyFramesRemoved ||
        m.feeding || m.treatmentApplied || m.queenReplaced
      );
    },

    resultingState() {
      const base = { ...this.observed };
      if (!this.hasMutation) return base;
      const m = this.mutation;

      const add = (field, addKey, removeKey) => {
        const cur = base[field] || 0;
        const added = m[addKey] || 0;
        const removed = m[removeKey] || 0;
        base[field] = Math.max(0, cur + added - removed);
      };

      add('broodEggs', 'broodEggsAdded', 'broodEggsRemoved');
      add('broodLarvae', 'broodLarvaeAdded', 'broodLarvaeRemoved');
      add('broodCapped', 'broodCappedAdded', 'broodCappedRemoved');
      add('honeyFrames', 'honeyFramesAdded', 'honeyFramesRemoved');
      add('pollenFrames', 'pollenFramesAdded', 'pollenFramesRemoved');

      base.totalFrames = (
        (base.broodEggs || 0) +
        (base.broodLarvae || 0) +
        (base.broodCapped || 0) +
        (base.honeyFrames || 0) +
        (base.pollenFrames || 0) +
        (m.emptyFramesAdded || 0) -
        (m.emptyFramesRemoved || 0)
      );

      if (m.queenReplaced) base.queenSeen = true;
      return base;
    },
  },
  async created() {
    await this.$store.dispatch('loadChecklists');
    await this.prefillFromLastInspection();
  },
  methods: {
    async prefillFromLastInspection() {
      try {
        const data = await getIohiveHistory(this.hive.id);
        const list = data?.inspections || [];
        if (list.length === 0) return;
        const last = list[0];
        const src = last.resultingState || last.observedState;
        if (!src) return;
        this.observed.population = src.population ?? null;
        this.observed.totalFrames = src.totalFrames ?? null;
        this.observed.broodEggs = src.broodEggs ?? null;
        this.observed.broodLarvae = src.broodLarvae ?? null;
        this.observed.broodCapped = src.broodCapped ?? null;
        this.observed.honeyFrames = src.honeyFrames ?? null;
        this.observed.pollenFrames = src.pollenFrames ?? null;
        this.observed.queenSeen = src.queenSeen ?? null;
        this.observed.impression = null;
        this.observed.needsAttention = null;
        this.observed.notes = '';
        this.prefilled = true;
      } catch {
        // no previous inspection or functions not deployed yet
      }
    },

    buildBeepPayload() {
      const pad = (n) => String(n).padStart(2, '0');
      const time = this.timeOnly || '00:00';
      const d = this.dateOnly ? new Date(`${this.dateOnly}T${time}:00`) : new Date();
      const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
      const rs = this.resultingState;

      const items = {};

      // Bee colony > Size > Frames with bees (774) — use population as proxy
      // population stays MongoDB-only; no direct BEEP equivalent at score 1/2/3

      // Space > Unoccupied frames > Bee colony > Brood frames (80) — total brood frame count
      const totalBrood = (rs.broodEggs || 0) + (rs.broodLarvae || 0) + (rs.broodCapped || 0);
      if (totalBrood > 0) items[264] = totalBrood; // Bee colony > Brood > Frames with brood

      // Brood stage presence booleans
      if (rs.broodEggs != null) items[270] = rs.broodEggs > 0 ? 1 : 0;   // Eggs presence
      if (rs.broodLarvae != null) items[276] = rs.broodLarvae > 0 ? 1 : 0; // Larvae presence
      if (rs.broodCapped != null) items[273] = rs.broodCapped > 0 ? 1 : 0; // Pupae presence

      // Brood frame amounts (dm2 field, but frame count works in practice)
      if (rs.broodEggs != null && rs.broodEggs > 0) items[870] = rs.broodEggs;
      if (rs.broodLarvae != null && rs.broodLarvae > 0) items[871] = rs.broodLarvae;
      if (rs.broodCapped != null && rs.broodCapped > 0) items[872] = rs.broodCapped;

      // Food > Stock > Honey > Number of frames (494)
      if (rs.honeyFrames != null) items[494] = rs.honeyFrames;
      // Food > Stock > Pollen > Number of frames (900)
      if (rs.pollenFrames != null) items[900] = rs.pollenFrames;

      // Bee colony > Queen > Presence (399)
      if (rs.queenSeen != null) items[399] = rs.queenSeen ? 1 : 0;

      // Queen replacement
      if (this.hasMutation && this.mutation.queenReplaced) {
        items[429] = 1; // Bee colony > Queen > Introduction (boolean)
      }

      // Feeding
      if (this.hasMutation && this.mutation.feeding) {
        items[832] = 1; // Food > Feeding > Amount (volume) presence — just mark as fed
      }

      // Treatment
      if (this.hasMutation && this.mutation.treatmentApplied) {
        items[595] = 1; // Disorder > Varroa > Treatment (boolean)
      }

      const payload = {
        date,
        checklist_id: this.defaultChecklist?.id ?? null,
        hive_ids: [this.hive.id],
        items,
      };

      if (rs.impression != null) payload.impression = rs.impression;
      if (rs.needsAttention != null) payload.attention = rs.needsAttention ? 1 : 0;
      if (rs.notes) payload.notes = rs.notes;

      return payload;
    },

    async submit() {
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
          observedState: { ...this.observed },
          mutation: this.hasMutation ? { ...this.mutation } : null,
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
.inspection-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-row-datetime {
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-row-datetime label {
  font-size: 0.85rem;
  color: #666;
}

.form-row-datetime input {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 7px 10px;
  font-family: TwCen, sans-serif;
  font-size: 0.95rem;
  background: #F9FAFE;
  color: #333;
}

.step-section {
  border: 1px solid #e3e4f3;
  border-radius: 14px;
  padding: 18px 20px;
}

.step-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.step-badge {
  padding: 3px 12px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.step-badge.obs {
  background: #e0e3f8;
  color: #575EAE;
}

.step-badge.mut {
  background: #fde8e8;
  color: #a32020;
}

.step-badge.res {
  background: #d4f0dc;
  color: #2a7a40;
}

.step-title {
  font-size: 1.05rem;
  font-weight: bold;
  color: #333;
}

.step-desc {
  font-size: 0.85rem;
  color: #888;
  margin: 0 0 14px;
}

.prefill-note {
  color: #575EAE;
  font-weight: bold;
}

.toggle-mutation {
  margin-left: auto;
  background: #f5f6ff;
  border: 1px solid #575EAE;
  border-radius: 100px;
  color: #575EAE;
  padding: 5px 14px;
  font-family: TwCen, sans-serif;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s;
}

.toggle-mutation:hover:not(:disabled) {
  background: #575EAE;
  color: white;
}

.section-label {
  font-size: 0.78rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #a32020;
  padding-bottom: 4px;
  border-bottom: 1px solid #fde8e8;
  display: block;
  width: 100%;
}

.field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-wide {
  grid-column: 1 / -1;
}

.col-header-label {
  margin-top: 6px;
}

.field label {
  font-size: 0.85rem;
  color: #666;
  font-family: TwCen, sans-serif;
}

.field input[type="number"],
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
  box-shadow: 0 0 0 3px rgba(87, 94, 174, 0.15);
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

.result-preview {
  background: #f0faf3;
  border: 1px solid #b8e0c4;
  border-radius: 14px;
  padding: 16px 20px;
}

.result-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
  margin-top: 10px;
}

.result-item {
  display: flex;
  gap: 8px;
  font-size: 0.9rem;
  align-items: baseline;
}

.result-label {
  color: #2a7a40;
  font-weight: bold;
}

.result-val {
  color: #333;
}

.result-delta {
  font-weight: bold;
  font-size: 0.8rem;
}

.result-delta.pos {
  color: #2a7a40;
}

.result-delta.neg {
  color: #a32020;
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
  margin-top: 4px;
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

@media (max-width: 560px) {
  .field-grid {
    grid-template-columns: 1fr;
  }
}
</style>