<template>
    <h2 class="clickable title" @click="expandContentButton">

        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="imgicon"
            :class="{ rotated180: expanded }" viewBox="0 0 16 16">
            <path fill-rule="evenodd"
                d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
        </svg>
        <svg-icon type="mdi" :path="path" /><span></span> <span>Previous Inspections </span>
    </h2>

    <div v-if="expanded" class="inspections-content">
        <!-- {{ hive.id }} -->
        <span v-if="inspectionsData">
            <div v-for="(inspection, index) in inspectionsData.inspections.data" :key="index"> {{ 'Created at: ' +
                inspection.created_at + " impression : " + inspection.impression
            }}
            </div>
        </span>
        <InspectionItem v-for="(inspection, index) in inspections" :key="index" :inspection="inspection" />
    </div>
</template>

<script>
import InspectionItem from './InspectionItem.vue';

import SvgIcon from '@jamescoyle/vue-icon';
import { mdiArchiveEditOutline } from '@mdi/js';

import axios from 'axios';
import { mapGetters } from 'vuex';
const inspectionsUrl = "https://api.beep.nl/api/inspections";


export default {
    name: 'Inspections',
    props: {
        inspections: Array,
        hive: Object,
    },
    components: {
        InspectionItem, SvgIcon,
    },
    data() {
        return {
            expanded: false,
            path: mdiArchiveEditOutline,
            inspectionsData: null,
        }
    },
    computed: {
        ...mapGetters(['loginData'])
    },
    methods: {
        expandContentButton() {
            this.expanded = !this.expanded;
        }
    }, mounted() {
        if (this.loginData) {
            const headers = {
                "Authorization": "Bearer " + this.loginData.api_token,
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Accept-language": "en",
            };
            let options = {
                headers: headers,
                params: {
                    // "id": this.hive.id,
                    // "index": 0,s
                }
            };
            axios.get("https://api.beep.nl/api/inspections/hive/" + this.hive.id, options).then(response => {
                this.inspectionsData = response.data;
                console.log('inspections ' + this.hive.id + ' : ', this.inspectionsData.inspections.data);
            }).catch(error => { console.log(error); });
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

.inspections-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
}
</style>