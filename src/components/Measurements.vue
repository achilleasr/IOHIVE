<template>
    <h2 class="clickable title" @click="toggleExpanded">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="imgicon"
            :class="{ rotated180: expanded }" viewBox="0 0 16 16">
            <path fill-rule="evenodd"
                d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
        </svg>
        <svg-icon type="mdi" :path="path" />
        <span>Measurements</span>
    </h2>
    <div v-if="expanded" class="measurements-content">
        <DeviceCharts :rawData="rawData" :loading="chartLoading" :error="chartError" @refresh="refresh" />
    </div>
</template>

<script>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiChartTimelineVariantShimmer } from '@mdi/js';
import { getSensorMeasurements } from '@/services/api/measurementsApi';
import DeviceCharts from '@/components/DeviceCharts.vue';

export default {
    name: 'Measurements',
    components: { SvgIcon, DeviceCharts },
    props: {
        hive: Object,
        device: { type: Object, required: true },
        hiveName: { type: String, default: '—' },
        apiaryName: { type: String, default: '—' },
        interval: { type: String, default: 'hour' },
    },
    data() {
        return {
            path: mdiChartTimelineVariantShimmer,
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
                const params = { interval: this.interval, index: 0, relative_interval: true };
                if (this.device.id) params.device_id = this.device.id;
                else if (this.device.hive_id) params.hive_id = this.device.hive_id;
                const res = await getSensorMeasurements(params);
                this.rawData = res.data;
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
.title {
    display: flex;
    align-items: center;
    gap: 10px;
    user-select: none;
}

.imgicon {
    fill: rgb(190, 190, 190);
    stroke: rgb(190, 190, 190);
    transition: transform 0.15s ease;
}

.rotated180 {
    transform: rotate(180deg);
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