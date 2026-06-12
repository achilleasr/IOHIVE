<template>
    <template v-if="hasValidApiary">
        <div class="selected-apiary-title">
            <span>{{ selectedApiary.name }}</span>
            <span v-if="alerted()"><img src="../assets/Hives/i_alert.svg" /></span>
            <button v-if="loginData" class="edit-btn" @click="editOpen = true">Edit</button>
        </div>
        <ApiaryMap v-if="checkForLocations()" :hives="selectedApiary.hives" :apiary="selectedApiary"
            :apiaries="apiaries" :selectedApiaryId="selectedApiary.id"
            @select-apiary="$emit('select-apiary', $event)" />
        <Hives :hives="selectedApiary.hives" :locationId="selectedApiary.id" :locationCoords="apiaryCoords" />
        <EditApiary v-if="loginData" :apiary="selectedApiary" :open="editOpen" @close="editOpen = false"
            @deleted="$emit('select-apiary', null)" />
    </template>
    <div v-else class="empty-state">
        <p>Select an apiary above, or add one with the <strong>+</strong> button.</p>
    </div>
</template>

<script>
import Hives from '../components/Hives.vue';
import ApiaryMap from '../components/ApiaryMap.vue';
import EditApiary from '../components/EditApiary.vue';
import { mapState } from 'vuex';

export default {
    name: 'SelectedApiary',
    components: { Hives, ApiaryMap, EditApiary },
    props: {
        selectedApiary: Object,
        apiaries: Array,
    },
    emits: ['select-apiary'],
    data() {
        return { editOpen: false };
    },
    watch: {
        selectedApiary: {
            immediate: true,
            handler(apiary) {
                if (!apiary) return;
                if (typeof apiary.coordinate_lat !== 'number' || typeof apiary.coordinate_lon !== 'number') {
                    return;
                }

                this.$store.dispatch('loadApiaryLocation', {
                    id: apiary.id,
                    lat: apiary.coordinate_lat,
                    lon: apiary.coordinate_lon,
                });
            }
        }
    },
    computed: {
        ...mapState(['loginData']),
        hasValidApiary() {
            return this.selectedApiary
                && this.selectedApiary.name
                && this.selectedApiary.name !== 'none'
                && Array.isArray(this.selectedApiary.hives);
        },
        apiaryCoords() {
            const lat = this.selectedApiary?.coordinate_lat;
            const lon = this.selectedApiary?.coordinate_lon;
            if (lat != null && lon != null) return [lat, lon];
            return null;
        },
    },
    methods: {
        alerted() {
            return this.selectedApiary
                && Array.isArray(this.selectedApiary.hives)
                && this.selectedApiary.hives.some(e => e.alert);
        },
        checkForLocations() {
            if (!this.selectedApiary || !Array.isArray(this.selectedApiary.hives)) return false;
            if (this.selectedApiary.hives.length > 0 && this.selectedApiary.hives[0].coordinates) return true;
            if (this.selectedApiary.coordinate_lat) return true;
            return false;
        },
    },
};
</script>

<style scoped>
.selected-apiary-title {
    font-size: 2vw;
    color: black;
    margin: 4vh 0;
    display: flex;
    align-items: center;
    gap: 12px;
}

.selected-apiary-title img {
    height: 1.1rem;
}

.edit-btn {
    background: none;
    border: 1px solid #ddd;
    border-radius: 100px;
    padding: 4px 14px;
    font-family: TwCen, sans-serif;
    font-size: 0.85rem;
    color: #555;
    cursor: pointer;
    transition: all 0.15s;
    margin-left: auto;
}

.edit-btn:hover {
    background: #f5f6ff;
    border-color: #575EAE;
    color: #575EAE;
}

.empty-state {
    color: #888;
    font-family: TwCenLight, TwCen, sans-serif;
    font-size: 1.2vw;
    text-align: center;
    padding: 6vh 2vw;
    background: #F9FAFE;
    border-radius: 16px;
    margin-top: 3vh;
}

.empty-state strong {
    color: #575EAE;
}
</style>