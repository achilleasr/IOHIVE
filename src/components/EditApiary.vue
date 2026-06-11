<template>
    <teleport to="body">
        <div v-if="open" class="overlay" @click.self="close">
            <div class="modal-card" @click.stop>
                <div class="modal-header">
                    <h2>Edit Apiary</h2>
                    <button class="close-btn" @click="close">×</button>
                </div>

                <form v-if="!showDeleteConfirm" class="add-form" @submit.prevent="save">
                    <div class="form-row">
                        <label>Name <span class="required">*</span></label>
                        <input v-model="form.name" type="text" required :disabled="submitting" maxlength="120" />
                    </div>

                    <div class="form-row form-row-color">
                        <label>Color</label>
                        <input v-model="form.color" type="color" :disabled="submitting" />
                    </div>

                    <div v-if="error" class="error-message">{{ error }}</div>

                    <div class="form-actions">
                        <button type="button" class="btn-danger" @click="showDeleteConfirm = true"
                            :disabled="submitting">
                            Delete
                        </button>
                        <div class="spacer"></div>
                        <button type="button" class="btn-secondary" @click="close"
                            :disabled="submitting">Cancel</button>
                        <button type="submit" class="btn-primary" :disabled="submitting || !form.name.trim()">
                            {{ submitting ? 'Saving…' : 'Save' }}
                        </button>
                    </div>
                </form>

                <div v-else class="delete-confirm">
                    <p>Delete <strong>{{ apiary.name }}</strong> and all its hives? This cannot be undone.</p>
                    <div v-if="error" class="error-message">{{ error }}</div>
                    <div class="form-actions">
                        <button class="btn-secondary" @click="showDeleteConfirm = false"
                            :disabled="submitting">Cancel</button>
                        <button class="btn-danger" @click="doDelete" :disabled="submitting">
                            {{ submitting ? 'Deleting…' : 'Yes, delete' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<script>
import { updateLocation, deleteLocation } from '@/services/api/locationsApi';

export default {
    name: 'EditApiary',
    props: {
        apiary: { type: Object, required: true },
        open: { type: Boolean, default: false },
    },
    emits: ['close', 'deleted'],
    data() {
        return {
            submitting: false,
            error: null,
            showDeleteConfirm: false,
            form: { name: '', color: '#FABB13' },
        };
    },
    watch: {
        open(val) {
            if (val) {
                const raw = (this.apiary.hex_color || '').trim();
                this.form.name = this.apiary.name || '';
                this.form.color = raw ? (raw.startsWith('#') ? raw : '#' + raw) : '#FABB13';
                this.error = null;
                this.showDeleteConfirm = false;
            }
        },
    },
    methods: {
        close() {
            if (this.submitting) return;
            this.$emit('close');
        },
        async save() {
            const name = this.form.name.trim();
            if (!name) { this.error = 'Name is required'; return; }
            this.submitting = true;
            this.error = null;
            try {
                await updateLocation(this.apiary.id, {
                    name,
                    hex_color: this.form.color.replace('#', ''),
                    lat: this.apiary.coordinate_lat,
                    lon: this.apiary.coordinate_lon,
                });
                await this.$store.dispatch('loadApiaries');
                this.$emit('close');
            } catch (err) {
                const msg = err?.response?.data?.message || Object.values(err?.response?.data?.errors || {})?.[0]?.[0];
                this.error = msg || 'Failed to save. Please try again.';
            } finally {
                this.submitting = false;
            }
        },
        async doDelete() {
            this.submitting = true;
            this.error = null;
            try {
                await deleteLocation(this.apiary.id);
                await this.$store.dispatch('loadApiaries');
                this.$emit('deleted');
                this.$emit('close');
            } catch (err) {
                const msg = err?.response?.data?.message;
                this.error = msg || 'Failed to delete. Please try again.';
                this.showDeleteConfirm = false;
            } finally {
                this.submitting = false;
            }
        },
    },
};
</script>

<style scoped>
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
    width: 420px;
    max-width: 94vw;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
    font-family: TwCen, sans-serif;
    animation: slideUp 0.22s ease-out;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
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

.required {
    color: #d05050;
}

.form-row input[type="text"] {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 9px 12px;
    font-family: TwCen, sans-serif;
    font-size: 1rem;
    background: #F9FAFE;
    color: #333;
    transition: border-color 0.15s, box-shadow 0.15s;
}

.form-row input[type="text"]:focus {
    outline: none;
    border-color: #575EAE;
    box-shadow: 0 0 0 3px rgba(87, 94, 174, 0.15);
}

.form-row-color {
    flex-direction: row;
    align-items: center;
    gap: 12px;
}

.form-row input[type="color"] {
    width: 56px;
    height: 36px;
    padding: 2px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: white;
    cursor: pointer;
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
    align-items: center;
    gap: 10px;
    margin-top: 8px;
}

.spacer {
    flex: 1;
}

.delete-confirm {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.delete-confirm p {
    margin: 0;
    color: #555;
    font-size: 0.95rem;
    background: #fff5f5;
    padding: 14px;
    border-radius: 10px;
    border: 1px solid #f5c6c6;
}

.btn-primary,
.btn-secondary,
.btn-danger {
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

.btn-secondary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-danger {
    background: #e46268;
    color: white;
}

.btn-danger:hover:not(:disabled) {
    background: #c94049;
}

.btn-danger:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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