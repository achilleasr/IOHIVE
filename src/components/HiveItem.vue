<template>
    <div class="hive-item">
        <span class="green" :class="{ 'green-expanded': expanded }">
            <HiveItemMain :hive="hive" @update:expanded="onExpandedChange" />
            <HiveGrid v-if="expanded" />
        </span>
        <span class="white" v-if="expanded">
            <Inspections :inspections="hive.inspections" />
            <Measurements />
            <Alerts />
        </span>
    </div>
</template>

<script>
import HiveGrid from './HiveGrid.vue';
import Inspections from './Inspections.vue';
import Measurements from './Measurements.vue';
import Alerts from './Alerts.vue';
import HiveItemMain from './HiveItemMain.vue';

export default {
    name: 'HiveItem',
    components: {
        HiveItemMain, HiveGrid, Inspections, Measurements, Alerts,

    },
    props: {
        hive: Object,
    },
    data() {
        return {
            expanded: false,
        }
    },
    methods: {
        onExpandedChange(newExpandedValue) {
            this.expanded = newExpandedValue;
        },
    },
}
</script>
<style scoped>
.hive-item {
    color: white;
    position: relative;
    display: flex;
    gap: 0.5vw;
    flex-direction: column;
}

.green {
    background-color: #379C5A;
    padding: 10px 30px;
    border-radius: 20px;
}

.green-expanded {
    border-radius: 20px 20px 0px 0px;
}

.white {
    background-color: white;
    color: rgb(190, 190, 190);
    padding: 10px 30px;
    border-radius: 0px 0px 20px 20px;
}
</style>