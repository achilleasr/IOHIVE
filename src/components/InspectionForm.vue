<template>
  <form class="add-form" @submit.prevent="submit">
    <div class="form-row form-row-datetime">
      <label>Date</label>
      <input v-model="form.dateOnly" type="date" :disabled="submitting" />
      <label>Time</label>
      <input v-model="form.timeOnly" type="time" :disabled="submitting" />
    </div>

    <div class="form-row">
      <label>Overall impression</label>
      <div class="choice-row">
        <button type="button" v-for="opt in impressionOptions" :key="opt.value"
          :class="['choice-btn', form.impression === opt.value ? 'selected' : '']" @click="form.impression = opt.value"
          :disabled="submitting">
          {{ opt.label }}
        </button>
      </div>
    </div>

    <div class="form-row">
      <label>Queen seen?</label>
      <div class="choice-row">
        <button type="button" :class="['choice-btn', form.queen_seen === 1 ? 'selected' : '']"
          @click="form.queen_seen = 1" :disabled="submitting">Yes</button>
        <button type="button" :class="['choice-btn', form.queen_seen === 0 ? 'selected' : '']"
          @click="form.queen_seen = 0" :disabled="submitting">No</button>
      </div>
    </div>

    <div class="form-row">
      <label>Needs attention?</label>
      <div class="choice-row">
        <button type="button" :class="['choice-btn', form.needs_attention === 1 ? 'selected' : '']"
          @click="form.needs_attention = 1" :disabled="submitting">Yes</button>
        <button type="button" :class="['choice-btn', form.needs_attention === 0 ? 'selected' : '']"
          @click="form.needs_attention = 0" :disabled="submitting">No</button>
      </div>
    </div>

    <div class="form-section-label">Brood</div>
    <div class="form-grid">
      <div class="form-row">
        <label>Brood frames</label>
        <input v-model.number="form.brood" type="number" min="0" max="30" placeholder="0" :disabled="submitting" />
      </div>
      <div class="form-row">
        <label>Eggs seen?</label>
        <div class="choice-row">
          <button type="button" :class="['choice-btn', form.eggs === 1 ? 'selected' : '']" @click="form.eggs = 1"
            :disabled="submitting">Yes</button>
          <button type="button" :class="['choice-btn', form.eggs === 0 ? 'selected' : '']" @click="form.eggs = 0"
            :disabled="submitting">No</button>
        </div>
      </div>
    </div>

    <div class="form-section-label">Food & treatments</div>
    <div class="form-grid">
      <div class="form-row">
        <label>Summer feed?</label>
        <div class="choice-row">
          <button type="button" :class="['choice-btn', form.summer_feed === 1 ? 'selected' : '']"
            @click="form.summer_feed = 1" :disabled="submitting">Yes</button>
          <button type="button" :class="['choice-btn', form.summer_feed === 0 ? 'selected' : '']"
            @click="form.summer_feed = 0" :disabled="submitting">No</button>
        </div>
      </div>
      <div class="form-row">
        <label>Winter feed?</label>
        <div class="choice-row">
          <button type="button" :class="['choice-btn', form.winter_feed === 1 ? 'selected' : '']"
            @click="form.winter_feed = 1" :disabled="submitting">Yes</button>
          <button type="button" :class="['choice-btn', form.winter_feed === 0 ? 'selected' : '']"
            @click="form.winter_feed = 0" :disabled="submitting">No</button>
        </div>
      </div>
      <div class="form-row">
        <label>Varroa treatment?</label>
        <div class="choice-row">
          <button type="button" :class="['choice-btn', form.varroa_treatment === 1 ? 'selected' : '']"
            @click="form.varroa_treatment = 1" :disabled="submitting">Yes</button>
          <button type="button" :class="['choice-btn', form.varroa_treatment === 0 ? 'selected' : '']"
            @click="form.varroa_treatment = 0" :disabled="submitting">No</button>
        </div>
      </div>
      <div class="form-row">
        <label>Varroa count</label>
        <input v-model.number="form.varroa_count" type="number" min="0" placeholder="0" :disabled="submitting" />
      </div>
      <div class="form-row">
        <label>Honey super added?</label>
        <div class="choice-row">
          <button type="button" :class="['choice-btn', form.honey_super === 1 ? 'selected' : '']"
            @click="form.honey_super = 1" :disabled="submitting">Yes</button>
          <button type="button" :class="['choice-btn', form.honey_super === 0 ? 'selected' : '']"
            @click="form.honey_super = 0" :disabled="submitting">No</button>
        </div>
      </div>
      <div class="form-row">
        <label>Mouse guard?</label>
        <div class="choice-row">
          <button type="button" :class="['choice-btn', form.mouse_guard === 1 ? 'selected' : '']"
            @click="form.mouse_guard = 1" :disabled="submitting">Yes</button>
          <button type="button" :class="['choice-btn', form.mouse_guard === 0 ? 'selected' : '']"
            @click="form.mouse_guard = 0" :disabled="submitting">No</button>
        </div>
      </div>
    </div>

    <div class="form-row">
      <label>Notes</label>
      <textarea v-model="form.notes" rows="3" :disabled="submitting"
        placeholder="Observations, treatments, actions taken…"></textarea>
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
import { createInspection } from '@/services/api/inspectionsApi';

