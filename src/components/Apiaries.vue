<template>
    <div class="apiaries-title">
        Apiaries
    </div>
    <div class="apiaries-scroll">
        <template v-if="locations">
            <ApiaryItem v-for="(location, index) in locations.locations" :key="'loc-' + index" :name="location.name"
                :hives="location.hives" :selectedApiaryName="selectedApiary.name" @click="selectedApiary = location" />
        </template>

        <template v-if="groups">
            <ApiaryItem v-for="(group, index) in groups.groups" :key="'grp-' + index" :name="group.name"
                :hives="group.hives" :selectedApiaryName="selectedApiary.name" @click="selectedApiary = group" />
        </template>

        <template v-if="!loginData || loginData.guest">
            <ApiaryItem v-for="(apiary, index) in apiaries" :key="'demo-' + index" :name="apiary.name"
                :hives="apiary.hives" :selectedApiaryName="selectedApiary.name" @click="selectedApiary = apiary" />
        </template>
    </div>
    <SelectedApiary :selectedApiary="selectedApiary" :locations="locations" />
</template>

<script>
import ApiaryItem from './ApiaryItem.vue';
import SelectedApiary from "./SelectedApiary.vue";
import { apiariesHardcoded } from "./apiariesHardcoded.js"
import { mapState } from 'vuex';

export default {
    name: 'Apiaries',
    components: {
        SelectedApiary, ApiaryItem
    },
    data() {
        return {
            selectedApiary: {
                name: 'none',
            },
            apiaries: apiariesHardcoded,
        }
    },
    computed: {
        ...mapState(['loginData', 'locations', 'groups', 'devices', 'apiariesStatus']),
    },
    watch: {
        locations(newVal) {
            if (newVal && newVal.locations && newVal.locations.length > 0) {
                if (this.selectedApiary.name === 'none') {
                    this.selectedApiary = newVal.locations[0];
                }
            }
        },
    },
    created() {
        if (!this.loginData || this.loginData.guest) {
            this.selectedApiary = this.apiaries[0];
        }
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