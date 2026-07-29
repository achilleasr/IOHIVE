<template>
  <div class="history">
    <div class="history-body">
      <div v-if="loading" class="state-msg">Loading…</div>
      <div v-else-if="error" class="state-msg error">{{ error }}</div>
      <div v-else-if="items.length === 0" class="state-msg">No inspections recorded yet.</div>

      <div v-else class="entry-list">
        <div v-for="(item, idx) in items" :key="item._id" class="entry">
          <div class="entry-head" @click="toggle(idx)">
            <span class="entry-date">{{ formatDate(item.date) }}</span>
            <span class="entry-total">Total frames: {{ round1(stateOf(item).totalFrames) }}</span>
            <span class="entry-badges">
              <span v-if="item.mutation" class="mini-badge int">Intervention</span>
              <span v-else class="mini-badge obs">Observation only</span>
            </span>
            <img src="../assets/Hives/i_arrow_down.svg" class="chev small" :class="{ rotated180: expanded[idx] }" />
          </div>

          <div v-if="expanded[idx]" class="entry-body">
            <div class="col prev-col" v-if="previousOf(idx)">
              <div class="col-head">
                <span class="col-title">Previous State</span>
                <span class="col-date">{{ formatDate(previousOf(idx).date) }}</span>
              </div>
              <div class="col-total">Total frames: {{ round1(stateOf(previousOf(idx)).totalFrames) }}</div>
              <div class="chip-grid">
                <div v-for="f in frameTypes" :key="f.key" class="chip">
                  <span class="chip-label">{{ f.label }}</span>
                  <span class="chip-val">{{ round1(stateOf(previousOf(idx))[f.key]) }}</span>
                </div>
              </div>
              <div class="meta-lines">
                <span>Population: {{ labelFor(populationOptions, stateOf(previousOf(idx)).population) }}</span>
                <span>Condition: {{ labelFor(impressionOptions, stateOf(previousOf(idx)).impression) }}</span>
                <span>Queen seen: {{ boolLabel(stateOf(previousOf(idx)).queenSeen) }}</span>
              </div>
              <div v-if="tagsOf(previousOf(idx)).length" class="tag-row">
                <span v-for="t in tagsOf(previousOf(idx))" :key="t" class="tag">{{ t }}</span>
              </div>
            </div>

            <div class="current-group">
              <div class="group-label">This inspection</div>
              <div class="group-cols">
                <div class="col obs-col">
                  <div class="col-head">
                    <span class="col-title obs">Observation</span>
                  </div>
                  <div class="col-total">Total frames: {{ round1(item.observedState?.totalFrames) }}</div>
                  <div class="chip-grid">
                    <div v-for="f in frameTypes" :key="f.key" class="chip">
                      <span class="chip-label">{{ f.label }}</span>
                      <span class="chip-val">{{ round1(item.observedState?.[f.key]) }}</span>
                    </div>
                  </div>
                  <div class="meta-lines">
                    <span>Population: {{ labelFor(populationOptions, item.observedState?.population) }}</span>
                    <span>Condition: {{ labelFor(impressionOptions, item.observedState?.impression) }}</span>
                    <span>Queen seen: {{ boolLabel(item.observedState?.queenSeen) }}</span>
                    <span v-if="item.observedState?.needsAttention">Needs attention</span>
                  </div>
                  <div v-if="item.observedState?.notes" class="note-block">
                    {{ item.observedState.notes }}
                  </div>
                </div>

                <div class="col int-col" v-if="item.mutation">
                  <div class="col-head">
                    <span class="col-title int">Intervention</span>
                  </div>
                  <div class="col-total">Total frames: {{ round1(item.resultingState?.totalFrames) }}</div>
                  <div class="chip-grid">
                    <div v-for="f in frameTypes" :key="f.key" class="chip">
                      <span class="chip-label">{{ f.label }}</span>
                      <span class="chip-val">
                        {{ round1(item.resultingState?.[f.key]) }}
                        <span v-if="deltaOf(item, f.key) !== 0"
                          :class="['chip-delta', deltaOf(item, f.key) > 0 ? 'pos' : 'neg']">
                          {{ deltaOf(item, f.key) > 0 ? '+' : '' }}{{ round1(deltaOf(item, f.key)) }}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div v-if="tagsOf(item).length" class="tag-row">
                    <span v-for="t in tagsOf(item)" :key="t" class="tag">{{ t }}</span>
                  </div>
                  <div v-if="item.mutation.notes" class="note-block">
                    {{ item.mutation.notes }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getIohiveHistory } from '@/services/api/iohiveApi';

