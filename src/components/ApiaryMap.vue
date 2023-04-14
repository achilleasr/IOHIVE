<template>
    <div class="map-container">
        <l-map class="map-box" v-model:zoom="zoom" zoomControl=false :center="center" :bounds="bounds"
            :options="{ zoomControl: false }">
            <l-tile-layer :url="url"></l-tile-layer>
            <span v-for="(hive, index) in hives" :key="index">
                <span v-if="hive.coordinates">
                    <l-marker :lat-lng="hive.coordinates">
                        <l-icon :icon-url="require('@/assets/Hives/leaflet_hive1.svg')" :icon-size="[30, 30]" />
                        <l-tooltip :options="{ permanent: true, interactive: true, direction: 'top', className: 'popup' }">
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
                        <l-icon :icon-url="require('@/assets/Hives/leaflet_hive1.svg')" :icon-size="[30, 30]" />
                        <l-tooltip :options="{ permanent: true, interactive: true, direction: 'top', className: 'popup' }">
                            {{ hive.name }}
                        </l-tooltip>
                    </l-marker>

                    <l-marker v-if="hive.alert" :lat-lng="[apiary.coordinate_lat, apiary.coordinate_lon + index / 2000.0]">
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
import axios from 'axios';
import { mapGetters } from 'vuex';

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


const locationsUrl = "https://api.beep.nl/api/locations";


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
            // url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            // url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
            url: 'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png',
            // url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
            // url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
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
            locationsData: null,
        }
    },
    mounted() {
        if (this.loginData) {
            axios.get(locationsUrl, {
                headers: {
                    "Authorization": "Bearer " + this.loginData.api_token,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Accept-language": "en",
                }
            }).then(response => {
                this.locationsData = response.data;
                // console.log(this.locationsData.locations);
            }).catch(error => {
                console.log(error);
            });
        }
    },
    computed: {
        ...mapGetters(['loginData']),
        bounds() {
            if (this.hives.length > 0 && this.hives[0].coordinates) {
                const lats = this.hives.map((hive) => hive.coordinates[0]);
                const lngs = this.hives.map((hive) => hive.coordinates[1]);
                return [[Math.min(...lats), Math.min(...lngs)], [Math.max(...lats), Math.max(...lngs)]];
            } else if (this.apiary) {
                const lats = this.apiary.coordinate_lat;
                const lngs = this.apiary.coordinate_lon;
                return [lats, lngs];
            }
            else {
                return [37.4385, 24.9139];
            }
        }
    },
    created() {
        if (this.hives.length > 0 && this.hives[0].coordinates) {
            const lats = this.hives.map((hive) => hive.coordinates[0]);
            const lngs = this.hives.map((hive) => hive.coordinates[1]);
            const latAvg = lats.reduce((sum, lat) => sum + lat, 0) / lats.length;
            const lngAvg = lngs.reduce((sum, lng) => sum + lng, 0) / lngs.length;
            this.center = [latAvg, lngAvg];
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