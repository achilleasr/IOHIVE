<template>
  <form class="add-form" @submit.prevent="submit">
    <!-- Checklist picker -->
    <div class="form-row">
      <label>Checklist</label>
      <div v-if="checklistsLoading" class="muted">Loading checklists…</div>
      <select v-else v-model="selectedChecklistId" class="checklist-select" :disabled="submitting"
        @change="onChecklistChange">
        <option v-for="cl in checklists" :key="cl.id" :value="cl.id">{{ cl.name }}</option>
      </select>
    </div>

    <!-- Hive selector (only for bulk / apiary inspections) -->
    <div v-if="selectableHives.length > 1" class="form-row">
      <label>Hives in this inspection ({{ selectedHiveIds.length }}/{{ selectableHives.length }})</label>
      <div class="hive-chips">
        <button type="button" class="hive-chip-all" @click="toggleAll" :disabled="submitting">
          {{ allSelected ? 'Clear all' : 'Select all' }}
        </button>
        <button v-for="h in selectableHives" :key="h.id" type="button"
          :class="['hive-chip', selectedHiveIds.includes(h.id) ? 'on' : '']" @click="toggleHive(h.id)"
          :disabled="submitting">
          {{ h.name }}
        </button>
      </div>
    </div>

    <!-- Date / time -->
    <div class="form-row form-row-datetime">
      <label>Date</label>
      <input v-model="dateOnly" type="date" :disabled="submitting" />
      <label>Time</label>
      <input v-model="timeOnly" type="time" :disabled="submitting" />
    </div>

    <!-- General inspection fields (always present, posted at top level) -->
    <div class="section">
      <div class="form-section-label">General</div>
      <div class="section-grid">
        <div class="gen-field">
          <label class="gen-label">Overall impression</label>
          <div class="choice-row">
            <button v-for="opt in impressionOptions" :key="opt.value" type="button"
              :class="['choice-btn', general.impression === opt.value ? 'selected' : '']"
              @click="general.impression = general.impression === opt.value ? null : opt.value"
              :disabled="submitting">{{ opt.label }}</button>
          </div>
        </div>

        <div class="gen-field">
          <label class="gen-label">Needs attention</label>
          <div class="choice-row">
            <button type="button" :class="['choice-btn danger', general.attention === 1 ? 'selected-danger' : '']"
              @click="general.attention = general.attention === 1 ? null : 1" :disabled="submitting">Yes</button>
            <button type="button" :class="['choice-btn', general.attention === 0 ? 'selected' : '']"
              @click="general.attention = general.attention === 0 ? null : 0" :disabled="submitting">No</button>
          </div>
        </div>

        <div class="gen-field gen-field-wide">
          <label class="gen-label">Notes</label>
          <textarea v-model="general.notes" rows="2" :disabled="submitting"
            placeholder="Observations, actions taken…"></textarea>
        </div>
      </div>
    </div>

    <!-- Dynamic checklist body -->
    <div v-if="checklistLoading" class="muted">Loading checklist items…</div>
    <template v-else>
      <div v-if="groups.length === 0" class="muted">
        This checklist has no extra input fields beyond the general ones above.
      </div>
      <div v-for="(group, gi) in groups" :key="group.id + '-' + gi" class="section"
        :style="{ marginLeft: group.depth ? group.depth * 14 + 'px' : '0' }">
        <div class="form-section-label" :class="{ sub: group.depth > 0 }">{{ group.label }}</div>
        <div class="section-grid">
          <ChecklistField v-for="item in visibleItems(group.items)" :key="item.id" :item="item"
            :model-value="values[item.id]" :nested-values="values" :disabled="submitting"
            @update:modelValue="setValue(item.id, $event)" @update:nested="setValue($event.id, $event.value)" />
        </div>
      </div>
    </template>

    <div v-if="error" class="error-message">{{ error }}</div>

    <div class="form-actions">
      <button type="button" class="btn-secondary" @click="$emit('cancel')" :disabled="submitting">Cancel</button>
      <button type="submit" class="btn-primary" :disabled="submitting || selectedHiveIds.length === 0">
        {{ submitButtonLabel }}
      </button>
    </div>
  </form>
