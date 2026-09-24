<template>
  <template v-if="hasValidApiary">
    <div class="selected-apiary-title">
      <span>{{ selectedApiary.name }}</span>
      <span v-if="alerted"><img src="../assets/Hives/i_alert.svg" alt="alert" /></span>
      <button v-if="loginData" class="edit-btn" @click="editOpen = true">Edit</button>
    </div>
    <ApiaryMap
      v-if="checkForLocations"
      :hives="selectedApiary.hives"
      :apiary="selectedApiary"
      :apiaries="apiaries"
      :selectedApiaryId="selectedApiary.id"
      @select-apiary="$emit('select-apiary', $event)"
    />
    <Hives
      :hives="selectedApiary.hives"
      :locationId="selectedApiary.id"
      :locationCoords="apiaryCoords"
    />
    <EditApiary
      v-if="loginData"
      :apiary="selectedApiary"
      :open="editOpen"
      @close="editOpen = false"
      @deleted="$emit('select-apiary', null)"
    />
  </template>

  <div v-else class="empty-state">
    <p>Select an apiary above, or add one with the <strong>+</strong> button.</p>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Hives from '../components/Hives.vue';
import ApiaryMap from '../components/ApiaryMap.vue';
import EditApiary from '../components/EditApiary.vue';

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
  computed: {
    ...mapState(['loginData']),
    hasValidApiary() {
      return (
        this.selectedApiary &&
        this.selectedApiary.name &&
        this.selectedApiary.name !== 'none' &&
        Array.isArray(this.selectedApiary.hives)
      );
    },
    apiaryCoords() {
      const lat = this.selectedApiary?.coordinate_lat;
      const lon = this.selectedApiary?.coordinate_lon;
      return lat != null && lon != null ? [lat, lon] : null;
    },
    alerted() {
      return (
        this.selectedApiary &&
        Array.isArray(this.selectedApiary.hives) &&
        this.selectedApiary.hives.some(e => e.alert)
      );
    },
    checkForLocations() {
      if (!this.selectedApiary || !Array.isArray(this.selectedApiary.hives)) return false;
      if (this.selectedApiary.hives.length > 0 && this.selectedApiary.hives[0].coordinates) return true;
      return !!this.selectedApiary.coordinate_lat;
    },
  },
  watch: {
    selectedApiary: {
      immediate: true,
      handler(apiary) {
        if (!apiary) return;
        if (
          typeof apiary.coordinate_lat !== 'number' ||
          typeof apiary.coordinate_lon !== 'number'
        ) return;
        this.$store.dispatch('loadApiaryLocation', {
          id: apiary.id,
          lat: apiary.coordinate_lat,
          lon: apiary.coordinate_lon,
        });
      },
    },
  },
};
</script>

<style scoped>
.selected-apiary-title {
  font-size: 22px;
  color: black;
  margin: 0.3rem 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.selected-apiary-title img {
  height: 18px;
}

.edit-btn {
  background: none;
  border: 1px solid #ddd;
  border-radius: 100px;
  padding: 4px 14px;
  font-family: TwCen, sans-serif;
  font-size: 14px;
  color: #555;
  cursor: pointer;
  transition: all 0.15s;
  margin-left: auto;
}

.edit-btn:hover {
  background: #f5f6ff;
  border-color: #575eae;
  color: #575eae;
}

.empty-state {
  color: #888;
  font-family: TwCenLight, TwCen, sans-serif;
  font-size: 16px;
  text-align: center;
  padding: 3rem 2rem;
  background: #f9fafe;
  border-radius: 16px;
  margin-top: 1.5rem;
}

.empty-state strong {
  color: #575eae;
}
</style>
