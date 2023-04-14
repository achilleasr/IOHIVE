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

const sharedGroupsUrl = 'https://api.beep.nl/api/groups';
const dashboardGroupsUrl = 'https://api.beep.nl/api/dashboardgroups';
const devicesUrl = "https://api.beep.nl/api/devices";
const locationsUrl = "https://api.beep.nl/api/locations";
const locationUrl = "https://api.beep.nl/api/locations/7125"

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
            dashboardGroupsData: null,
        }
    },
    computed: {
        ...mapGetters(['loginData'])
    },
    mounted() {
        if (this.loginData) {


            axios.get(locationsUrl, {
                headers: {
                    "Authorization": "Bearer " + this.loginData.api_token,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Accept-language": "en",
                }
            }).then(response => {
                this.locationsData = response.data;
                if (this.locationsData.locations.length > 0) {
                    this.selectedApiary = this.locationsData.locations[0];
                }
                // console.log('locations: ', response.data.locations);
            }).catch(error => {
                console.log(error);
            });
            axios.get(sharedGroupsUrl, {
                headers: {
                    "Authorization": "Bearer " + this.loginData.api_token,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Accept-language": "en",
                }
            }).then(response => {
                this.sharedGroupsData = response.data;
                if (this.sharedGroupsData.groups.length > 0) {
                    this.selectedApiary = this.sharedGroupsData.groups[0];
                }
                // console.log(response.data);
            }).catch(error => {
                console.log(error);
            });
            // axios.get(locationUrl, {
            //     headers: {
            //         "Authorization": "Bearer " + this.loginData.api_token,
            //         "Content-Type": "application/json",
            //         "Accept": "application/json",
            //         "Accept-language": "en",
            //     }
            // }).then(response => {
            //     // this.dashboardGroupsData = response.data;
            //     console.log("location 7125: ", response.data);
            // }).catch(error => {
            //     console.log(error);
            // });

            axios.get(devicesUrl, {
                headers: {
                    "Authorization": "Bearer " + this.loginData.api_token,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Accept-language": "en",
                }
            }).then(response => {
                this.devicesData = response.data;
                // console.log("devices: ", response.data);
            }).catch(error => {
                console.log(error);
            });
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