</template>

<script>
import { mapState } from 'vuex';
import { createInspection } from '@/services/api/inspectionsApi';
import ChecklistField from './ChecklistField.vue';
import { flattenSections, coerceValue, label, pruneTree, controlFor } from './checklistUtils';

export default {
  name: 'InspectionForm',
  components: { ChecklistField },
  props: {
    // single-hive inspection
    hive: { type: Object, default: null },
    // bulk/apiary inspection: pass the apiary's hives
    hives: { type: Array, default: null },
  },
  emits: ['saved', 'cancel'],
  data() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return {
      submitting: false,
      error: null,
      dateOnly: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
      timeOnly: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
      selectedChecklistId: null,
      selectedHiveIds: [],
      values: {}, // { [category_id]: value }
      checklistLoading: false,
      impressionOptions: [
        { value: 1, label: '😞 Bad' },
        { value: 2, label: '😐 Ok' },
        { value: 3, label: '😊 Good' },
      ],
      general: {
        impression: null,
        attention: null,
        notes: '',
      },
    };
  },
  computed: {
    ...mapState({
      checklists: (s) => s.checklists,
      defaultChecklist: (s) => s.defaultChecklist,
      checklistTreeById: (s) => s.checklistTreeById,
      checklistsStatus: (s) => s.checklistsStatus,
    }),
    checklistsLoading() {
      return this.checklistsStatus === 'loading' && this.checklists.length === 0;
    },
    selectableHives() {
      if (Array.isArray(this.hives)) return this.hives;
      return this.hive ? [this.hive] : [];
    },
    allSelected() {
      return (
        this.selectableHives.length > 0 &&
        this.selectedHiveIds.length === this.selectableHives.length
      );
    },
    activeChecklist() {
      return this.selectedChecklistId != null
        ? this.checklistTreeById[this.selectedChecklistId] || null
        : null;
    },
    groups() {
      if (!this.activeChecklist) return [];
      const pruned = pruneTree(this.activeChecklist.categories);
      return flattenSections(pruned);
    },
    isBulk() {
      return this.selectableHives.length > 1;
    },
    submitButtonLabel() {
      if (this.submitting) return 'Saving…';
      if (this.isBulk) {
        return `Save for ${this.selectedHiveIds.length} ${this.selectedHiveIds.length === 1 ? 'hive' : 'hives'}`;
      }
      return 'Save Inspection';
    },
  },
  async created() {
    // default-select all hives for a bulk inspection (BEEP behaviour)
    this.selectedHiveIds = this.selectableHives.map((h) => h.id);

    await this.$store.dispatch('loadChecklists');
    // pick the server default, else first available
    const def = this.defaultChecklist?.id ?? this.checklists[0]?.id ?? null;
    this.selectedChecklistId = def;
    if (def != null) await this.loadChecklistBody(def);
  },
  methods: {
    label,
    setValue(id, val) {
      this.values = { ...this.values, [id]: val };
    },
    toggleHive(id) {
      const i = this.selectedHiveIds.indexOf(id);
      if (i === -1) this.selectedHiveIds = [...this.selectedHiveIds, id];
      else this.selectedHiveIds = this.selectedHiveIds.filter((x) => x !== id);
    },
    toggleAll() {
      this.selectedHiveIds = this.allSelected
        ? []
        : this.selectableHives.map((h) => h.id);
    },
    async onChecklistChange() {
      this.values = {};
      await this.loadChecklistBody(this.selectedChecklistId);
    },
    async loadChecklistBody(id) {
      if (id == null) return;
      this.checklistLoading = true;
      this.error = null;
      try {
        await this.$store.dispatch('loadChecklistTree', { id });
      } catch {
        this.error = 'Could not load this checklist. Try another one.';
      } finally {
        this.checklistLoading = false;
      }
    },
    buildItems() {
      const items = {};
      if (!this.activeChecklist) return items;
      // Map raw values -> coerced values keyed by category id, dropping empties.
      const inputByID = {};
      for (const group of this.groups) {
        for (const item of group.items) {
          inputByID[item.id] = item.input;
          for (const child of item.children || []) inputByID[child.id] = child.input;
        }
      }
      Object.entries(this.values).forEach(([id, raw]) => {
        const input = inputByID[id] || 'number';
        const v = coerceValue(input, raw);
        if (v !== null) items[id] = v;
      });
      return items;
    },
    async submit() {
      if (this.selectedHiveIds.length === 0) {
        this.error = 'Select at least one hive.';
        return;
      }
      this.submitting = true;
      this.error = null;
      try {
        const pad = (n) => String(n).padStart(2, '0');
        const time = this.timeOnly || '00:00';
        const d = this.dateOnly ? new Date(`${this.dateOnly}T${time}:00`) : new Date();
        const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
          d.getDate()
        )} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;

        const payload = {
          date,
          checklist_id: this.selectedChecklistId,
          hive_ids: this.selectedHiveIds,
          items: this.buildItems(),
        };

        // General fields go at the top level, not inside items.
        if (this.general.impression !== null) payload.impression = this.general.impression;
        if (this.general.attention !== null) payload.attention = this.general.attention;
        if (this.general.notes && this.general.notes.trim()) payload.notes = this.general.notes.trim();

        await createInspection(payload);

        // refresh inspections for each affected hive
        for (const hiveId of this.selectedHiveIds) {
          this.$store.commit('clearHiveInspections', hiveId);
          await this.$store.dispatch('loadHiveInspections', hiveId);
        }
        this.$emit('saved');
      } catch (err) {
        const data = err?.response?.data;
        const msg = data?.message || Object.values(data?.errors || {})?.[0]?.[0];
        this.error = msg || 'Failed to save. Please try again.';
      } finally {
        this.submitting = false;
      }
    },
    visibleItems(items) {
      return items.filter((it) => controlFor(it.input) !== 'hidden');
    },
  },
};
</script>

