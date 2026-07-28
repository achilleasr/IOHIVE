<template>
  <div class="history-header">
    <h2 class="title clickable" @click="toggleExpanded">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="imgicon"
        :class="{ rotated180: expanded }" viewBox="0 0 16 16">
        <path fill-rule="evenodd"
          d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
      </svg>
      <span>Inspection History</span>
      <span v-if="!expanded && list.length" class="count-badge">{{ list.length }}</span>
    </h2>
    <button v-if="expanded" class="refresh-btn" @click="load" :disabled="loading">↻</button>
  </div>

  <div v-if="expanded" class="history-content">
    <div v-if="loading" class="state-msg">Loading…</div>
    <div v-else-if="error" class="state-msg error">{{ error }}</div>
    <div v-else-if="list.length === 0" class="state-msg">No inspections recorded yet.</div>
    <div v-else class="timeline">
      <div v-for="(item, idx) in list" :key="item._id || idx" class="timeline-entry" @click="toggleItem(idx)">
        <div class="entry-header">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" class="row-chevron"
            :class="{ rotated180: openItems[idx] }" viewBox="0 0 16 16">
            <path fill-rule="evenodd"
              d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
          </svg>
          <span class="entry-date">{{ formatDate(item.date) }}</span>
          <div class="entry-chips">
            <span v-if="item.observedState?.impression" class="chip"
              :class="impressionClass(item.observedState.impression)">
              {{ impressionLabel(item.observedState.impression) }}
            </span>
            <span v-if="item.mutation" class="chip chip-mutation">Mutation</span>
            <span v-else class="chip chip-obs">Observation only</span>
            <span v-if="item.observedState?.needsAttention" class="chip chip-red">⚠ Attention</span>
          </div>
        </div>

        <div v-if="openItems[idx]" class="entry-detail" @click.stop>
          <div class="detail-columns">
            <div class="detail-col">
              <div class="col-header obs-header">Observed (step 1)</div>
              <div class="data-rows">
                <div class="data-row" v-for="field in observedFields" :key="field.key">
                  <span class="data-label">{{ field.label }}</span>
                  <span class="data-val" :class="diffClass(item, field.key, idx)">
                    {{ formatFieldVal(item.observedState?.[field.key], field.key) }}
                  </span>
                </div>
                <div v-if="item.observedState?.notes" class="notes-row">
                  <span class="data-label">Notes</span>
                  <span class="data-val">{{ item.observedState.notes }}</span>
                </div>
              </div>
            </div>

            <div class="detail-col" v-if="item.mutation">
              <div class="col-header mut-header">Mutation (step 2)</div>
              <div class="data-rows">
                <template v-for="row in mutationFrameRows(item.mutation)" :key="row.label">
                  <div class="data-row">
                    <span class="data-label">{{ row.label }}</span>
                    <span :class="['data-val', row.delta > 0 ? 'pos' : 'neg']">
                      {{ row.delta > 0 ? '+' : '' }}{{ row.delta }}
                    </span>
                  </div>
                </template>
                <div v-if="item.mutation.feeding" class="data-row">
                  <span class="data-label">Feeding</span>
                  <span class="data-val">{{ item.mutation.feeding }} {{ item.mutation.feedAmount || '' }}</span>
                </div>
                <div v-if="item.mutation.treatmentApplied" class="data-row">
                  <span class="data-label">Treatment</span>
                  <span class="data-val">{{ item.mutation.treatmentDetails || 'Yes' }}</span>
                </div>
                <div v-if="item.mutation.queenReplaced" class="data-row">
                  <span class="data-label">Queen</span>
                  <span class="data-val">Replaced</span>
                </div>
                <div v-if="item.mutation.notes" class="notes-row">
                  <span class="data-label">Notes</span>
                  <span class="data-val">{{ item.mutation.notes }}</span>
                </div>
              </div>
            </div>

            <div class="detail-col" v-if="item.mutation">
              <div class="col-header res-header">Result</div>
              <div class="data-rows">
                <div class="data-row" v-for="field in observedFields" :key="field.key">
                  <span class="data-label">{{ field.label }}</span>
                  <span class="data-val" :class="resultDiffClass(item, field.key)">
                    {{ formatFieldVal(item.resultingState?.[field.key], field.key) }}
                  </span>
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
  props: { hive: Object },
  data() {
    return {
      expanded: false,
      loading: false,
      error: null,
      list: [],
      openItems: {},
      observedFields: [
        { key: 'population', label: 'Population' },
        { key: 'totalFrames', label: 'Total frames' },
        { key: 'broodEggs', label: 'Brood (eggs)' },
        { key: 'broodLarvae', label: 'Brood (larvae)' },
        { key: 'broodCapped', label: 'Brood (capped)' },
        { key: 'honeyFrames', label: 'Honey frames' },
        { key: 'pollenFrames', label: 'Pollen frames' },
        { key: 'queenSeen', label: 'Queen seen' },
        { key: 'impression', label: 'Impression' },
        { key: 'needsAttention', label: 'Needs attention' },
      ],
    };
  },
  methods: {
    async toggleExpanded() {
      this.expanded = !this.expanded;
      if (this.expanded && this.list.length === 0) await this.load();
    },
    async load() {
      if (!this.hive?.id) return;
      this.loading = true;
      this.error = null;
      try {
        const data = await getIohiveHistory(this.hive.id);
        this.list = data?.inspections || [];
      } catch (err) {
        this.error = 'Could not load history. Are the Netlify Functions deployed?';
      } finally {
        this.loading = false;
      }
    },
    mutationFrameRows(m) {
      const types = [
        { label: 'Brood (eggs)', addKey: 'broodEggsAdded', removeKey: 'broodEggsRemoved' },
        { label: 'Brood (larvae)', addKey: 'broodLarvaeAdded', removeKey: 'broodLarvaeRemoved' },
        { label: 'Brood (capped)', addKey: 'broodCappedAdded', removeKey: 'broodCappedRemoved' },
        { label: 'Honey frames', addKey: 'honeyFramesAdded', removeKey: 'honeyFramesRemoved' },
        { label: 'Pollen frames', addKey: 'pollenFramesAdded', removeKey: 'pollenFramesRemoved' },
        { label: 'Empty frames', addKey: 'emptyFramesAdded', removeKey: 'emptyFramesRemoved' },
      ];
      return types
        .map(t => ({ label: t.label, delta: (m[t.addKey] || 0) - (m[t.removeKey] || 0) }))
        .filter(r => r.delta !== 0);
    },
    toggleItem(idx) {
      this.openItems = { ...this.openItems, [idx]: !this.openItems[idx] };
    },
    formatDate(val) {
      if (!val) return '';
      return new Date(val).toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: 'numeric', minute: 'numeric', hour12: true,
      });
    },
    formatFieldVal(val, key) {
      if (val == null) return '—';
      if (key === 'queenSeen') return val ? 'Yes' : 'No';
      if (key === 'needsAttention') return val ? 'Yes' : 'No';
      if (key === 'population') return val === 3 ? 'Strong' : val === 2 ? 'Medium' : val === 1 ? 'Weak' : '—';
      if (key === 'impression') return val === 3 ? '😊 Good' : val === 2 ? '😐 Ok' : val === 1 ? '😞 Bad' : '—';
      return val;
    },
    impressionLabel(val) {
      return val === 3 ? '😊 Good' : val === 2 ? '😐 Ok' : '😞 Bad';
    },
    impressionClass(val) {
      return val === 3 ? 'chip-green' : val === 2 ? 'chip-yellow' : 'chip-red';
    },
    diffClass(item, key, idx) {
      const prev = this.list[idx + 1];
      if (!prev) return '';
      const prevSrc = prev.resultingState || prev.observedState;
      if (!prevSrc) return '';
      const cur = item.observedState?.[key];
      const old = prevSrc[key];
      if (cur == null || old == null) return '';
      if (typeof cur === 'number' && cur !== old) return cur > old ? 'changed-pos' : 'changed-neg';
      if (cur !== old) return 'changed';
      return '';
    },
    resultDiffClass(item, key) {
      const obs = item.observedState?.[key];
      const res = item.resultingState?.[key];
      if (obs == null || res == null) return '';
      if (obs !== res) return 'changed-pos';
      return '';
    },
  },
};
</script>

