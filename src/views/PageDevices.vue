<template>
    <div class="devices-page">
        <h2>Devices</h2>
        <p class="subtitle">All sensors connected to your apiaries.</p>

        <div class="interval-bar">
            <span class="interval-label">Time range:</span>
            <button v-for="opt in intervalOptions" :key="opt.value" class="interval-btn"
                :class="{ active: selectedInterval === opt.value }" @click="selectedInterval = opt.value">
                {{ opt.label }}
            </button>
        </div>

        <div v-if="loading" class="state-msg">Loading devices…</div>
        <div v-else-if="!deviceList.length" class="state-msg">No devices found on your account.</div>

        <div v-else class="device-list">
            <DeviceCard v-for="device in deviceList" :key="device.id" :device="device" :hive-name="hiveName(device)"
                :apiary-name="apiaryName(device)" :interval="selectedInterval" />
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import DeviceCard from '@/components/DeviceCard.vue';

export default {
    name: 'PageDevices',
    components: { DeviceCard },
    data() {
        return {
            selectedInterval: 'day',
            intervalOptions: [
                { value: 'hour', label: 'Hour' },
                { value: 'day', label: 'Day' },
                { value: 'week', label: 'Week' },
                { value: 'month', label: 'Month' },
                { value: 'year', label: 'Year' },
            ],
        };
    },
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
    margin: 0 0 20px;
    font-size: 0.95rem;
}

.interval-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 24px;
    flex-wrap: wrap;
}

.interval-label {
    font-size: 0.88rem;
    color: #888;
    margin-right: 4px;
}

.interval-btn {
    background: white;
    border: 1px solid #ddd;
    border-radius: 100px;
    padding: 6px 16px;
    font-family: TwCen, sans-serif;
    font-size: 0.88rem;
    color: #555;
    cursor: pointer;
    transition: all 0.15s;
}

.interval-btn:hover {
    background: #f5f6ff;
    border-color: #575EAE;
    color: #575EAE;
}

.interval-btn.active {
    background: #575EAE;
    border-color: #575EAE;
    color: white;
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