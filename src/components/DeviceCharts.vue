<template>
    <div class="device-charts">
        <div class="body-toolbar">
            <button class="refresh-btn" @click="$emit('refresh')" :disabled="loading">
                {{ loading ? 'Refreshing…' : 'Refresh' }}
            </button>
        </div>
        <div v-if="loading" class="state-msg">Loading measurements…</div>
        <div v-else-if="error" class="state-msg error">{{ error }}</div>
        <div v-else>
            <div v-if="!chartSeries.length" class="state-msg">No measurement data available.</div>
            <div v-else class="charts-grid">
                <div v-for="series in chartSeries" :key="series.key" :ref="el => chartContainers[series.key] = el"
                    class="chart-wrap"></div>
            </div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    ToolboxComponent,
} from 'echarts/components';
import { LegacyGridContainLabel } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
    LineChart,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    ToolboxComponent,
    CanvasRenderer,
    LegacyGridContainLabel,
]);

const SERIES_CONFIG = [
    { key: 't', label: 'Temperature (°C)', color: '#E46268' },
    { key: 't_0', label: 'Ambient Temp (°C)', color: '#EAA94E' },
    { key: 'h', label: 'Humidity (%)', color: '#587FC0' },
    { key: 'weight_kg', label: 'Weight (kg)', color: '#379C5A' },
    { key: 'bv', label: 'Battery (V)', color: '#E3C323' },
    { key: 's_tot', label: 'Sound (dB)', color: '#B575CF' },
    { key: 'p', label: 'Pressure (hPa)', color: '#3CA9A9' },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function pad(n) {
    return String(n).padStart(2, '0');
}

// Converts a UTC ISO string to a local-time display label
function toLocalLabel(isoString) {
    const d = new Date(isoString);
    return `${d.getDate()} ${MONTHS[d.getMonth()]}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default {
    name: 'DeviceCharts',
    emits: ['refresh'],
    props: {
        rawData: { type: Object, default: null },
        loading: { type: Boolean, default: false },
        error: { type: String, default: null },
    },
    data() {
        return {
            chartContainers: {},
            chartInstances: {},
        };
    },
    computed: {
        chartSeries() {
            if (!this.rawData) return [];
            const measurements = this.rawData.measurements || [];
            return SERIES_CONFIG.filter(s => measurements.some(m => m[s.key] != null));
        },
    },
    watch: {
        rawData: {
            handler() {
                this.$nextTick(() => this.renderCharts());
            },
        },
        loading(val) {
            if (!val && this.rawData) {
                this.$nextTick(() => this.renderCharts());
            }
        },
    },
    methods: {
        renderCharts() {
            this.destroyCharts();
            if (!this.rawData || !this.chartSeries.length) return;

            const measurements = this.rawData.measurements || [];

            // The API already returns every minute slot (with nulls for gaps).
            // Just convert timestamps to local-time labels and use values as-is.
            const times = measurements.map(m => toLocalLabel(m.time));

            this.chartSeries.forEach(series => {
                const container = this.chartContainers[series.key];
                if (!container) return;

                const values = measurements.map(m => m[series.key] ?? null);
                const nonNullCount = values.filter(v => v !== null).length;

                const instance = echarts.init(container);
                this.chartInstances[series.key] = instance;

                instance.setOption({
                    title: {
                        text: series.label,
                        textStyle: { fontFamily: 'TwCen, sans-serif', fontSize: 13, fontWeight: '600', color: '#333' },
                        top: 6,
                        left: 8,
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { type: 'cross', label: { backgroundColor: series.color } },
                        formatter(params) {
                            const p = params[0];
                            if (p.value == null) return '';
                            return `${p.axisValue}<br/><b>${p.value}</b>`;
                        },
                    },
                    toolbox: {
                        right: 8,
                        top: 4,
                        feature: {
                            restore: { title: 'Reset zoom' },
                        },
                        iconStyle: { borderColor: '#999' },
                    },
                    grid: { left: 12, right: 12, bottom: 24, top: 48, containLabel: true },
                    xAxis: {
                        type: 'category',
                        data: times,
                        axisLabel: {
                            fontFamily: 'TwCen, sans-serif',
                            fontSize: 11,
                            color: '#666',
                            rotate: 0,
                            interval: Math.max(0, Math.floor(times.length / 6) - 1),
                        },
                        axisLine: { lineStyle: { color: '#e0e0e0' } },
                        splitLine: { show: false },
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: { fontFamily: 'TwCen, sans-serif', fontSize: 11, color: '#666' },
                        splitLine: { lineStyle: { color: '#f0f0f0' } },
                    },
                    series: [{
                        type: 'line',
                        data: values,
                        smooth: 0.3,
                        connectNulls: false,
                        symbol: nonNullCount > 60 ? 'none' : 'circle',
                        symbolSize: 4,
                        lineStyle: { color: series.color, width: 2 },
                        itemStyle: { color: series.color },
                        areaStyle: { color: series.color + '22' },
                    }],
                });
            });

            window.addEventListener('resize', this.resizeCharts);
        },
        resizeCharts() {
            Object.values(this.chartInstances).forEach(c => c.resize());
        },
        destroyCharts() {
            Object.values(this.chartInstances).forEach(c => c.dispose());
            this.chartInstances = {};
            window.removeEventListener('resize', this.resizeCharts);
        },
    },
    beforeUnmount() {
        this.destroyCharts();
    },
};
</script>

<style scoped>
.chart-wrap {
    height: 220px;
}
</style>