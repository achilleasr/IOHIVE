<template>
    <div class="hive-item">
        <span class="green" :style="{ 'background-color': getHiveColor() }" :class="{ 'green-expanded': expanded }">
            <HiveItemMain :hive="hive" @update:expanded="onExpandedChange" />
            <HiveGrid v-if="expanded" />
        </span>
        <span class="white" v-if="expanded">
            <Inspections :inspections="hive.inspections" />
            <hr class="line" />
            <Measurements />
            <hr class="line" />
            <Alerts :alerts="hive.inspections" />
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
        getHiveColor() {
            if (this.hive.color) {
                return this.hive.color;
            }
            else {
                return '#379C5A';
            }
        }
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

.line {
    border: 0px;
    border-top: rgb(230, 230, 230) solid 1px;
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
    padding: 0px;
    padding: 10px 30px;
    border-radius: 0px 0px 20px 20px;
}
</style>