export default {
  name: 'InspectionHistory',
  props: {
    hive: { type: Object, required: true },
  },
  data() {
    return {
      loading: false,
      error: null,
      items: [],
      expanded: {},
      frameTypes: [
        { key: 'eggs', label: 'Eggs' },
        { key: 'larvae', label: 'Larvae' },
        { key: 'brood', label: 'Capped brood' },
        { key: 'honey', label: 'Honey' },
        { key: 'pollen', label: 'Pollen' },
        { key: 'empty', label: 'Empty' },
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
    };
  },
  mounted() {
    this.load();
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

    stateOf(item) {
      if (!item) return {};
      return item.resultingState || item.observedState || {};
    },

    previousOf(idx) {
      return this.items[idx + 1] || null;
    },

    deltaOf(item, key) {
      const before = item.observedState?.[key] || 0;
      const after = item.resultingState?.[key] || 0;
      return this.round1(after - before);
    },

    tagsOf(item) {
      const m = item?.mutation;
      if (!m) return [];
      const tags = [];
      if (m.fed) tags.push('Fed');
      if (m.queenReplaced) tags.push('Queen changed');
      if (m.treatmentApplied) tags.push(m.treatmentDetails ? `Treatment: ${m.treatmentDetails}` : 'Treatment');
      return tags;
    },

    toggle(idx) {
      this.expanded = { ...this.expanded, [idx]: !this.expanded[idx] };
    },

    async load() {
      this.loading = true;
      this.error = null;
      try {
        const data = await getIohiveHistory(this.hive.id);
        this.items = data?.inspections || [];
      } catch {
        this.error = 'Could not load history. Are the Netlify Functions deployed?';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.history {
  color: #333;
}

.history-head {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
  padding: 4px 0;
}

.history-title {
  font-size: 1.05rem;
  color: #575EAE;
  font-weight: bold;
}

.count {
  background: #e0e3f8;
  color: #575EAE;
  border-radius: 100px;
  padding: 1px 10px;
  font-size: 0.78rem;
  font-weight: bold;
}

.chev {
  height: 1.4vw;
  min-height: 14px;
  transition: transform 0.15s ease;
}

.chev.small {
  height: 1.1vw;
  min-height: 12px;
  margin-left: auto;
}

.rotated180 {
  transform: rotate(180deg);
}

.history-body {
  margin-top: 10px;
}

.state-msg {
  font-size: 0.9rem;
  color: #999;
  padding: 10px 0;
}

.state-msg.error {
  color: #c43030;
}

.entry-list {
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

.entry-date {
  font-size: 0.92rem;
  font-weight: bold;
  color: #333;
}

.entry-total {
  font-size: 0.85rem;
  color: #777;
}

.mini-badge {
  border-radius: 100px;
  padding: 2px 10px;
  font-size: 0.72rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.mini-badge.obs {
  background: #e0e3f8;
  color: #575EAE;
}

.mini-badge.int {
  background: #fde8e8;
  color: #a32020;
}

.entry-body {
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  align-items: stretch;
}

.col {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.prev-col {
  background: #f6f7fc;
  border: 1px solid #dcdff0;
  border-radius: 12px;
  padding: 12px 14px;
  max-width: 32%;
}

.current-group {
  flex: 2;
  min-width: 0;
  border: 2px solid #cfd3ee;
  border-radius: 12px;
  padding: 10px 12px 12px;
  background: white;
}

.group-label {
  font-size: 0.72rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #575EAE;
  margin-bottom: 8px;
}

.group-cols {
  display: flex;
  gap: 10px;
  align-items: stretch;
}

.obs-col {
  border-right: 1px dashed #dcdff0;
  padding-right: 10px;
}

.int-col {
  padding-left: 2px;
}

.col-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.col-title {
  font-size: 0.85rem;
  font-weight: bold;
  color: #575EAE;
}

.col-title.obs {
  color: #575EAE;
}

.col-title.int {
  color: #a32020;
}

.col-date {
  font-size: 0.75rem;
  color: #aaa;
}

.col-total {
  font-size: 0.82rem;
  color: #666;
}

.chip-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.chip {
  background: #fbfbfe;
  border: 1px solid #eceef8;
  border-radius: 8px;
  padding: 5px 7px;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.chip-label {
  font-size: 0.65rem;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.chip-val {
  font-size: 0.95rem;
  color: #333;
  font-weight: bold;
}

.chip-delta {
  font-size: 0.7rem;
  margin-left: 3px;
}

.chip-delta.pos {
  color: #2a7a40;
}

.chip-delta.neg {
  color: #a32020;
}

.meta-lines {
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: 0.8rem;
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
  font-size: 0.82rem;
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

  .prev-col {
    max-width: none;
  }

  .group-cols {
    flex-direction: column;
  }

  .obs-col {
    border-right: none;
    border-bottom: 1px dashed #dcdff0;
    padding-right: 0;
    padding-bottom: 10px;
  }
}
</style>