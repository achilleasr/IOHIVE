<template>
    <div class="apiaries-title">
        Apiaries
    </div>
    <div class="apiaries-scroll">
        <ApiaryItem v-for="(apiary, index) in apiaries" :key="index" :name="apiary.name" :hives="apiary.hives"
            :selectedApiaryName="this.selectedApiary.name" @click="this.selectedApiary = apiary" />
    </div>
    <SelectedApiary :selectedApiary="this.selectedApiary" />
</template>
<script>
import ApiaryItem from './ApiaryItem.vue';
import SelectedApiary from "./SelectedApiary.vue";
import { apiariesHardcoded } from "./apiariesHardcoded.js"

export default {
    name: 'Apiaries',
    components: {
        SelectedApiary, ApiaryItem, apiariesHardcoded
    },

    data() {
        return {
            selectedApiary: null,
            apiaries: apiariesHardcoded,
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