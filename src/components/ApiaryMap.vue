<template>
    <div class="map-container">
        <l-map class="map-box" v-model:zoom="zoom" zoomControl=false :center="center" :bounds="bounds"
            :options="{ zoomControl: false }">
            <l-tile-layer :url="url"></l-tile-layer>
            <span v-for="(hive, index) in hives" :key="index">
                <span v-if="hive.coordinates">
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

                <span v-else-if="apiary.coordinate_lat">
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
import L from 'leaflet';

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
        LMap,
        LIcon,
        LTileLayer,
        LMarker,
        LControlLayers,
        LTooltip,
        LControlZoom,
        LPopup,
        LPolyline,
        LPolygon,
        LRectangle,
    },
    props: {
        hives: {
            type: Array,
            default: () => []
        },
        apiary: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {
            path: mdiMapOutline,
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution:
                '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            zoom: 11,
            zoomControl: false,
            center: [37.4385, 14.9139],
            icon: L.icon({
                iconUrl: require('@/assets/Hives/i_hives1.svg'),
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34]
            }),
        }
    },
    computed: {
        bounds() {
            if (this.hives.length > 0 && this.hives[0].coordinates) {
                const lats = this.hives.map((hive) => hive.coordinates[0]);
                const lngs = this.hives.map((hive) => hive.coordinates[1]);
                return [[Math.min(...lats), Math.min(...lngs)], [Math.max(...lats), Math.max(...lngs)]];
            } else if (this.apiary) {
                const lats = this.apiary.coordinate_lat;
                const lngs = this.apiary.coordinate_lon;
                return [[lats, lngs - 0.001 * this.apiary.hives.length], [lats, lngs + 0.001 * this.apiary.hives.length]];
            }
            else {
                return [37.4385, 24.9139];
            }
        }
    },
    methods: {
        hiveColor(hive) {
            let color =
                (hive && hive.hex_color) ||
                (this.apiary && this.apiary.hex_color) ||
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
        if (this.hives.length > 0 && this.hives[0].coordinates) {
            const lats = this.hives.map((hive) => hive.coordinates[0]);
            const lngs = this.hives.map((hive) => hive.coordinates[1]);
            const latAvg = lats.reduce((sum, lat) => sum + lat, 0) / lats.length;
            const lngAvg = lngs.reduce((sum, lng) => sum + lng, 0) / lngs.length;
            this.center = [latAvg, lngAvg];
        } else if (this.apiary) {
            this.center = [this.apiary.coordinate_lat, this.apiary.coordinate_lon];
        }
    },
    watch: {
        hives: {
            handler(newVal, oldVal) {
                if (newVal !== oldVal) {
                    if (this.hives.length > 0 && this.hives[0].coordinates) {
                        const lats = newVal.map((hive) => hive.coordinates[0]);
                        const lngs = newVal.map((hive) => hive.coordinates[1]);
                        const latAvg = lats.reduce((sum, lat) => sum + lat, 0) / lats.length;
                        const lngAvg = lngs.reduce((sum, lng) => sum + lng, 0) / lngs.length;
                        this.center = [latAvg, lngAvg];
                    } else if (this.apiary) {
                        const lats = newVal.map((apiary) => this.apiary.coordinate_lat);
                        const lngs = newVal.map((apiary) => this.apiary.coordinate_lon);
                        const latAvg = lats.reduce((sum, lat) => sum + lat, 0) / lats.length;
                        const lngAvg = lngs.reduce((sum, lng) => sum + lng, 0) / lngs.length;
                        this.center = [latAvg, lngAvg];
                    }
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