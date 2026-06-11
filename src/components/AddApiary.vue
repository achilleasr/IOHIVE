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
                    <div class="modal-header-left">
                        <button v-if="step === 2" type="button" class="btn-back" @click="step = 1">← Back</button>
                        <h2>{{ step === 1 ? 'Add New Apiary' : 'Add First Hive' }}</h2>
                    </div>
                    <button class="close-btn" @click="closeModal" aria-label="Close">×</button>
                </div>

                <div class="step-indicator">
                    <div :class="['step-dot', step === 1 ? 'active' : 'done']">1</div>
                    <div class="step-line"></div>
                    <div :class="['step-dot', step === 2 ? 'active' : '']">2</div>
                </div>

                <form v-if="step === 1" class="add-form" @submit.prevent="submitApiary">
                    <div class="form-row">
                        <label for="apiary-name">Name <span class="required">*</span></label>
                        <input id="apiary-name" v-model="apiaryForm.name" type="text" placeholder="My apiary" required
                            :disabled="submitting" maxlength="120" />
                    </div>

                    <div class="form-row form-row-color">
                        <label for="apiary-color">Color</label>
                        <input id="apiary-color" v-model="apiaryForm.color" type="color" :disabled="submitting" />
                    </div>

                    <div class="form-row">
                        <label>Location <span class="required">*</span></label>
                        <div class="map-picker-container">
                            <l-map ref="pickerMap" :zoom="mapZoom" :center="mapCenter" :options="{ zoomControl: true }"
                                @ready="onMapReady" @moveend="onMapMoveEnd"
                                style="height: 220px; width: 100%; border-radius: 12px;">
                                <l-tile-layer :url="tileUrl" />
                            </l-map>
                            <div class="map-crosshair" aria-hidden="true">
                                <svg viewBox="0 0 24 24" width="38" height="38">
                                    <path
                                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                                        fill="#575EAE" stroke="white" stroke-width="0.8" />
                                </svg>
                            </div>
                        </div>
                        <p class="location-hint">{{ locationHint || 'Drag the map to position the pin' }}</p>
                    </div>

                    <div v-if="error" class="error-message">{{ error }}</div>

                    <div class="form-actions">
                        <button type="button" class="btn-secondary" @click="closeModal"
                            :disabled="submitting">Cancel</button>
                        <button type="submit" class="btn-primary" :disabled="submitting || !apiaryForm.name.trim()">
                            {{ submitting ? 'Creating…' : 'Next →' }}
                        </button>
                    </div>
                </form>

                <form v-if="step === 2" class="add-form" @submit.prevent="submitHive">
                    <p class="step-hint">Give your first hive a name. You can add more hives later.</p>

                    <div class="form-row">
                        <label for="hive-name">Hive name <span class="required">*</span></label>
                        <input id="hive-name" v-model="hiveForm.name" type="text" placeholder="Hive 1" required
                            :disabled="submitting" maxlength="120" />
                    </div>

                    <div class="form-row form-row-color">
                        <label for="hive-color">Color</label>
                        <input id="hive-color" v-model="hiveForm.color" type="color" :disabled="submitting" />
                    </div>

                    <div v-if="error" class="error-message">{{ error }}</div>

                    <div class="form-actions">
                        <button type="button" class="btn-secondary" @click="skipHive"
                            :disabled="submitting">Skip</button>
                        <button type="submit" class="btn-primary" :disabled="submitting || !hiveForm.name.trim()">
                            {{ submitting ? 'Creating…' : 'Create' }}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    </teleport>
</template>

<script>
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import { createLocation } from '@/services/api/locationsApi';
import { createHive } from '@/services/api/hivesApi';

const DEFAULT_LAT = 38.5;
const DEFAULT_LON = 23.0;

