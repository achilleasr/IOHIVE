<template>
    <div class="hives-container">
        <span id="hives"></span>
        <div class="hives-title">
            <div class="hives-title-left">
                <svg class="hives-icon" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" y="0.5" width="15" height="7" />
                    <rect x="0.5" y="7.5" width="15" height="7" />
                    <line x1="6" y1="3.5" x2="10" y2="3.5" />
                    <line x1="6" y1="10.5" x2="10" y2="10.5" />
                </svg>
                <h5>Hives</h5>
            </div>
            <AddApiaryInspection v-if="loginData && hives && hives.length" :hives="hives" />
        </div>

        <div class="hives-content">
            <HiveItem v-for="hive in hives" :key="hive.id" :hive="hive" :location-coords="locationCoords" />
            <AddHive v-if="loginData && locationId" :locationId="locationId" />
        </div>
        <span id="devices"></span>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import HiveItem from './HiveItem.vue';
import AddHive from './AddHive.vue';
import AddApiaryInspection from './AddApiaryInspection.vue';

export default {
    name: 'Hives',
    components: { HiveItem, AddHive, AddApiaryInspection },
    props: {
        hives: Array,
        locationId: Number,
        locationCoords: Array,
    },
    computed: {
        ...mapState(['loginData']),
    },
};
</script>

<style scoped>
.hives-container {
    background-color: #F9FAFE;
    border-radius: 30px;
    padding: 20px 40px;
    margin-top: 1em;
}

.hives-container svg {
    stroke: var(--stroke-color);
    height: auto;
}

.hives-title {
    height: 30px;
    font-size: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
}

.hives-title-left {
    display: flex;
    align-items: center;
    gap: 14px;
}

.hives-icon {
    height: 20px;
    width: 20px;
}

.hives-content {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
}
</style>