<template>
    <div class="apiaries-title">
        Apiaries
    </div>
    <div class="apiaries-scroll">


        <ApiaryItem v-if="locationsData" v-for="(location, index) in locationsData.locations" :key="index"
            :name="location.name" :hives="location.hives" :selectedApiaryName="this.selectedApiary.name"
            @click="this.selectedApiary = location" />
        <ApiaryItem v-if="sharedGroupsData" v-for="(group, index) in sharedGroupsData.groups" :key="index"
            :name="group.name" :hives="group.hives" :selectedApiaryName="this.selectedApiary.name"
            @click="this.selectedApiary = group" />

        <ApiaryItem v-if="loginData == null" v-for="(apiary, index) in apiaries" :key="index" :name="apiary.name"
            :hives="apiary.hives" :selectedApiaryName="this.selectedApiary.name" @click="this.selectedApiary = apiary" />
    </div>
    <SelectedApiary :selectedApiary="this.selectedApiary" :locations="locationsData" />
</template>

<script>
import ApiaryItem from './ApiaryItem.vue';
import SelectedApiary from "./SelectedApiary.vue";
import { apiariesHardcoded } from "./apiariesHardcoded.js"
import axios from 'axios';
import { mapGetters } from 'vuex';

const sharedGroupsUrl = "https://api.beep.nl/api/groups";
const devicesUrl = "https://api.beep.nl/api/devices";
const locationsUrl = "https://api.beep.nl/api/locations";
const inspectionsUrl = "https://api.beep.nl/api/inspections";
const measurementTypesUrl = "https://api.beep.nl/api/sensors/measurement_types_available";
const inspectionsListsUrl = "https://api.beep.nl/api/inspections/lists";
const lastvaluesUrl = "https://api.beep.nl/api/sensors/lastvalues";
const measurementsUrl = "https://api.beep.nl/api/sensors/measurements";



export default {
    name: 'Apiaries',
    components: {
        SelectedApiary, ApiaryItem, apiariesHardcoded
    },
    data() {
        return {
            selectedApiary: {
                name: 'none',
            },
            apiaries: apiariesHardcoded,
            sharedGroupsData: null,
            devicesData: null,
            locationsData: null,
            inspectionsData: null,
        }
    },
    computed: {
        ...mapGetters(['loginData'])
    },
    mounted() {
        if (this.loginData) {
            const headers = {
                "Authorization": "Bearer " + this.loginData.api_token,
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Accept-language": "en",
            };

            // LOCATIONS FETCH
            axios.get(locationsUrl, { headers }).then(response => {
                this.locationsData = response.data;
                if (this.locationsData.locations.length > 0) {
                    this.selectedApiary = this.locationsData.locations[0];
                }
            }).catch(error => { console.log(error); });

            // SHARED GROUPS FETCH
            axios.get(sharedGroupsUrl, { headers }).then(response => {
                this.sharedGroupsData = response.data;
                if (this.sharedGroupsData.groups.length > 0) {
                    this.selectedApiary = this.sharedGroupsData.groups[0];
                }
            }).catch(error => { console.log(error); });

            // DEVICES FETCH
            axios.get(devicesUrl, { headers }).then(response => {
                this.devicesData = response.data;
                console.log("devices: ", response.data);
            }).catch(error => { console.log(error); });


            // INSPECTIONS
            let options = {
                headers: headers,
                params: {
                    // "id": 3476,
                    "index": 0,
                }
            };
            axios.get(inspectionsUrl, options).then(response => {
                this.inspectionsData = response.data;
                console.log('inspections: ', response.data);
            }).catch(error => { console.log(error); });

            // // INSPECTIONS LIST
            // axios.get(inspectionsListsUrl, {headers}).then(response => {
            //     console.log('inspections list: ', response.data);
            // }).catch(error => { console.log(error); });

            // LAST VALUES
            axios.get(lastvaluesUrl, options).then(response => {
                console.log('last values: ', response.data);
            }).catch(error => { console.log(error); });

            // // MEASUREMENT TYPES
            // axios.get(measurementTypesUrl, {headers}).then(response => {
            //     console.log('measurement types: ', response.data);
            // }).catch(error => { console.log(error); });

            // MEASUREMENTS
            axios.get(measurementsUrl, options).then(response => {
                console.log('measurements: ', response.data);
            }).catch(error => { console.log(error); });
        }
    },
    created() {
        this.selectedApiary = this.apiaries[0]; // set the first item as the initially selected item
    },
}

</script>

<style scoped>
.apiaries-title {
    font-size: 2.2vw;
    margin-top: 1vh;
}

.apiaries-scroll {
    height: 8vw;
    gap: 12px;
}
</style>