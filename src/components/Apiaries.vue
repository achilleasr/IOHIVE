<template>
    <div class="apiaries-title">
        Apiaries
    </div>
    <div class="apiaries-scroll">
        <ApiaryItem v-for="(apiary, index) in apiaries" :key="index" :name="apiary.name" :hives="apiary.hives"
            :alert="apiary.alert" :value="apiary.name" v-model="selectedApiary" />
    </div>


    <SelectedApiary :selectedApiary="selectedApiary" />
</template>
<script>
import ApiaryItem from './ApiaryItem.vue';
import SelectedApiary from "./SelectedApiary.vue";

export default {
    name: 'Apiaries',
    components: {
        SelectedApiary, ApiaryItem,
    },
    data() {
        return {
            selectedApiary: "ISD-lab-Syros-001",
            apiaries: [
                {
                    name: 'ISD-lab-Syros-001',
                    hives: [
                        { name: 'hive001' },
                        { name: 'hive002' },
                        { name: 'hive003' }
                    ],
                    alert: true
                },
                {
                    name: 'ISD-lab-Syros-002',
                    hives: [
                        { name: 'hive004' },
                        { name: 'hive005' }
                    ],
                    alert: false
                },
                {
                    name: 'ISD-lab-Syros-003',
                    hives: [
                        { name: 'hive006' },
                        { name: 'hive007' },
                        { name: 'hive008' },
                        { name: 'hive009' }
                    ],
                    alert: true
                },
            ],
        }
    }
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