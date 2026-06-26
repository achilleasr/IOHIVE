<template>
    <h2 class="clickable title" @click="expandContentButton">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="clickable imgicon"
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
import DeviceCharts from './DeviceCharts.vue';
import { getSensorMeasurements } from '@/services/api/measurementsApi';

export default {
    name: 'Measurements',
    components: {
        SvgIcon,
        DeviceCharts,
    },
    props: {
        linkedDevice: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            expanded: false,
            path: mdiChartTimelineVariantShimmer,
            rawData: null,
            chartLoading: false,
            chartError: null,
        }
    },
    methods: {
        expandContentButton() {
            this.expanded = !this.expanded;
            if (this.expanded && !this.rawData && !this.chartLoading) {
                this.fetchData();
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
                const params = { interval: 'hour', index: 0 };
                if (this.linkedDevice.id) params.device_id = this.linkedDevice.id;
                else if (this.linkedDevice.hive_id) params.hive_id = this.linkedDevice.hive_id;
                const res = await getSensorMeasurements(params);
                this.rawData = res.data;
            } catch {
                this.chartError = 'Could not load measurements for this device.';
            } finally {
                this.chartLoading = false;
            }
        },
    },
}
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
    margin-top: 10px;
}
</style>