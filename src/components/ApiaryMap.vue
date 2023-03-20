<template>
    <div class="map-container">
        <div class="map-title">
            <svg-icon type="mdi" :path="path" />
            <div>Apiary Map</div>
        </div>
    </div>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiMapOutline } from '@mdi/js';

export default {
    name: 'ApiaryMap',
    components: {
        SvgIcon
    },
    data() {
        return {
            path: mdiMapOutline,
        }
    }
}
</script>

<style scoped>
.map-container {
    display: block;
    background-color: #F9FAFE;
    border-radius: 30px;
    min-height: 40vw;
}


.map-title {
    display: flex;
    gap: 1vw;
    padding: 2vw;
    font-size: 1.5vw;
}
</style>