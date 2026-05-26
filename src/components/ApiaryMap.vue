<template>
    <div class="map-container">
        <l-map class="map-box" v-model:zoom="zoom" :center="center" :bounds="bounds" :options="{ zoomControl: false }">
            <l-tile-layer :url="url"></l-tile-layer>
            <span v-for="(hive, index) in hives" :key="index">
                <span v-if="hive.coordinates && hive.coordinates.length === 2">
                    <l-marker :lat-lng="hive.coordinates">
                        <l-icon :icon-url="markerIconUrl(hive)" :icon-size="[30, 30]" />
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
                        <l-icon :icon-url="markerIconUrl(hive)" :icon-size="[30, 30]" />
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

import {
    LMap,
    LIcon,
    LTileLayer,
    LMarker,
    LControlLayers,
    LTooltip,
    LPopup,
    LPolyline,
    LControlZoom,
    LPolygon,
    LRectangle,
} from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";

export default {
    name: 'ApiaryMap',
    components: {
        SvgIcon,
        LMap, LIcon, LTileLayer, LMarker, LControlLayers,
        LTooltip, LControlZoom, LPopup, LPolyline, LPolygon, LRectangle,
    },
    props: {
        hives: {
            type: Array,
            default: () => []
        },
        apiary: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            path: mdiMapOutline,
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            zoom: 11,
            center: [37.4385, 24.9139],
        };
    },
    computed: {
        bounds() {
            const hivesWithCoords = (this.hives || []).filter(
                h => h.coordinates && h.coordinates.length === 2 &&
                    h.coordinates[0] != null && h.coordinates[1] != null
            );

            if (hivesWithCoords.length > 0) {
                const lats = hivesWithCoords.map(h => h.coordinates[0]);
                const lngs = hivesWithCoords.map(h => h.coordinates[1]);
                const pad = 0.005;
                return [
                    [Math.min(...lats) - pad, Math.min(...lngs) - pad],
                    [Math.max(...lats) + pad, Math.max(...lngs) + pad]
                ];
            }

            const lat = this.apiary?.coordinate_lat;
            const lng = this.apiary?.coordinate_lon;
            if (lat != null && lng != null && !isNaN(lat) && !isNaN(lng)) {
                const hiveCount = this.apiary?.hives?.length ?? 0;
                const spread = Math.max(0.0001 * hiveCount, 0.02);
                return [
                    [lat - spread, lng - spread],
                    [lat + spread, lng + spread]
                ];
            }

            return [[35.0, 20.0], [42.0, 28.0]];
        }
    },
    methods: {
        hiveColor(hive) {
            let color =
                (hive && hive.color) ||
                '#FABB13';
            if (typeof color === 'string' && !color.startsWith('#')) {
                color = '#' + color;
            }
            return color;
        },

        markerIconUrl(hive) {
            const color = this.hiveColor(hive);
            const svg =
                `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23.54 19.24" width="30" height="30">` +
                `<rect x="0.09" y="0.09" width="23.35" height="1.63" fill="${color}"/>` +
                `<rect x="1.07" y="2.48" width="21.41" height="13.23" fill="${color}"/>` +
                `<rect x="3.89" y="16.47" width="1.92" height="2.73" fill="${color}"/>` +
                `<rect x="17.84" y="16.47" width="1.92" height="2.73" fill="${color}"/>` +
                `</svg>`;
            return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
        },
    },
    created() {
        const hivesWithCoords = (this.hives || []).filter(
            h => h.coordinates && h.coordinates.length === 2
        );
        if (hivesWithCoords.length > 0) {
            const lats = hivesWithCoords.map(h => h.coordinates[0]);
            const lngs = hivesWithCoords.map(h => h.coordinates[1]);
            this.center = [
                lats.reduce((a, b) => a + b, 0) / lats.length,
                lngs.reduce((a, b) => a + b, 0) / lngs.length
            ];
        } else if (this.apiary?.coordinate_lat != null && this.apiary?.coordinate_lon != null) {
            this.center = [this.apiary.coordinate_lat, this.apiary.coordinate_lon];
        }
    },
    watch: {
        hives: {
            handler(newVal) {
                const hivesWithCoords = (newVal || []).filter(
                    h => h.coordinates && h.coordinates.length === 2
                );
                if (hivesWithCoords.length > 0) {
                    const lats = hivesWithCoords.map(h => h.coordinates[0]);
                    const lngs = hivesWithCoords.map(h => h.coordinates[1]);
                    this.center = [
                        lats.reduce((a, b) => a + b, 0) / lats.length,
                        lngs.reduce((a, b) => a + b, 0) / lngs.length
                    ];
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