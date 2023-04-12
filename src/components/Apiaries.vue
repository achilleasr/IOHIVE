<template>
    <div class="apiaries-title">
        Apiaries
    </div>
    <div class="apiaries-scroll">
        <ApiaryItem v-for="(apiary, index) in apiaries" :key="index" :name="apiary.name" :hives="apiary.hives"
            :selectedApiaryName="this.selectedApiary.name" @click="this.selectedApiary = apiary" />

        <!-- <ApiaryItem v-if="myGroupsData" v-for="(apiary, index) in myGroupsData.groups" :key="index" :name="group.name"
            :hives="group.hives" :selectedApiaryName="this.selectedApiary.name" @click="this.selectedApiary = group" /> -->
        <ApiaryItem v-if="sharedGroupsData" v-for="(group, index) in sharedGroupsData.groups" :key="index"
            :name="group.name" :hives="group.hives" :selectedApiaryName="this.selectedApiary.name"
            @click="this.selectedApiary = group" />
    </div>
    <SelectedApiary :selectedApiary="this.selectedApiary" />
</template>

<script>
import ApiaryItem from './ApiaryItem.vue';
import SelectedApiary from "./SelectedApiary.vue";
import { apiariesHardcoded } from "./apiariesHardcoded.js"
import axios from 'axios';

const sharedGroupsUrl = 'https://api.beep.nl/api/groups';
const myGroupsUrl = 'https://api.beep.nl/api/dashboardgroups';
const devicesUrl = "https://api.beep.nl/api/devices";

const config = {
    headers: {
        "Authorization": "Bearer ",
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Accept-language": "en",
    }
};






export default {
    name: 'Apiaries',
    components: {
        SelectedApiary, ApiaryItem, apiariesHardcoded
    },

    data() {
        return {
            selectedApiary: null,
            apiaries: apiariesHardcoded,
            sharedGroupsData: null,
            myGroupsData: null,
            devicesData: null,
        }
    },
    // mounted() {
    // axios.get(sharedGroupsUrl, config)
    //     .then(response => {
    //         this.sharedGroupsData = response.data;
    //         console.log('shared groups: ', response.data);
    //     })
    //     .catch(error => {
    //         console.log(error);
    //     });

    // axios.get(myGroupsUrl, config)
    //     .then(response => {
    //         this.myGroupsData = response.data;
    //         console.log('my groups: ', response.data);
    //     })
    //     .catch(error => {
    //         console.log(error);
    //     });

    // axios.get(devicesUrl, config)
    //     .then(response => {
    //         this.devicesData = response.data;
    //         console.log('devices: ', response.data);
    //     })
    //     .catch(error => {
    //         console.log(error);
    //     });

    // },
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