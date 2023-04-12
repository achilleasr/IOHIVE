<template>
    <h2 class="clickable title" @click="expandContentButton">

        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="clickable imgicon"
            :class="{ rotated180: expanded }" viewBox="0 0 16 16">
            <path fill-rule="evenodd"
                d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
        </svg>
        <svg-icon type="mdi" :path="path" /><span></span> <span>Measurements</span>

    </h2>

    <div v-if="expanded" class="measurements-content">
        <span>
            Measurements measurements measurementsmeasurements measurements Lorem ipsum dolor sit amet consectetur
            adipisicing
            elit. Ea corporis
            voluptatem explicabo aliquid rerum, eligendi placeat voluptate reprehenderit magni eos recusandae, facilis rem
            ipsam fugiat animi nihil dolor unde corrupti?
        </span>
        <div class="mongo-data-flex">
            <iframe style="background: rgb(12, 12, 22); border: none; border-radius: 20px;" class="mongo-box"
                src="https://charts.mongodb.com/charts-project-0-votne/embed/charts?id=6435cd46-56c3-4850-8b2a-25520a68ed52&maxDataAge=3600&theme=dark&autoRefresh=true">
            </iframe>

            <iframe style="border: none;" class="mongo-box"
                src="https://charts.mongodb.com/charts-project-0-votne/embed/charts?id=6435cec1-5436-4f76-8cb9-97163cb0686c&maxDataAge=3600&theme=light&autoRefresh=true">
            </iframe>
        </div>
    </div>
</template>


<script>

import SvgIcon from '@jamescoyle/vue-icon';
import { mdiChartTimelineVariantShimmer } from '@mdi/js';

export default {
    name: 'Measurements',
    components: {
        SvgIcon,
    },
    data() {
        return {
            expanded: false,
            path: mdiChartTimelineVariantShimmer,
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
    display: flex;
    gap: 10px;
}

.imgicon {
    fill: rgb(190, 190, 190);
    stroke: rgb(190, 190, 190);
    transition: all 0.15s ease 0s;
}

.mongo-data-flex {
    display: flex;
    gap: 10px;
    color: black;
    margin: 20px 0px;
}

.mongo-box {
    flex: 1;
    aspect-ratio: 1;
}
</style>