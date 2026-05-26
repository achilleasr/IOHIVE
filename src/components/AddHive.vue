<template>
    <div class="add-hive-tile" @click="openModal" role="button" tabindex="0" @keydown.enter="openModal"
        @keydown.space.prevent="openModal">
        <svg class="plus-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
        </svg>
        <span>Add Hive</span>
    </div>

    <teleport to="body">
        <div v-if="modalOpen" class="overlay" @click.self="closeModal">
            <div class="modal-card" @click.stop>

                <div class="modal-header">
                    <h2>Add New Hive</h2>
                    <button class="close-btn" @click="closeModal" aria-label="Close">×</button>
                </div>

                <form class="add-form" @submit.prevent="submitHive">
                    <div class="form-row">
                        <label for="hive-name">Name <span class="required">*</span></label>
                        <input id="hive-name" v-model="form.name" type="text" placeholder="Hive 1" required
                            :disabled="submitting" maxlength="120" />
                    </div>

                    <div class="form-row form-row-color">
                        <label for="hive-color">Color</label>
                        <input id="hive-color" v-model="form.hex_color" type="color" :disabled="submitting" />
                    </div>

                    <div v-if="error" class="error-message">{{ error }}</div>

                    <div class="form-actions">
                        <button type="button" class="btn-secondary" @click="closeModal"
                            :disabled="submitting">Cancel</button>
                        <button type="submit" class="btn-primary" :disabled="submitting || !form.name.trim()">
                            {{ submitting ? 'Creating…' : 'Create Hive' }}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    </teleport>
</template>

<script>
import { createHive } from '@/services/api/hivesApi';

export default {
    name: 'AddHive',
    props: {
        locationId: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            modalOpen: false,
            submitting: false,
            error: null,
            form: { name: '', hex_color: '#FABB13' },
        };
    },
    methods: {
        stripHash(hex) {
            return (hex || '').replace('#', '');
        },

        openModal() {
            this.form = { name: '', hex_color: '#FABB13' };
            this.error = null;
            this.modalOpen = true;
        },

        closeModal() {
            if (this.submitting) return;
            this.modalOpen = false;
        },

        async submitHive() {
            const name = this.form.name.trim();
            if (!name) { this.error = 'Name is required'; return; }

            this.submitting = true;
            this.error = null;

            try {
                await createHive({
                    name,
                    location_id: this.locationId,
                    color: this.form.hex_color,
                    brood_layers: 1,
                    honey_layers: 1,
                });
                await this.$store.dispatch('loadApiaries');
                this.modalOpen = false;
            } catch (err) {
                const msg = err?.response?.data?.message
                    || Object.values(err?.response?.data?.errors || {})?.[0]?.[0];
                this.error = msg || 'Failed to create hive. Please try again.';
            } finally {
                this.submitting = false;
            }
        },
    },
};
</script>

<style scoped>
.add-hive-tile {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border: dashed rgb(160, 160, 200) 2px;
    border-radius: 20px;
    padding: 16px 30px;
    color: #575EAE;
    font-family: TwCen, sans-serif;
    font-size: 1.2vw;
    cursor: pointer;
    transition: all 0.2s ease;
    background: #ffffff;
}

.add-hive-tile:hover {
    border-color: #575EAE;
    background-color: #f5f6ff;
    box-shadow: 0px 6px 16px #575eae20;
    transform: translateY(-2px);
}

.add-hive-tile:active {
    transform: translateY(0);
}

.add-hive-tile:focus-visible {
    outline: 2px solid #575EAE;
    outline-offset: 2px;
}

.plus-icon {
    width: 1.6vw;
    height: 1.6vw;
    fill: #575EAE;
    flex-shrink: 0;
}

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
    width: 420px;
    max-width: 94vw;
    box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.25);
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
    transition: color 0.15s ease;
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
    background-color: #F9FAFE;
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