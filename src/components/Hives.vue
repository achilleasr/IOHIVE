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

export default {
    name: 'Hives',
    components: { HiveItem, AddHive },
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
    border-radius: 20px;
    padding: 1rem;
    margin-top: 0.5rem;
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
    flex-shrink: 0;
}

.hives-content {
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    gap: 14px;
}

@media (max-width: 600px) {
    .hives-container {
        border-radius: 16px;
        padding: 16px 20px;
    }

    .hives-title {
        /*height: auto;*/
        font-size: 22px;
    }

    .hives-content {
        /*margin-top: 14px;*/
        gap: 10px;
    }
}
</style>
