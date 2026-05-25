<template>
    <template v-if="hasValidApiary">
        <div class="selected-apiary-title">
            {{ selectedApiary && selectedApiary.name }}
            <span v-if="alerted()">
                <img src="../assets/Hives/i_alert.svg" />
            </span>
        </div>
        <ApiaryMap v-if="checkForLocations()" :hives="selectedApiary.hives" :apiary="selectedApiary" />
        <Hives :hives="selectedApiary.hives" />
    </template>
    <div v-else class="empty-state">
        <p>Select an apiary above, or add one with the <strong>+</strong> button.</p>
    </div>
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
    },

    computed: {
        hasValidApiary() {
            return (
                this.selectedApiary &&
                this.selectedApiary.name &&
                this.selectedApiary.name !== 'none' &&
                Array.isArray(this.selectedApiary.hives)
            );
        },
    },

    methods: {
        alerted() {
            if (
                this.selectedApiary &&
                Array.isArray(this.selectedApiary.hives) &&
                this.selectedApiary.hives.filter(e => e.alert == true).length > 0
            ) {
                return true;
            }
            return false;
        },
        checkForLocations() {
            if (!this.selectedApiary || !Array.isArray(this.selectedApiary.hives)) {
                return false;
            }
            if (this.selectedApiary.hives.length > 0 && this.selectedApiary.hives[0].coordinates) {
                return true;
            }
            if (this.selectedApiary.coordinate_lat) {
                return true;
            }
            return false;
        },
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

.empty-state {
    color: #888;
    font-family: TwCenLight, TwCen, sans-serif;
    font-size: 1.2vw;
    text-align: center;
    padding: 6vh 2vw;
    background-color: #F9FAFE;
    border-radius: 16px;
    margin-top: 3vh;
}

.empty-state strong {
    color: #575EAE;
}
</style>
