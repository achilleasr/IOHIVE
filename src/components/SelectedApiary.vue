<template>
    <div class="selected-apiary-title">
        {{ selectedApiary && selectedApiary.name }}
        <span v-if="alerted()">
            <img src="../assets/Hives/i_alert.svg" />
        </span>
    </div>
    <!-- <span v-if="selectedApiary"> -->
    <ApiaryMap v-if="checkForLocations()" :hives="selectedApiary.hives" :apiary="selectedApiary" />
    <Hives :hives="selectedApiary.hives" />
    <!-- </span> -->
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
        locations: Object,
    },

    methods: {
        alerted() {
            if (this.selectedApiary && this.selectedApiary.hives.filter(e => e.alert == true).length > 0) {
                return true;
            } else {
                return false;
            }
        }, checkForLocations() {
            if (this.selectedApiary.hives[0].coordinates || this.selectedApiary.coordinate_lat) {
                return true;
            } else {
                return false;
            }

        }
    },
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