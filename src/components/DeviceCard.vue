<template>
    <div class="device-card">
        <div class="device-header">
            <div class="device-info">
                <h3 class="device-name">
                    {{ device.name || 'Unnamed device' }}
                    <span :class="['status-dot', isOnline ? 'online' : 'offline']"
                        :title="isOnline ? 'Online' : 'Offline'"></span>
                </h3>
                <div class="device-meta">
                    <span class="meta-row"><strong>Hive:</strong> {{ hiveName }}</span>
                    <span class="meta-row"><strong>Apiary:</strong> {{ apiaryName }}</span>
                    <span v-if="device.hardware_id" class="meta-row hw"><strong>Hardware ID:</strong> {{
                        device.hardware_id
                        }}</span>
                </div>
                <div class="last-seen">
                    {{ lastSeenText }}
                </div>
            </div>
            <button class="expand-btn" @click="toggleExpanded">
                {{ expanded ? 'Hide charts' : 'Show charts' }}
            </button>
        </div>

        <div v-if="expanded" class="device-body">
            <DeviceCharts :rawData="rawData" :loading="chartLoading" :error="chartError" @refresh="refresh" />
        </div>
    </div>
</template>

<script>
import { getSensorMeasurements } from '@/services/api/measurementsApi';
import DeviceCharts from '@/components/DeviceCharts.vue';

export default {
    name: 'DeviceCard',
    components: { DeviceCharts },
    props: {
        device: { type: Object, required: true },
        hiveName: { type: String, default: '—' },
        apiaryName: { type: String, default: '—' },
        interval: { type: String, default: 'hour' },
    },
    data() {
        return {
            expanded: false,
            chartLoading: false,
            chartError: null,
            rawData: null,
        };
    },
    watch: {
        interval() {
            if (this.expanded) {
                this.rawData = null;
                this.fetchData();
            }
        },
    },
    computed: {
        isOnline() {
            const ts = this.device.last_message_received;
            if (!ts) return false;
            const last = new Date(ts.replace(' ', 'T'));
            return (Date.now() - last) < 6 * 60 * 60 * 1000;
        },
        lastSeenText() {
            const ts = this.device.last_message_received;
            if (!ts) return 'Never received data';
            const date = new Date(ts.replace(' ', 'T'));
            const formatted = date.toLocaleString('en-GB', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }).replace(',', '');
            return 'Last data: ' + formatted;
        },
    },
    methods: {
        async toggleExpanded() {
            this.expanded = !this.expanded;
            if (this.expanded && !this.rawData && !this.chartLoading) {
                await this.fetchData();
            }
        },
        async refresh() {
            this.rawData = null;
            await this.fetchData();
        },
        async fetchData() {
            this.chartLoading = true;
            this.chartError = null;
            try {
                const params = { interval: this.interval, index: 0 };
                if (this.device.id) params.device_id = this.device.id;
                else if (this.device.hive_id) params.hive_id = this.device.hive_id;
                const res = await getSensorMeasurements(params);
                this.rawData = res.data;
                console.log('Fetched measurements for device', this.device.id, this.rawData);
            } catch {
                this.chartError = 'Could not load measurements for this device.';
            } finally {
                this.chartLoading = false;
            }
        },
    },
};
</script>

<style scoped>
.device-card {
    background: #F9FAFE;
    border-radius: 16px;
    padding: 20px 24px;
    border: 1px solid #ececf5;
}

.device-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
}

.device-info {
    flex: 1;
    min-width: 0;
}

.device-name {
    margin: 0 0 6px;
    font-size: 1.2rem;
    color: #333;
    display: flex;
    align-items: center;
    gap: 10px;
}

.status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
}

.status-dot.online {
    background: #379C5A;
    box-shadow: 0 0 6px #379C5A88;
}

.status-dot.offline {
    background: #ccc;
}

.device-meta {
    display: flex;
    gap: 18px;
    flex-wrap: wrap;
    font-size: 0.88rem;
    color: #666;
    margin-bottom: 4px;
}

.meta-row strong {
    color: #888;
    font-weight: normal;
    margin-right: 4px;
}

.hw {
    font-family: monospace;
    font-size: 0.78rem;
    opacity: 0.6;
}

.last-seen {
    font-size: 0.82rem;
    color: #999;
    font-style: italic;
    margin-top: 2px;
}

.expand-btn {
    background: white;
    border: 1px solid #ddd;
    border-radius: 100px;
    padding: 8px 18px;
    font-family: TwCen, sans-serif;
    font-size: 0.9rem;
    color: #555;
    cursor: pointer;
    transition: all 0.15s;
    flex-shrink: 0;
}

.expand-btn:hover {
    background: #f5f6ff;
    border-color: #575EAE;
    color: #575EAE;
}

.device-body {
    margin-top: 18px;
    padding-top: 16px;
    border-top: 1px solid #ececf5;
}

.state-msg {
    color: #999;
    padding: 14px 0;
    font-size: 0.92rem;
}

.state-msg.error {
    color: #c43030;
}

.charts-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
}

.chart-wrap {
    background: white;
    border-radius: 12px;
    padding: 12px 16px;
    border: 1px solid #ececf5;
}

.chart-label {
    font-size: 0.85rem;
    color: #666;
    margin-bottom: 6px;
}

.body-toolbar {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 12px;
}

.refresh-btn {
    background: white;
    border: 1px solid #ddd;
    border-radius: 100px;
    padding: 5px 14px;
    font-family: TwCen, sans-serif;
    font-size: 0.82rem;
    color: #555;
    cursor: pointer;
    transition: all 0.15s;
}

.refresh-btn:hover:not(:disabled) {
    background: #f5f6ff;
    border-color: #575EAE;
    color: #575EAE;
}

.refresh-btn:disabled {
    opacity: 0.5;
    cursor: default;
}

@media (max-width: 700px) {
    .charts-grid {
        grid-template-columns: 1fr;
    }
}
</style>