<style scoped>
.add-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.muted {
  color: #999;
  font-size: 0.9rem;
  padding: 8px 0;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-row label {
  font-size: 0.85rem;
  color: #666;
  font-family: TwCen, sans-serif;
}

.checklist-select {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 9px 12px;
  font-family: TwCen, sans-serif;
  font-size: 1rem;
  background: #F9FAFE;
  color: #333;
  cursor: pointer;
}

.checklist-select:focus {
  outline: none;
  border-color: #575EAE;
  box-shadow: 0 0 0 3px rgba(87, 94, 174, 0.15);
}

.hive-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.hive-chip {
  padding: 4px 12px;
  border-radius: 100px;
  border: 2px solid #ddd;
  background: white;
  color: #555;
  font-family: TwCen, sans-serif;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.15s;
}

.hive-chip.on {
  border-color: #379C5A;
  background: #379C5A;
  color: white;
}

.hive-chip-all {
  padding: 4px 12px;
  border-radius: 100px;
  border: 1px solid #575EAE;
  background: #f5f6ff;
  color: #575EAE;
  font-family: TwCen, sans-serif;
  font-size: 0.8rem;
  cursor: pointer;
}

.form-row-datetime {
  flex-direction: row;
  align-items: center;
  gap: 10px;
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

.section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-section-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #575EAE;
  margin-top: 6px;
  padding-bottom: 4px;
  border-bottom: 1px solid #e3e4f3;
  font-weight: bold;
}

.form-section-label.sub {
  color: #8b8fc4;
  text-transform: none;
  letter-spacing: 0.02em;
  font-size: 0.72rem;
}

.section-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.gen-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.gen-field-wide {
  grid-column: 1 / -1;
}

.gen-label {
  font-size: 0.85rem;
  color: #666;
  font-family: TwCen, sans-serif;
}

.gen-field textarea {
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

.gen-field textarea:focus {
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
  margin-top: 8px;
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
  .section-grid {
    grid-template-columns: 1fr;
  }
}
</style>