export default {
  name: 'InspectionForm',
  props: {
    hive: { type: Object, required: true },
  },
  emits: ['saved', 'cancel'],
  data() {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const dateOnly = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const timeOnly = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    return {
      submitting: false,
      error: null,
      impressionOptions: [
        { value: 1, label: '😞 Bad' },
        { value: 2, label: '😐 Ok' },
        { value: 3, label: '😊 Good' },
      ],
      form: {
        dateOnly,
        timeOnly,
        impression: null,
        queen_seen: null,
        needs_attention: null,
        brood: null,
        eggs: null,
        summer_feed: null,
        winter_feed: null,
        varroa_treatment: null,
        varroa_count: null,
        honey_super: null,
        mouse_guard: null,
        notes: '',
      },
    };
  },
  methods: {
    async submit() {
      this.submitting = true;
      this.error = null;
      try {
        const inner = { hive_id: this.hive.id };

        const dateStr = this.form.dateOnly;
        const time = this.form.timeOnly || '00:00';
        // BEEP API requires field name 'date' (not 'created_at'), MySQL format
        const pad = n => String(n).padStart(2, '0');
        const d = dateStr ? new Date(`${dateStr}T${time}:00`) : new Date();
        inner.date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;

        if (this.form.notes && this.form.notes.trim()) inner.notes = this.form.notes.trim();
        if (this.form.impression !== null) inner.impression = this.form.impression;
        if (this.form.queen_seen !== null) inner.queen_seen = this.form.queen_seen;
        if (this.form.needs_attention !== null) inner.needs_attention = this.form.needs_attention;
        if (this.form.brood !== null && this.form.brood !== '') inner.brood = this.form.brood;
        if (this.form.eggs !== null) inner.eggs = this.form.eggs;
        if (this.form.summer_feed !== null) inner.summer_feed = this.form.summer_feed;
        if (this.form.winter_feed !== null) inner.winter_feed = this.form.winter_feed;
        if (this.form.varroa_treatment !== null) inner.varroa_treatment = this.form.varroa_treatment;
        if (this.form.varroa_count !== null && this.form.varroa_count !== '') inner.varroa_count = this.form.varroa_count;
        if (this.form.honey_super !== null) inner.honey_super = this.form.honey_super;
        if (this.form.mouse_guard !== null) inner.mouse_guard = this.form.mouse_guard;

        await createInspection(inner);
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
.add-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-section-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #aaa;
  margin-top: 6px;
  padding-bottom: 4px;
  border-bottom: 1px solid #f0f0f0;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-row label {
  font-size: 0.82rem;
  color: #666;
  font-family: TwCen, sans-serif;
}

.form-row-datetime {
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.form-row input[type="number"],
.form-row input[type="date"],
.form-row input[type="time"] {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 7px 10px;
  font-family: TwCen, sans-serif;
  font-size: 0.95rem;
  background: #F9FAFE;
  color: #333;
}

.form-row textarea {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 9px 12px;
  font-family: TwCen, sans-serif;
  font-size: 1rem;
  background: #F9FAFE;
  color: #333;
  resize: vertical;
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
</style>