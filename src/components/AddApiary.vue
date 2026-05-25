<template>
    <div class="block">
        <div class="apiary-item add-tile" @click="openModal" role="button" tabindex="0" @keydown.enter="openModal"
            @keydown.space.prevent="openModal">
            <svg class="plus-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
            <div class="add-label">Add Apiary</div>
        </div>
    </div>

    <teleport to="body">
        <div v-if="modalOpen" class="overlay" @click.self="closeModal">
            <div class="modal-card" @click.stop>
                <div class="modal-header">
                    <h2>Add New Apiary</h2>
                    <button class="close-btn" @click="closeModal" aria-label="Close">×</button>
                </div>

                <form class="add-apiary-form" @submit.prevent="submit">
                    <div class="form-row">
                        <label for="addapiary-name">Name <span class="required">*</span></label>
                        <input id="addapiary-name" v-model="form.name" type="text" placeholder="My apiary" required
                            :disabled="submitting" maxlength="120" />
                    </div>

                    <div class="form-row-pair">
                        <div class="form-row">
                            <label for="addapiary-lat">Latitude</label>
                            <input id="addapiary-lat" v-model.number="form.lat" type="number" step="0.000001"
                                placeholder="e.g. 37.4385" :disabled="submitting" />
                        </div>
                        <div class="form-row">
                            <label for="addapiary-lon">Longitude</label>
                            <input id="addapiary-lon" v-model.number="form.lon" type="number" step="0.000001"
                                placeholder="e.g. 24.9139" :disabled="submitting" />
                        </div>
                    </div>

                    <div class="form-row form-row-color">
                        <label for="addapiary-color">Color</label>
                        <input id="addapiary-color" v-model="form.hex_color" type="color" :disabled="submitting" />
                    </div>

                    <div v-if="error" class="error-message">{{ error }}</div>

                    <div class="form-actions">
                        <button type="button" class="btn-secondary" @click="closeModal" :disabled="submitting">
                            Cancel
                        </button>
                        <button type="submit" class="btn-primary"
                            :disabled="submitting || !form.name || !form.name.trim()">
                            {{ submitting ? 'Creating…' : 'Create Apiary' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </teleport>
</template>

<script>
import { createLocation } from '@/services/api/locationsApi';

export default {
    name: 'AddApiary',
    data() {
        return {
            modalOpen: false,
            submitting: false,
            error: null,
            form: this.emptyForm(),
        };
    },
    methods: {
        emptyForm() {
            return {
                name: '',
                lat: null,
                lon: null,
                hex_color: '#FABB13',
            };
        },
        openModal() {
            this.error = null;
            this.form = this.emptyForm();
            this.modalOpen = true;
        },
        closeModal() {
            if (this.submitting) return;
            this.modalOpen = false;
        },
        async submit() {
            const trimmedName = this.form.name?.trim();
            if (!trimmedName) {
                this.error = 'Name is required';
                return;
            }

            this.submitting = true;
            this.error = null;

            const payload = {
                name: trimmedName,
                hive_amount: 0,
            };
            if (typeof this.form.lat === 'number' && !Number.isNaN(this.form.lat)) {
                payload.lat = this.form.lat;
            }
            if (typeof this.form.lon === 'number' && !Number.isNaN(this.form.lon)) {
                payload.lon = this.form.lon;
            }
            if (this.form.hex_color) {
                payload.hex_color = this.form.hex_color;
            }

            try {
                await createLocation(payload);
                await this.$store.dispatch('loadApiaries');
                this.modalOpen = false;
            } catch (err) {
                console.error('Failed to create apiary:', err);
                const apiMessage =
                    err?.response?.data?.message ||
                    err?.response?.data?.errors?.name?.[0];
                this.error = apiMessage || 'Failed to create apiary. Please try again.';
            } finally {
                this.submitting = false;
            }
        },
    },
};
</script>

<style scoped>
/* ============================================================ */
/* The tile in the apiary row — mirrors ApiaryItem dimensions    */
/* ============================================================ */

.block {
    display: inline-block;
    margin-right: 2vw;
}

.block:last-child {
    margin-right: 0;
}

.apiary-item.add-tile {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    background-color: #ffffff;
    border: dashed rgb(160, 160, 200) 2px;
    color: #575EAE;
    font-size: 1.1vw;
    width: 6vw;
    height: 6vw;
    border-radius: 0.8vw;
    padding: 0.6vw;
    gap: 0.4vw;
    box-shadow: 1px 2px 2px #575eae29;
    transition: all 0.2s ease 0s;
    cursor: pointer;
    font-family: TwCen, sans-serif;
}

.apiary-item.add-tile:hover {
    box-shadow: 0px 15px 20px #575eae29;
    transform: translateY(-4px);
    background-color: #f5f6ff;
    border-color: #575EAE;
}

.apiary-item.add-tile:active {
    transform: translateY(-1px);
}

.apiary-item.add-tile:focus-visible {
    outline: 2px solid #575EAE;
    outline-offset: 2px;
}

.plus-icon {
    width: 2vw;
    height: 2vw;
    fill: #575EAE;
}

.add-label {
    font-size: 0.9vw;
    line-height: 1;
}

/* ============================================================ */
/* Modal                                                          */
/* ============================================================ */

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.35);
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
    max-width: 92vw;
    box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.25);
    font-family: TwCen, sans-serif;
    animation: slideUp 0.22s ease-out;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 22px;
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
    transition: color 0.15s ease;
}

.close-btn:hover {
    color: #333;
}

.add-apiary-form {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.form-row {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.form-row-pair {
    display: flex;
    gap: 12px;
}

.form-row-pair .form-row {
    flex: 1;
}

.form-row label {
    font-size: 0.85rem;
    color: #666;
    font-family: TwCen, sans-serif;
}

.required {
    color: #d05050;
}

.form-row input[type="text"],
.form-row input[type="number"] {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 9px 12px;
    font-family: TwCen, sans-serif;
    font-size: 1rem;
    background-color: #F9FAFE;
    color: #333;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.form-row input[type="text"]:focus,
.form-row input[type="number"]:focus {
    outline: none;
    border-color: #575EAE;
    box-shadow: 0 0 0 3px rgba(87, 94, 174, 0.15);
}

.form-row input:disabled {
    background-color: #f0f0f0;
    cursor: not-allowed;
}

.form-row-color {
    flex-direction: row;
    align-items: center;
    gap: 12px;
}

.form-row-color label {
    flex: 0 0 auto;
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
    background-color: #fdeaea;
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
    background-color: #575EAE;
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background-color: #3e4379;
}

.btn-primary:disabled {
    background-color: #b5b8d4;
    cursor: not-allowed;
}

.btn-secondary {
    background-color: #f0f0f0;
    color: #555;
}

.btn-secondary:hover:not(:disabled) {
    background-color: #e0e0e0;
}

.btn-secondary:disabled {
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
