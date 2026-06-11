<template>
    <div class="map-container">
        <l-map ref="mapRef" class="map-box" v-model:zoom="zoom" :center="center" :options="{ zoomControl: false }"
            @ready="onMapReady">
            <l-tile-layer :url="url"></l-tile-layer>

            <template v-if="storeApiaries">
                <span v-for="entry in mapApiaries" :key="'apiary-' + entry.apiary.id">
                    <span v-if="entry.centroid">
                        <l-marker :lat-lng="entry.centroid" :z-index-offset="-1000" @click="selectApiary(entry.apiary)">
                            <l-icon :icon-url="blankIconUrl" :icon-size="[1, 1]" />
                            <l-tooltip
                                :options="{ permanent: true, direction: 'top', offset: [0, -8], className: 'popup apiary-label' }">
                                <span :style="apiaryLabelStyle(entry.apiary)">{{ entry.apiary.name }}</span>
                            </l-tooltip>
                        </l-marker>
                    </span>

                    <span v-for="m in entry.markers" :key="'hive-' + m.hive.id">
                        <l-marker :lat-lng="m.latlng" @click="selectApiary(entry.apiary)">
                            <l-icon :icon-url="markerIconUrl(m.hive, entry.apiary)" :icon-size="[30, 30]" />
                            <l-tooltip :options="hiveTooltipOptions(entry.apiary)">
                                {{ m.hive.name }}
                            </l-tooltip>
                        </l-marker>
                        <l-marker v-if="m.hive.alert" :lat-lng="m.latlng" @click="selectApiary(entry.apiary)">
                            <l-icon :icon-url="require('@/assets/Hives/i_alert.svg')" :icon-size="[20, 20]"
                                :iconAnchor="[-2, 5]" />
                        </l-marker>
                    </span>
                </span>
            </template>

            <template v-else>
                <span v-for="(hive, index) in hives" :key="index">
                    <span v-if="hive.coordinates && hive.coordinates.length === 2">
                        <l-marker :lat-lng="hive.coordinates">
                            <l-icon :icon-url="markerIconUrl(hive, apiary)" :icon-size="[30, 30]" />
                            <l-tooltip
                                :options="{ permanent: true, interactive: true, direction: 'top', className: 'popup' }">
                                {{ hive.name }}
                            </l-tooltip>
                        </l-marker>
                        <l-marker v-if="hive.alert" :lat-lng="hive.coordinates">
                            <l-icon :icon-url="require('@/assets/Hives/i_alert.svg')" :icon-size="[20, 20]"
                                :iconAnchor="[-2, 5]" />
                        </l-marker>
                    </span>
                    <span v-else-if="apiary && apiary.coordinate_lat != null && apiary.coordinate_lon != null">
                        <l-marker :lat-lng="[apiary.coordinate_lat, apiary.coordinate_lon + index / 2000.0]">
                            <l-icon :icon-url="markerIconUrl(hive, apiary)" :icon-size="[30, 30]" />
                            <l-tooltip
                                :options="{ permanent: true, interactive: true, direction: 'top', className: 'popup' }">
                                {{ hive.name }}
                            </l-tooltip>
                        </l-marker>
                        <l-marker v-if="hive.alert"
                            :lat-lng="[apiary.coordinate_lat, apiary.coordinate_lon + index / 2000.0]">
                            <l-icon :icon-url="require('@/assets/Hives/i_alert.svg')" :icon-size="[20, 20]"
                                :iconAnchor="[-2, 5]" />
                        </l-marker>
                    </span>
                </span>
            </template>

            <l-control-zoom position="bottomright"></l-control-zoom>
        </l-map>
        <div class="map-title">
            <svg-icon type="mdi" :path="path" />
            <div>Apiary Map</div>
        </div>
    </div>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiMapOutline } from '@mdi/js';
import { mapState } from 'vuex';
import { LMap, LIcon, LTileLayer, LMarker, LTooltip, LControlZoom } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";

