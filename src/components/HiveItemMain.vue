<template>
  <div class="hive-header-row">
    <h2 class="hive-item-title">
      {{ hive.name }}
      <span v-if="hive.alert"><img src="../assets/Hives/i_alert_selected.svg" /></span>
    </h2>
    <div class="hive-actions">
      <button v-if="loginData" class="edit-btn" @click="editOpen = true">Edit</button>
      <button v-if="loginData" class="edit-btn" @click="inspectionOpen = true">+ Inspection</button>
    </div>
  </div>

  <div class="hive-item-info">
    <div class="hive-item-icon"><img src="../assets/Hives/i_hives3.svg" /></div>
    <div class="hive-item-text">
      <div class="hive-item-location">
        <img src="../assets/Hives/i_location_pin.svg" />
        <span>{{ apiaryLocation }}</span>
      </div>
      <div v-if="hive.notes" class="hive-item-description">
        <span class="notes-label">Note:</span> {{ hive.notes }}
      </div>
      <div v-else class="hive-item-description no-notes">No notes</div>
    </div>
    <div v-if="linkedDevice" class="hive-item-status">
      <img :src="require('../assets/Hives/i_status.svg')" :style="{ opacity: isOnline ? 1 : 0.35 }"
        :title="isOnline ? 'Device online' : 'Device offline'" />
      <p class="device-name">{{ deviceName }}</p>
    </div>
  </div>

  <div class="hive-item-inspection" @click="expandContentButton">
    <img src="../assets/Hives/i_arrow_down.svg" class="clickable" :class="{ rotated180: expanded }" />
    <span class="clickable">{{ latestInspectionText }}</span>
  </div>

  <EditHive v-if="loginData" :hive="hive" :open="editOpen" @close="editOpen = false" @deleted="editOpen = false" />

  <div v-if="inspectionOpen" class="modal-backdrop" @click.self="inspectionOpen = false">
    <div class="modal-box">
      <div class="modal-header">
        <span class="modal-title">New Inspection — {{ hive.name }}</span>
        <button class="modal-close" @click="inspectionOpen = false">✕</button>
      </div>
      <MinimalInspectionForm :hive="hive" @saved="onInspectionSaved" @cancel="inspectionOpen = false" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import EditHive from './EditHive.vue';
import MinimalInspectionForm from './MinimalInspectionForm.vue';

export default {
  name: 'HiveItemMain',
  components: { EditHive, MinimalInspectionForm },
  props: {
    hive: Object,
    linkedDevice: Object,
  },
  emits: ['update:expanded'],
  data() {
    return {
      expanded: false,
      editOpen: false,
      inspectionOpen: false,
    };
  },
  computed: {
    ...mapState(['devices', 'inspectionsByHive', 'loginData', 'apiaryLocations']),

    apiaryLocation() {
      return this.apiaryLocations[this.hive?.location_id] || 'Unknown location';
    },

    isOnline() {
      if (!this.linkedDevice?.last_message_received) return false;
      const last = new Date(this.linkedDevice.last_message_received * 1000);
      return (Date.now() - last) < 7 * 24 * 60 * 60 * 1000;
    },

    deviceName() {
      return this.linkedDevice?.name ?? '';
    },

    latestInspectionText() {
      const data = this.inspectionsByHive[this.hive?.id];
      if (!data) return 'Click to expand';
      const list = data?.inspections?.data ?? [];
      if (list.length === 0) return 'No inspections yet';
      const d = new Date(list[0].created_at).toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: 'numeric', minute: 'numeric', hour12: true,
      });
      return `Latest Inspection: ${d}`;
    },
  },
  mounted() {
    if (this.hive?.id && !this.inspectionsByHive[this.hive.id]) {
      this.$store.dispatch('loadHiveInspections', this.hive.id);
    }
  },
  methods: {
    expandContentButton() {
      this.expanded = !this.expanded;
      this.$emit('update:expanded', this.expanded);
    },
    onInspectionSaved() {
      this.inspectionOpen = false;
    },
  },
};
</script>

<style scoped>
.hive-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.hive-item-title {
  margin: 0.4vw 0;
  font-size: 2.8vw;
  flex: 1;
}

.hive-item-title img {
  height: 2vw;
}

.hive-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.edit-btn {
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 100px;
  color: white;
  padding: 7px 18px;
  font-family: TwCen, sans-serif;
  font-size: 1.05vw;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.edit-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.edit-btn:active {
  transform: translateY(0);
}

.hive-item-info {
  flex: 1;
  margin: 14px 0;
  height: 7vw;
  display: flex;
  gap: 2.4vw;
  font-size: 1.2vw;
}

.hive-item-icon {
  flex: 1;
}

.hive-item-icon img {
  height: 7vw;
  margin: auto;
}

.hive-item-text {
  flex: 6;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.hive-item-location {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hive-item-location img {
  height: 1.4vw;
}

.hive-item-description {
  font-size: 1.15vw;
  font-family: "TwCenLight";
  color: rgba(255, 255, 255, 0.85);
}

.notes-label {
  font-family: TwCen, sans-serif;
  font-weight: bold;
  opacity: 0.7;
  margin-right: 4px;
}

.no-notes {
  opacity: 0.45;
  font-style: italic;
}

.hive-item-status {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  gap: 8px;
  height: 7vw;
}

.hive-item-status img {
  height: 5vw;
}

.device-name {
  margin: 0;
  font-size: 0.9vw;
  opacity: 0.8;
}

.hive-item-inspection {
  font-size: 1.5vw;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
}

.hive-item-inspection img {
  height: 2.4vw;
  transition: all 0.15s ease 0s;
}

.rotated180 {
  transform: rotate(180deg);
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-box {
  background: white;
  border-radius: 20px;
  padding: 28px 32px;
  width: 80vw;
  max-height: 90vh;
  overflow-y: auto;
  color: #333;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.modal-title {
  font-size: 1.15rem;
  font-weight: bold;
  color: #333;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.1rem;
  color: #aaa;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: color 0.15s;
}

.modal-close:hover {
  color: #555;
}
</style>