<template>
    <div class="apiaries-title">
        Apiaries
    </div>
    <div class="apiaries-scroll">
        <ApiaryItem v-for="(apiary, index) in apiaries" :key="index" :name="apiary.name" />
    </div>
</template>
<script>
import ApiaryItem from './ApiaryItem.vue';


export default {
    name: 'Apiaries',
    components: {
        ApiaryItem,
    },
    props: {
        selectedApiary: 0,
    },
    data() {
        return {
            apiaries: [
                { name: 'ISD-lab-Syros-001' },
                { name: 'ISD-lab-Syros-002' },
                { name: 'ISD-lab-Syros-003' },
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