<template>
    <h2 class="clickable title" @click="expandContentButton">

        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="imgicon"
            :class="{ rotated180: expanded }" viewBox="0 0 16 16">
            <path fill-rule="evenodd"
                d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
        </svg>
        Previous Inspections
    </h2>

    <div v-if="expanded" class="inspections-content">
        <InspectionItem v-for="(inspection, index) in inspections" :key="index" :inspection="inspection" />
    </div>
</template>

<script>
import InspectionItem from './InspectionItem.vue';

export default {
    name: 'Inspections',
    props: {
        hive: Object,
        inspections: Array,
    },
    components: {
        InspectionItem,
    },
    data() {
        return {
            expanded: false,
        }
    },
    methods: {
        expandContentButton() {
            this.expanded = !this.expanded;
        }
    }
}
</script>

<style scoped>
.title {
    /* height: 2vw; */
}

.imgicon {
    fill: rgb(190, 190, 190);
    stroke: rgb(190, 190, 190);
    transition: all 0.15s ease 0s;
}

.inspections-content {
    /* background-color: red; */
    display: flex;
    flex-direction: column;
    gap: 4px;
}
</style>