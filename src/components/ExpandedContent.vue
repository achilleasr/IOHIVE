<template>
    <div class="hive-item-expanded-content" v-if="expanded">
        <HiveGrid />
        <Inspections />
        <Measurements />
        <Alerts />
    </div>
</template>
<script>
import HiveGrid from './HiveGrid.vue';
import Inspections from './Inspections.vue';
import Measurements from './Measurements.vue';
import Alerts from './Alerts.vue';

export default {
    name: 'ExpandedContent',
    components: {
        HiveGrid, Inspections, Measurements, Alerts,
    },
    props: {
        expanded: Boolean,
    }
}
</script>
<style scoped>
.hive-item-expanded-content {
    transition: all 0.15s ease 0s;
}
</style>