export default {
    name: 'AddApiary',
    components: { LMap, LTileLayer },
    data() {
        return {
            modalOpen: false,
            step: 1,
            submitting: false,
            error: null,
            newApiaryId: null,
            mapCenter: [DEFAULT_LAT, DEFAULT_LON],
            mapZoom: 6,
            locationHint: '',
            leafletMap: null,
            geocodeTimer: null,
            apiaryForm: { name: '', lat: DEFAULT_LAT, lon: DEFAULT_LON, color: '#FABB13', city: '' },
            hiveForm: { name: '', color: '#FABB13' },
        };
    },
    computed: {
        tileUrl() {
            return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        },
    },
    methods: {
        stripHash(hex) {
            return (hex || '').replace('#', '');
        },

        openModal() {
            this.step = 1;
            this.error = null;
            this.locationHint = '';
            this.leafletMap = null;
            this.newApiaryId = null;
            this.mapCenter = [DEFAULT_LAT, DEFAULT_LON];
            this.apiaryForm = { name: '', lat: DEFAULT_LAT, lon: DEFAULT_LON, color: '#FFBF00', city: '' };
            this.hiveForm = { name: '', color: '#FFBF00' };
            this.modalOpen = true;

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        const lat = pos.coords.latitude;
                        const lon = pos.coords.longitude;
                        this.mapCenter = [lat, lon];
                        this.mapZoom = 12;
                        this.apiaryForm.lat = parseFloat(lat.toFixed(6));
                        this.apiaryForm.lon = parseFloat(lon.toFixed(6));
                        if (this.leafletMap) {
                            this.leafletMap.setView([lat, lon], 12);
                        }
                        this.reverseGeocode(lat, lon);
                    },
                    () => { }
                );
            }
        },

        closeModal() {
            if (this.submitting) return;
            this.modalOpen = false;
            this.leafletMap = null;
        },

        onMapReady(map) {
            this.leafletMap = map;
            this.$nextTick(() => {
                map.invalidateSize();
                const center = map.getCenter();
                this.apiaryForm.lat = parseFloat(center.lat.toFixed(6));
                this.apiaryForm.lon = parseFloat(center.lng.toFixed(6));
                this.reverseGeocode(center.lat, center.lng);
            });
        },

        onMapMoveEnd() {
            if (!this.leafletMap) return;
            const center = this.leafletMap.getCenter();
            this.apiaryForm.lat = parseFloat(center.lat.toFixed(6));
            this.apiaryForm.lon = parseFloat(center.lng.toFixed(6));
            clearTimeout(this.geocodeTimer);
            this.locationHint = 'Detecting location…';
            this.geocodeTimer = setTimeout(() => this.reverseGeocode(center.lat, center.lng), 800);
        },

        async reverseGeocode(lat, lng) {
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
                    { headers: { 'Accept-Language': 'en' } }
                );
                const data = await res.json();
                const addr = data.address || {};
                const place = addr.village || addr.town || addr.city || addr.county || '';
                const country = addr.country || '';
                this.locationHint = [place, country].filter(Boolean).join(', ') || data.display_name || '';
                this.apiaryForm.city = place;
            } catch {
                this.locationHint = '';
            }
        },

        async submitApiary() {
            if (this.leafletMap) {
                const c = this.leafletMap.getCenter();
                this.apiaryForm.lat = parseFloat(c.lat.toFixed(6));
                this.apiaryForm.lon = parseFloat(c.lng.toFixed(6));
            }

            const name = this.apiaryForm.name.trim();
            if (!name) { this.error = 'Name is required'; return; }

            this.submitting = true;
            this.error = null;

            const payload = {
                name,
                hive_amount: 0,
                lat: this.apiaryForm.lat,
                lon: this.apiaryForm.lon,
                hex_color: this.apiaryForm.color,
            };
            if (this.apiaryForm.city) payload.city = this.apiaryForm.city;

            try {
                const res = await createLocation(payload);
                const created = res.data;
                this.newApiaryId = created?.id ?? created?.location?.id ?? null;

                if (!this.newApiaryId) {
                    await this.$store.dispatch('loadApiaries');
                    const locs = this.$store.state.locations?.locations || [];
                    const match = locs.find(l => l.name === name);
                    this.newApiaryId = match?.id ?? null;
                }

                this.hiveForm.color = this.apiaryForm.color;
                this.step = 2;
            } catch (err) {
                const msg = err?.response?.data?.message || err?.response?.data?.errors?.name?.[0];
                this.error = msg || 'Failed to create apiary. Please try again.';
            } finally {
                this.submitting = false;
            }
        },

        async submitHive() {
            const name = this.hiveForm.name.trim();
            if (!name) { this.error = 'Hive name is required'; return; }
            if (!this.newApiaryId) { this.error = 'Could not find the new apiary. Please close and try again.'; return; }

            this.submitting = true;
            this.error = null;

            try {
                await createHive({
                    name,
                    location_id: this.newApiaryId,
                    color: this.hiveForm.color,
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

        async skipHive() {
            await this.$store.dispatch('loadApiaries');
            this.modalOpen = false;
        },
    },
};
</script>

<style scoped>
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
    width: 480px;
    max-width: 94vw;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.25);
    font-family: TwCen, sans-serif;
    animation: slideUp 0.22s ease-out;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.modal-header-left {
    display: flex;
    align-items: center;
    gap: 10px;
}

.modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
    font-family: TwCen, sans-serif;
}

.btn-back {
    background: none;
    border: 1px solid #ddd;
    border-radius: 20px;
    padding: 4px 12px;
    font-family: TwCen, sans-serif;
    font-size: 0.9rem;
    cursor: pointer;
    color: #555;
    transition: background 0.15s;
}

.btn-back:hover {
    background: #f0f0f0;
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

.step-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 20px;
}

.step-dot {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    font-weight: bold;
    background: #e8e8e8;
    color: #999;
    transition: all 0.2s;
}

.step-dot.active {
    background: #575EAE;
    color: white;
}

.step-dot.done {
    background: #a0c4a0;
    color: white;
}

.step-line {
    flex: 1;
    height: 2px;
    background: #e0e0e0;
    border-radius: 1px;
}

.step-hint {
    color: #888;
    font-size: 0.9rem;
    margin: 0 0 14px 0;
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

.map-picker-container {
    position: relative;
    height: 220px;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid #ddd;
}

.map-crosshair {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -100%);
    z-index: 999;
    pointer-events: none;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
}

.location-hint {
    font-size: 0.82rem;
    color: #666;
    margin: 0;
    min-height: 1.2em;
    font-style: italic;
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