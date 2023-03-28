<template>
    <div class="selected-apiary-title">
        {{ selectedApiary }}</div>
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
    props: {
        selectedApiary: String,

    }

}
</script>

<style scoped>
.selected-apiary-title {
    font-size: 2vw;
    color: black;
    margin: 4vh 0;
}
</style>