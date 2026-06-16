<template>
    <div class="hive-item">
        <span class="green" :style="{ 'background-color': getHiveColor() }" :class="{ 'green-expanded': expanded }">
            <HiveItemMain :hive="hive" @update:expanded="onExpandedChange" />
        </span>

        <span class="white" v-if="expanded">
            <Inspections :hive="hive" />
            <hr class="line" />
            <Measurements :hive="hive" />
            <!-- <hr class="line" /> -->
            <!-- <Alerts :hive="hive" /> -->
        </span>
    </div>
</template>

<script>
import HiveItemMain from './HiveItemMain.vue';
import Inspections from './Inspections.vue';
import Measurements from './Measurements.vue';
import Alerts from './Alerts.vue';

export default {
    name: 'HiveItem',
    components: { HiveItemMain, Inspections, Measurements, Alerts },
    props: {
        hive: Object,
    },
    data() {
        return { expanded: false };
    },
    methods: {
        onExpandedChange(val) { this.expanded = val; },
        getHiveColor() {
            const raw = (this.hive.hex_color && this.hive.hex_color.trim())
                || (this.hive.color && this.hive.color.trim());
            if (!raw) return '#379C5A';
            return raw.startsWith('#') ? raw : '#' + raw;
        },
    },
};
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
    position: relative;
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