export default {
    name: 'ApiaryMap',
    components: { SvgIcon, LMap, LIcon, LTileLayer, LMarker, LTooltip, LControlZoom },
    props: {
        hives: { type: Array, default: () => [] },
        apiary: { type: Object, default: () => ({}) },
        apiaries: { type: Array, default: () => [] },
        selectedApiaryId: { type: Number, default: null },
    },
    emits: ['select-apiary'],
    data() {
        return {
            path: mdiMapOutline,
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            zoom: 11,
            center: [37.4385, 24.9139],
            leafletMap: null,
            blankIconUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>'),
        };
    },
    computed: {
        ...mapState(['loginData', 'locations']),
        storeApiaries() {
            if (!this.loginData) return null;
            const locs = this.locations?.locations;
            return Array.isArray(locs) && locs.length > 0 ? locs : null;
        },
        mapApiaries() {
            if (!this.storeApiaries) return [];
            return this.storeApiaries.map(apiary => {
                const hives = Array.isArray(apiary.hives) ? apiary.hives : [];
                const markers = [];
                hives.forEach((hive, index) => {
                    const latlng = this.hiveLatLng(hive, apiary, index);
                    if (latlng) markers.push({ hive, latlng });
                });
                const centroid = this.computeCentroid(markers, apiary);
                return { apiary, markers, centroid };
            });
        },
    },
    methods: {
        onMapReady(map) {
            this.leafletMap = map;
            if (this.selectedApiaryId) this.$nextTick(() => this.focusOnApiary(this.selectedApiaryId));
        },
        computeCentroid(markers, apiary) {
            if (markers.length > 0) {
                const lats = markers.map(m => m.latlng[0]);
                const lngs = markers.map(m => m.latlng[1]);
                return [lats.reduce((a, b) => a + b, 0) / lats.length, lngs.reduce((a, b) => a + b, 0) / lngs.length];
            }
            if (apiary.coordinate_lat != null && apiary.coordinate_lon != null) return [apiary.coordinate_lat, apiary.coordinate_lon];
            return null;
        },
        normalizeColor(raw) {
            const value = (raw || '').trim();
            if (!value) return null;
            return value.startsWith('#') ? value : '#' + value;
        },
        hiveColor(hive, apiary) {
            return this.normalizeColor(hive?.hex_color) || this.normalizeColor(hive?.color) || this.normalizeColor(apiary?.hex_color) || '#FABB13';
        },
        hiveLatLng(hive, apiary, index) {
            if (hive.coordinates && hive.coordinates.length === 2 && hive.coordinates[0] != null) return hive.coordinates;
            if (apiary.coordinate_lat != null && apiary.coordinate_lon != null) return [apiary.coordinate_lat, apiary.coordinate_lon + index / 2000.0];
            return null;
        },
        selectApiary(apiary) {
            this.$emit('select-apiary', apiary.id);
        },
        focusOnApiary(apiaryId) {
            if (!this.leafletMap) return;
            const entry = this.mapApiaries.find(e => e.apiary.id === apiaryId);
            if (!entry) return;
            if (entry.markers.length > 1) {
                const lats = entry.markers.map(m => m.latlng[0]);
                const lngs = entry.markers.map(m => m.latlng[1]);
                const pad = 0.005;
                this.leafletMap.fitBounds([[Math.min(...lats) - pad, Math.min(...lngs) - pad], [Math.max(...lats) + pad, Math.max(...lngs) + pad]], { maxZoom: 16, animate: true });
            } else if (entry.centroid) {
                this.leafletMap.setView(entry.centroid, 14, { animate: true });
            }
        },
        apiaryLabelStyle(apiary) {
            return {
                color: this.normalizeColor(apiary.hex_color) || '#575EAE',
                fontWeight: 'bold',
                fontSize: '13px',
                textDecoration: apiary.id === this.selectedApiaryId ? 'underline' : 'none',
                textShadow: '-1px -1px 0 #333, 1px -1px 0 #333, -1px 1px 0 #333, 1px 1px 0 #333',
                cursor: 'pointer',
            };
        },
        hiveTooltipOptions(apiary) {
            return { permanent: apiary.id === this.selectedApiaryId, interactive: true, direction: 'top', className: 'popup' };
        },
        markerIconUrl(hive, apiary) {
            const color = this.hiveColor(hive, apiary);
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23.54 19.24" width="30" height="30"><rect x="0.09" y="0.09" width="23.35" height="1.63" fill="${color}"/><rect x="1.07" y="2.48" width="21.41" height="13.23" fill="${color}"/><rect x="3.89" y="16.47" width="1.92" height="2.73" fill="${color}"/><rect x="17.84" y="16.47" width="1.92" height="2.73" fill="${color}"/></svg>`;
            return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
        },
    },
    watch: {
        selectedApiaryId(newId) {
            if (newId && this.storeApiaries) this.$nextTick(() => this.focusOnApiary(newId));
        },
        hives: {
            handler(newVal) {
                if (this.storeApiaries) return;
                const withCoords = (newVal || []).filter(h => h.coordinates && h.coordinates.length === 2);
                if (withCoords.length > 0) {
                    const lats = withCoords.map(h => h.coordinates[0]);
                    const lngs = withCoords.map(h => h.coordinates[1]);
                    this.center = [lats.reduce((a, b) => a + b, 0) / lats.length, lngs.reduce((a, b) => a + b, 0) / lngs.length];
                } else if (this.apiary?.coordinate_lat != null) {
                    this.center = [this.apiary.coordinate_lat, this.apiary.coordinate_lon];
                }
            },
            deep: true
        }
    }
}
</script>

<style scoped>
.map-container {
    display: block;
    border-radius: 16px;
    min-height: 30vw;
    position: relative;
}

.map-title {
    display: flex;
    position: absolute;
    top: 0px;
    left: 0;
    z-index: 1;
    gap: 1vw;
    padding: 1%;
    font-size: 1.3vw;
    width: 14%;
}

.map-box {
    min-height: 30vw;
    min-width: 90%;
    border-radius: 16px;
    z-index: 0;
}
</style>