<template>
    <div class="hive-item">
        <span class="green" :style="{ 'background-color': hiveColor }" :class="{ expanded }">
            <HiveItemMain :hive="hive" :linkedDevice="linkedDevice" :latest="latest"
                @update:expanded="expanded = $event" @saved="load" />
        </span>
        <span class="white" v-if="expanded">
            <InspectionHistory :inspections="inspections" :loading="loading" :error="error" />
            <template v-if="linkedDevice">
                <hr class="line" />
                <Measurements :linkedDevice="linkedDevice" />
            </template>
        </span>
    </div>
</template>

<script>
import HiveItemMain from './HiveItemMain.vue';
import InspectionHistory from './InspectionHistory.vue';
import Measurements from './Measurements.vue';
import { getIohiveHistory } from '@/services/api/iohiveApi';

export default {
    name: 'HiveItem',
    components: { HiveItemMain, InspectionHistory, Measurements },
    props: { hive: Object },
    data() {
        return { expanded: false, inspections: [], loading: false, error: null };
    },
    computed: {
        linkedDevice() {
            return (this.$store.state.devices || []).find((d) => d.hive_id === this.hive.id) || null;
        },
        latest() { return this.inspections[0] || null; },
        hiveColor() { return this.hive.color || '#379C5A'; },
    },
    mounted() { this.load(); },
    methods: {
        async load() {
            this.loading = true;
            this.error = null;
            try {
                const data = await getIohiveHistory(this.hive.id);
                this.inspections = data?.inspections || [];
            } catch {
                this.error = 'Could not load inspections.';
            } finally {
                this.loading = false;
            }
        },
    },
};
</script>

<style scoped>
.hive-item {
    color: #fff;
    position: relative;
    display: flex;
    gap: .5vw;
    flex-direction: column;
}

.line {
    border: 0;
    border-top: 1px solid rgb(230, 230, 230);
}

.green {
    background-color: #379C5A;
    padding: 10px 30px;
    border-radius: 20px;
}

.green.expanded {
    border-radius: 20px 20px 0 0;
}

.white {
    background-color: #fff;
    color: rgb(190, 190, 190);
    padding: 10px 30px;
    border-radius: 0 0 20px 20px;
}
</style>