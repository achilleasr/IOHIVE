<template>
    <div class="devices-page">
        <h2>Devices</h2>
        <p class="subtitle">All sensors connected to your apiaries.</p>

        <div v-if="loading" class="state-msg">Loading devices…</div>
        <div v-else-if="!deviceList.length" class="state-msg">No devices found on your account.</div>

        <div v-else class="device-list">
            <DeviceCard v-for="device in deviceList" :key="device.id" :device="device" :hive-name="hiveName(device)"
                :apiary-name="apiaryName(device)" />
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import DeviceCard from '@/components/DeviceCard.vue';

export default {
    name: 'PageDevices',
    components: { DeviceCard },
    computed: {
        ...mapState(['devices', 'locations', 'loginData', 'apiariesStatus']),
        loading() {
            return this.apiariesStatus === 'loading' && !this.devices;
        },
        deviceList() {
            return Array.isArray(this.devices) ? this.devices : [];
        },
        hivesById() {
            const map = {};
            for (const loc of this.locations?.locations || []) {
                for (const h of loc.hives || []) map[h.id] = { hive: h, apiary: loc };
            }
            return map;
        },
    },
    methods: {
        hiveName(device) {
            return this.hivesById[device.hive_id]?.hive?.name || '—';
        },
        apiaryName(device) {
            return this.hivesById[device.hive_id]?.apiary?.name || '—';
        },
    },
    mounted() {
        if (this.loginData && !this.devices) {
            this.$store.dispatch('loadApiaries');
        }
    },
};
</script>

<style scoped>
.devices-page {
    color: #333;
    padding-bottom: 4vh;
}

h2 {
    margin: 0 0 6px;
}

.subtitle {
    color: #888;
    margin: 0 0 24px;
    font-size: 0.95rem;
}

.state-msg {
    color: #888;
    padding: 30px 0;
    font-style: italic;
}

.device-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
</style>