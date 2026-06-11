<template>
    <h2 class="clickable title" @click="expandContentButton">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="clickable imgicon"
            :class="{ rotated180: expanded }" viewBox="0 0 16 16">
            <path fill-rule="evenodd"
                d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
        </svg>
        <svg-icon type="mdi" :path="path" /><span></span><span>Measurements</span>
    </h2>

    <div v-if="expanded" class="measurements-content">
        <div v-if="loading" class="state-msg">Loading measurements…</div>
        <div v-else-if="error" class="state-msg error-msg">{{ error }}</div>
        <div v-else-if="!hasData" class="state-msg">No sensor data available for this hive.</div>
        <div v-else class="charts-grid">
            <div v-for="series in chartSeries" :key="series.key" class="chart-wrap">
                <div class="chart-label">{{ series.label }}</div>
                <canvas :ref="el => canvasRefs[series.key] = el"></canvas>
            </div>
        </div>
    </div>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiChartTimelineVariantShimmer } from '@mdi/js';
import { getSensorMeasurements } from '@/services/api/measurementsApi';
import { Chart, LineController, LineElement, PointElement, LinearScale, TimeScale, Tooltip, Filler, CategoryScale } from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, TimeScale, Tooltip, Filler, CategoryScale);

const SERIES_CONFIG = [
    { key: 't', label: 'Temperature (°C)', color: '#E46268' },
    { key: 'h', label: 'Humidity (%)', color: '#587FC0' },
    { key: 'w', label: 'Weight (kg)', color: '#379C5A' },
    { key: 'bv', label: 'Battery (V)', color: '#E3C323' },
];

export default {
    name: 'Measurements',
    components: { SvgIcon },
    props: {
        hive: Object,
    },
    data() {
        return {
            expanded: false,
            loading: false,
            error: null,
            rawData: null,
            path: mdiChartTimelineVariantShimmer,
            canvasRefs: {},
            chartInstances: {},
        };
    },
    computed: {
        hasData() {
            return this.rawData && this.chartSeries.length > 0;
        },
        chartSeries() {
            if (!this.rawData) return [];
            const measurements = this.rawData.measurements || [];
            return SERIES_CONFIG.filter(s => measurements.some(m => m[s.key] != null));
        },
    },
    methods: {
        async expandContentButton() {
            this.expanded = !this.expanded;
            if (this.expanded && !this.rawData && !this.loading) {
                await this.fetchData();
            }
            if (this.expanded && this.hasData) {
                this.$nextTick(() => this.renderCharts());
            }
        },

        async fetchData() {
            this.loading = true;
            this.error = null;
            try {
                const params = {};
                if (this.hive?.id) params.hive_id = this.hive.id;
                const res = await getSensorMeasurements(params);
                this.rawData = res.data;
            } catch (e) {
                this.error = 'Could not load measurements. The device may not have sent data yet.';
            } finally {
                this.loading = false;
            }
        },

        buildDatasets(seriesKey) {
            const measurements = this.rawData?.measurements || [];
            const points = measurements
                .filter(m => m[seriesKey] != null)
                .map(m => ({ x: m.time, y: m[seriesKey] }));
            return points;
        },

        renderCharts() {
            this.chartSeries.forEach(series => {
                const canvas = this.canvasRefs[series.key];
                if (!canvas) return;

                if (this.chartInstances[series.key]) {
                    this.chartInstances[series.key].destroy();
                }

                const points = this.buildDatasets(series.key);
                const labels = points.map(p => {
                    const d = new Date(p.x * 1000);
                    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric' });
                });
                const values = points.map(p => p.y);

                this.chartInstances[series.key] = new Chart(canvas, {
                    type: 'line',
                    data: {
                        labels,
                        datasets: [{
                            data: values,
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
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                callbacks: {
                                    label: ctx => ctx.parsed.y + ' ' + (series.label.match(/\(([^)]+)\)/)?.[1] || ''),
                                },
                            },
                        },
                        scales: {
                            x: {
                                ticks: {
                                    maxTicksLimit: 6,
                                    maxRotation: 0,
                                    font: { family: 'TwCen, sans-serif', size: 11 },
                                },
                                grid: { color: '#f0f0f0' },
                            },
                            y: {
                                ticks: { font: { family: 'TwCen, sans-serif', size: 11 } },
                                grid: { color: '#f0f0f0' },
                            },
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
.title {
    display: flex;
    gap: 10px;
}

.imgicon {
    fill: rgb(190, 190, 190);
    stroke: rgb(190, 190, 190);
    transition: all 0.15s ease 0s;
}

.measurements-content {
    padding: 8px 0;
}

.state-msg {
    color: #aaa;
    font-size: 1rem;
    padding: 20px 0;
}

.error-msg {
    color: #c43030;
}

.charts-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-top: 12px;
}

.chart-wrap {
    background: #F9FAFE;
    border-radius: 12px;
    padding: 12px 16px;
}

.chart-label {
    font-size: 0.85rem;
    color: #666;
    margin-bottom: 6px;
    font-family: TwCen, sans-serif;
}
</style>