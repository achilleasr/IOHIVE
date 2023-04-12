<template>
    <h2 class="clickable title" @click="expandContentButton">

        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="clickable imgicon"
            :class="{ rotated180: expanded }" viewBox="0 0 16 16">
            <path fill-rule="evenodd"
                d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
        </svg>

        <svg-icon type="mdi" :path="path" /><span></span> <span>Alerts</span>
    </h2>


    <div class="alerts-content" v-if="expanded">
        Alerts alerts alerts alerts alerts Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Ea corporis
        voluptatem explicabo aliquid rerum, eligendi placeat voluptate reprehenderit magni eos recusandae, facilis rem
        ipsam fugiat animi nihil dolor unde corrupti?
        <!-- <AlertItem /> -->
        <AlertItem v-for="(alert, index) in alerts" :key="index" :alert="alert" />
    </div>
</template>


<script>
import AlertItem from './AlertItem.vue';


import SvgIcon from '@jamescoyle/vue-icon';
import { mdiAlertCircleOutline } from '@mdi/js';

export default {
    name: 'Alerts',
    props: {
        alerts: Array,
    },
    components: {
        AlertItem, SvgIcon,
    },
    data() {
        return {
            expanded: false,
            path: mdiAlertCircleOutline,
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

.alerts-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
}
</style>