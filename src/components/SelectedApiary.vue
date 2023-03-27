<template>
    <div class="selected-apiary-title">
        ISD-lab-Syros-001</div>
    <ApiaryMap />
    <Hives />
</template>

<script>
import Hives from "../components/Hives.vue";
import ApiaryMap from "../components/ApiaryMap.vue";

export default {
    name: 'SelectedApiary',
    components: {
        Hives, ApiaryMap
    },

}
</script>

<style scoped>
.selected-apiary-title {
    font-size: 2vw;
    color: black;
    margin: 4vh 0;
}
</style>