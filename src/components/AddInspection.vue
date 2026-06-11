<template>
    <button class="add-inspection-btn" @click="openModal">+ Add Inspection</button>

    <teleport to="body">
        <div v-if="open" class="overlay" @click.self="close">
            <div class="modal-card" @click.stop>
                <div class="modal-header">
                    <h2>New Inspection — {{ hive.name }}</h2>
                    <button class="close-btn" @click="close">×</button>
                </div>

                <form class="add-form" @submit.prevent="submit">
                    <div class="form-row">
                        <label>Date & time</label>
                        <input v-model="form.date" type="datetime-local" :disabled="submitting" />
                    </div>

                    <div class="form-row">
                        <label>Overall impression</label>
                        <div class="choice-row">
                            <button type="button" v-for="opt in impressionOptions" :key="opt.value"
                                :class="['choice-btn', form.impression === opt.value ? 'selected' : '']"
                                @click="form.impression = opt.value" :disabled="submitting">
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

                    <div class="form-row">
                        <label>Brood frames</label>
                        <input v-model.number="form.brood" type="number" min="0" max="30" placeholder="0"
                            :disabled="submitting" />
                    </div>

                    <div class="form-row">
                        <label>Notes</label>
                        <textarea v-model="form.notes" rows="3" :disabled="submitting"
                            placeholder="Observations, treatments, actions taken…"></textarea>
                    </div>

                    <div v-if="error" class="error-message">{{ error }}</div>

                    <div class="form-actions">
                        <button type="button" class="btn-secondary" @click="close"
                            :disabled="submitting">Cancel</button>
                        <button type="submit" class="btn-primary" :disabled="submitting">
                            {{ submitting ? 'Saving…' : 'Save Inspection' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </teleport>
</template>

<script>
import { createInspection } from '@/services/api/inspectionsApi';

export default {
    name: 'AddInspection',
    props: {
        hive: { type: Object, required: true },
    },
    data() {
        return {
            open: false,
            submitting: false,
            error: null,
            impressionOptions: [
                { value: 1, label: '😞 Bad' },
                { value: 2, label: '😐 Ok' },
                { value: 3, label: '😊 Good' },
            ],
            form: this.defaultForm(),
        };
    },
    methods: {
        defaultForm() {
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            return {
                date: now.toISOString().slice(0, 16),
                impression: null,
                queen_seen: null,
                needs_attention: null,
                brood: null,
                notes: '',
            };
        },
        openModal() {
            this.form = this.defaultForm();
            this.error = null;
            this.open = true;
        },
        close() {
            if (this.submitting) return;
            this.open = false;
        },
        async submit() {
            this.submitting = true;
            this.error = null;
            try {
                const inner = { hive_id: this.hive.id };
                if (this.form.notes.trim()) inner.notes = this.form.notes.trim();
                if (this.form.impression !== null) inner.impression = this.form.impression;
                if (this.form.queen_seen !== null) inner.queen_seen = this.form.queen_seen;
                if (this.form.needs_attention !== null) inner.needs_attention = this.form.needs_attention;
                if (this.form.brood !== null && this.form.brood !== '') inner.brood = this.form.brood;
                if (this.form.date) inner.created_at = new Date(this.form.date).toISOString();

                await createInspection(inner);
                this.$store.commit('clearHiveInspections', this.hive.id);
                await this.$store.dispatch('loadHiveInspections', this.hive.id);
                this.open = false;
            } catch (err) {
                const data = err?.response?.data;
                const msg = data?.message || Object.values(data?.errors || {})?.[0]?.[0];
                this.error = msg || 'Failed to save. Please check the fields and try again.';
            } finally {
                this.submitting = false;
            }
        },
    },
};
</script>

<style scoped>
.add-inspection-btn {
    background: none;
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 100px;
    color: white;
    padding: 5px 14px;
    font-family: TwCen, sans-serif;
    font-size: 0.9vw;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
}

.add-inspection-btn:hover {
    background: rgba(255, 255, 255, 0.15);
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.18s ease-out;
}

.modal-card {
    background: white;
    color: #333;
    border-radius: 20px;
    padding: 28px 36px 24px;
    width: 460px;
    max-width: 94vw;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
    font-family: TwCen, sans-serif;
    animation: slideUp 0.22s ease-out;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    gap: 12px;
}

.modal-header h2 {
    margin: 0;
    font-size: 1.2rem;
    color: #333;
    font-family: TwCen, sans-serif;
}

.close-btn {
    background: none;
    border: none;
    font-size: 1.8rem;
    line-height: 1;
    cursor: pointer;
    color: #999;
    padding: 0 8px;
    border-radius: 50%;
    transition: color 0.15s;
    flex-shrink: 0;
}

.close-btn:hover {
    color: #333;
}

.add-form {
    display: flex;
    flex-direction: column;
    gap: 14px;
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

.form-row input[type="number"],
.form-row input[type="datetime-local"] {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 9px 12px;
    font-family: TwCen, sans-serif;
    font-size: 1rem;
    background: #F9FAFE;
    color: #333;
    width: 180px;
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
    gap: 8px;
    flex-wrap: wrap;
}

.choice-btn {
    padding: 7px 16px;
    border-radius: 100px;
    border: 2px solid #ddd;
    background: white;
    color: #555;
    font-family: TwCen, sans-serif;
    font-size: 0.9rem;
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

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(8px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>