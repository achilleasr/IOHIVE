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

        <template v-if="!loginData">
            <ApiaryItem v-for="(apiary, index) in apiaries" :key="'demo-' + index" :name="apiary.name"
                :hives="apiary.hives" :selectedApiaryName="selectedApiary.name" @click="selectedApiary = apiary" />
        </template>

        <AddApiary v-if="loginData" />
    </div>
    <SelectedApiary :selectedApiary="selectedApiary" />
</template>

<script>
import ApiaryItem from './ApiaryItem.vue';
import SelectedApiary from "./SelectedApiary.vue";
import AddApiary from "./AddApiary.vue";
import { apiariesHardcoded } from "./apiariesHardcoded.js"
import { mapState } from 'vuex';

export default {
    name: 'Apiaries',
    components: {
        SelectedApiary, ApiaryItem, AddApiary,
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
            if (!newVal?.locations?.length) return;

            if (this.selectedApiary.name === 'none') {
                this.selectedApiary = newVal.locations[0];
                return;
            }

            const fresh = newVal.locations.find(l => l.id === this.selectedApiary.id);
            if (fresh) {
                this.selectedApiary = fresh;
            }
        },
    },
    created() {
        if (!this.loginData) {
            this.selectedApiary = this.apiaries[0];
        }
    },
}
</script>

<style scoped>
.apiaries-title {
    font-size: 2.2vw;
    margin-top: 2vw;
}

.apiaries-scroll {
    height: 8vw;
    display: flex;
    align-items: flex-start;
}
</style>