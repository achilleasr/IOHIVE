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
                    <span v-if="device.hardware_id" class="meta-row hw"><strong>HW:</strong> {{ device.hardware_id
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
            <div v-if="chartLoading" class="state-msg">Loading measurements…</div>
            <div v-else-if="chartError" class="state-msg error">{{ chartError }}</div>
            <div v-else-if="!chartSeries.length" class="state-msg">No measurement data available.</div>
            <div v-else class="charts-grid">
                <div v-for="series in chartSeries" :key="series.key" class="chart-wrap">
                    <div class="chart-label">{{ series.label }}</div>
                    <canvas :ref="el => canvasRefs[series.key] = el"></canvas>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getSensorMeasurements } from '@/services/api/measurementsApi';
import {
    Chart, LineController, LineElement, PointElement,
    LinearScale, Tooltip, Filler, CategoryScale,
} from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, Tooltip, Filler, CategoryScale);

const SERIES_CONFIG = [
    { key: 't', label: 'Temperature (°C)', color: '#E46268' },
    { key: 'h', label: 'Humidity (%)', color: '#587FC0' },
    { key: 'w', label: 'Weight (kg)', color: '#379C5A' },
    { key: 'bv', label: 'Battery (V)', color: '#E3C323' },
    { key: 's_tot', label: 'Sound (dB)', color: '#B575CF' },
    { key: 'p', label: 'Pressure (hPa)', color: '#3CA9A9' },
];

export default {
    name: 'DeviceCard',
    props: {
        device: { type: Object, required: true },
        hiveName: { type: String, default: '—' },
        apiaryName: { type: String, default: '—' },
    },
    data() {
        return {
            expanded: false,
            chartLoading: false,
            chartError: null,
            rawData: null,
            canvasRefs: {},
            chartInstances: {},
        };
    },
    computed: {
        isOnline() {
            const ts = this.device.last_message_received;
            if (!ts) return false;
            const last = new Date(ts * 1000);
            return (Date.now() - last) < 7 * 24 * 60 * 60 * 1000;
        },
        lastSeenText() {
            const ts = this.device.last_message_received;
            if (!ts) return 'Never received data';
            const d = new Date(ts * 1000);
            return 'Last data: ' + d.toLocaleString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: 'numeric', minute: 'numeric', hour12: true,
            });
        },
        chartSeries() {
            if (!this.rawData) return [];
            const measurements = this.rawData.measurements || [];
            return SERIES_CONFIG.filter(s => measurements.some(m => m[s.key] != null));
        },
    },
    methods: {
        async toggleExpanded() {
            this.expanded = !this.expanded;
            if (this.expanded && !this.rawData && !this.chartLoading) {
                await this.fetchData();
            }
            if (this.expanded && this.chartSeries.length) {
                this.$nextTick(() => this.renderCharts());
            }
        },
        async fetchData() {
            this.chartLoading = true;
            this.chartError = null;
            try {
                const params = {};
                if (this.device.hive_id) params.hive_id = this.device.hive_id;
                else if (this.device.id) params.device_id = this.device.id;
                const res = await getSensorMeasurements(params);
                this.rawData = res.data;
                this.$nextTick(() => this.renderCharts());
            } catch {
                this.chartError = 'Could not load measurements for this device.';
            } finally {
                this.chartLoading = false;
            }
        },
        renderCharts() {
            this.chartSeries.forEach(series => {
                const canvas = this.canvasRefs[series.key];
                if (!canvas) return;
                if (this.chartInstances[series.key]) this.chartInstances[series.key].destroy();
                const measurements = this.rawData?.measurements || [];
                const points = measurements.filter(m => m[series.key] != null);
                const labels = points.map(p => {
                    const d = new Date(p.time * 1000);
                    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric' });
                });
                this.chartInstances[series.key] = new Chart(canvas, {
                    type: 'line',
                    data: {
                        labels,
                        datasets: [{
                            data: points.map(p => p[series.key]),
                            borderColor: series.color,
                            backgroundColor: series.color + '22',
                            fill: true,
                            tension: 0.3,
                            pointRadius: points.length > 60 ? 0 : 3,
                            borderWidth: 2,
                        }],
                    },
                    options: {
                        responsive: true,
                        plugins: { legend: { display: false } },
                        scales: {
                            x: { ticks: { maxTicksLimit: 6, maxRotation: 0, font: { family: 'TwCen, sans-serif', size: 11 } }, grid: { color: '#f0f0f0' } },
                            y: { ticks: { font: { family: 'TwCen, sans-serif', size: 11 } }, grid: { color: '#f0f0f0' } },
                        },
                    },
                });
            });
        },
    },
    beforeUnmount() {
        Object.values(this.chartInstances).forEach(c => c.destroy());
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

@media (max-width: 700px) {
    .charts-grid {
        grid-template-columns: 1fr;
    }
}
</style>