<style scoped>
.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  user-select: none;
}

.imgicon {
  fill: rgb(190, 190, 190);
  stroke: rgb(190, 190, 190);
  transition: transform 0.15s ease;
}

.rotated180 {
  transform: rotate(180deg);
}

.count-badge {
  background: #575EAE;
  color: white;
  border-radius: 100px;
  font-size: 0.75rem;
  padding: 1px 8px;
  margin-left: 4px;
}

.refresh-btn {
  background: none;
  border: 1px solid #ddd;
  border-radius: 100px;
  padding: 4px 12px;
  cursor: pointer;
  font-size: 1rem;
  color: #888;
}

.refresh-btn:hover:not(:disabled) {
  color: #575EAE;
  border-color: #575EAE;
}

.history-content {
  margin-top: 8px;
}

.state-msg {
  color: #bbb;
  font-size: 0.95rem;
  padding: 8px 0;
}

.state-msg.error {
  color: #c43030;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.timeline-entry {
  background: #f8f8fe;
  border-radius: 10px;
  overflow: hidden;
  transition: box-shadow 0.15s;
  cursor: pointer;
}

.timeline-entry:hover {
  box-shadow: 0 2px 8px #575eae18;
}

.entry-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  flex-wrap: wrap;
}

.row-chevron {
  fill: #aaa;
  flex-shrink: 0;
  transition: transform 0.15s ease;
}

