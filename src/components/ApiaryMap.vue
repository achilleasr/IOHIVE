<template>
    <div class="map-container">
        <l-map ref="map" class="map-box" v-model:zoom="zoom" :center="center">
            <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base" name="OpenStreetMap">
                <l-marker :lat-lng="markerLatLng"></l-marker>
            </l-tile-layer>
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

import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";


export default {
    name: 'ApiaryMap',
    components: {
        SvgIcon, LMap,
        LTileLayer,
        LMarker
    },
    data() {
        return {
            path: mdiMapOutline,
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            attribution:
                '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            zoom: 11,
            center: [37.4385, 24.9139],
            markerLatLng: [37.4385, 24.9139],

        }
    },
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
    top: -40px;
    left: 0;
    z-index: 1;
    gap: 1vw;
    padding: 5%;
    font-size: 1.5vw;
    width: 90%;
    background: linear-gradient(0deg, rgba(155, 155, 155, 0) 0%, rgba(255, 255, 255, 1) 100%);
}

.map-box {
    min-height: 30vw;
    min-width: 90%;
    border-radius: 16px;
    z-index: 0;
}
</style>