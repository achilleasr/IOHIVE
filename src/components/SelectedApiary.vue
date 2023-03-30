<template>
    <div class="selected-apiary-title">
        {{ selectedApiary.name }}
        <span v-if="selectedApiary.alert">
            <img src="../assets/Hives/i_alert.svg" />
        </span>
    </div>


    <ApiaryMap />
    <Hives :hives="selectedApiary.hives" />
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
        selectedApiary: Object,
    }

}
</script>

<style scoped>
.selected-apiary-title {
    font-size: 2vw;
    color: black;
    margin: 4vh 0;
}

.selected-apiary-title img {
    height: 1.1rem;
}
</style>