.entry-date {
  font-size: 0.85rem;
  color: #777;
  white-space: nowrap;
}

.entry-chips {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-left: 4px;
}

.chip {
  padding: 2px 10px;
  border-radius: 100px;
  font-size: 0.78rem;
}

.chip-green {
  background: #d4f0dc;
  color: #2a7a40;
}

.chip-yellow {
  background: #fdf3cc;
  color: #7a6000;
}

.chip-red {
  background: #fde8e8;
  color: #a32020;
}

.chip-mutation {
  background: #fde8e8;
  color: #a32020;
}

.chip-obs {
  background: #e0e3f8;
  color: #575EAE;
}

.entry-detail {
  background: white;
  border-top: 1px solid #eee;
  padding: 14px 16px;
  cursor: default;
}

.detail-columns {
  display: flex;
  gap: 16px;
}

.detail-col {
  flex: 1;
  min-width: 0;
}

.col-header {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: bold;
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid #e3e4f3;
}

.obs-header {
  color: #575EAE;
}

.mut-header {
  color: #a32020;
}

.res-header {
  color: #2a7a40;
}

.data-rows {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.data-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
  padding: 2px 0;
}

.data-label {
  color: #888;
}

.data-val {
  color: #333;
  font-weight: 500;
  text-align: right;
}

.data-val.pos,
.data-val.changed-pos {
  color: #2a7a40;
}

.data-val.neg,
.data-val.changed-neg {
  color: #a32020;
}

.data-val.changed {
  color: #575EAE;
}

.notes-row {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.82rem;
  margin-top: 4px;
  padding-top: 4px;
  border-top: 1px dashed #eee;
}

.notes-row .data-label {
  font-size: 0.75rem;
}

.notes-row .data-val {
  font-weight: normal;
  text-align: left;
}

@media (max-width: 700px) {
  .detail-columns {
    flex-direction: column;
  }
}
</style>