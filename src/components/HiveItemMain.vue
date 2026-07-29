<template>
  <div>
    <div class="header-row">
      <h2 class="title">
        {{ hive.name }}
        <span v-if="hive.alert"><img src="../assets/Hives/i_alert_selected.svg" /></span>
      </h2>
      <div class="actions" v-if="loginData">
        <button class="btn" @click="editOpen = true">Edit</button>
        <button class="btn" @click="inspectionOpen = true">+ Inspection</button>
      </div>
    </div>

    <div class="info">
      <div class="icon"><img src="../assets/Hives/i_hives3.svg" /></div>
      <div class="text">
        <div class="location">
          <img src="../assets/Hives/i_location_pin.svg" />
          <span>{{ apiaryLocation }}</span>
        </div>
        <div v-for="n in notes" :key="n.label" class="note">
          <span class="note-label">{{ n.label }}:</span> {{ n.text }}
        </div>
        <div v-if="!notes.length" class="note empty">No notes</div>
      </div>
      <div v-if="linkedDevice" class="status">
        <img :src="require('../assets/Hives/i_status.svg')" :style="{ opacity: isOnline ? 1 : 0.35 }"
          :title="isOnline ? 'Device online' : 'Device offline'" />
        <p class="device">{{ linkedDevice.name }}</p>
      </div>
    </div>

    <HiveGrid v-if="latestState" :state="latestState" />

    <div class="expander" @click="toggle">
      <img src="../assets/Hives/i_arrow_down.svg" :class="{ rotated: expanded }" />
      <span>{{ latest ? 'Latest Inspection: ' + formatDate(latest.date) : 'No inspections yet' }}</span>
    </div>

    <EditHive v-if="loginData" :hive="hive" :open="editOpen" @close="editOpen = false" @deleted="editOpen = false" />

    <div v-if="inspectionOpen" class="backdrop" @click.self="inspectionOpen = false">
      <div class="modal">
        <div class="modal-head">
          <span class="modal-title">New Inspection — {{ hive.name }}</span>
          <button class="close" @click="inspectionOpen = false">✕</button>
        </div>
        <MinimalInspectionForm :hive="hive" :previous="latest" @saved="onSaved" @cancel="inspectionOpen = false" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import EditHive from './EditHive.vue';
import HiveGrid from './HiveGrid.vue';
import MinimalInspectionForm from './MinimalInspectionForm.vue';

export default {
  name: 'HiveItemMain',
  components: { EditHive, HiveGrid, MinimalInspectionForm },
  props: {
    hive: Object,
    linkedDevice: Object,
    latest: { type: Object, default: null },
  },
  emits: ['update:expanded', 'saved'],
  data() {
    return { expanded: false, editOpen: false, inspectionOpen: false };
  },
  computed: {
    ...mapState(['loginData', 'apiaryLocations']),
    apiaryLocation() { return this.apiaryLocations[this.hive?.location_id] || 'Unknown location'; },
    latestState() { return this.latest?.resultingState || this.latest?.observedState || null; },
    isOnline() {
      const t = this.linkedDevice?.last_message_received;
      return t ? Date.now() - new Date(t * 1000) < 7 * 24 * 3600 * 1000 : false;
    },
    notes() {
      const out = [];
      if (this.hive?.notes) out.push({ label: 'Hive', text: this.hive.notes });
      const obs = this.latest?.observedState?.notes;
      const int = this.latest?.mutation?.notes;
      if (obs) out.push({ label: 'Observation', text: obs });
      if (int) out.push({ label: 'Intervention', text: int });
      return out;
    },
  },
  methods: {
    toggle() {
      this.expanded = !this.expanded;
      this.$emit('update:expanded', this.expanded);
    },
    onSaved() {
      this.inspectionOpen = false;
      this.$emit('saved');
    },
    formatDate(v) {
      const d = new Date(String(v || '').replace(' ', 'T'));
      return Number.isNaN(d.getTime()) ? String(v || '') : d.toLocaleString('en-GB',
        { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    },
  },
};
</script>

<style scoped>
.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.title {
  margin: .4vw 0;
  font-size: 2.8vw;
  flex: 1;
}

.title img {
  height: 2vw;
}

.actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.btn {
  background: rgba(255, 255, 255, .18);
  border: 1px solid rgba(255, 255, 255, .5);
  border-radius: 100px;
  color: #fff;
  padding: 7px 18px;
  font-family: TwCen, sans-serif;
  font-size: 1.05vw;
  cursor: pointer;
  transition: all .15s;
  white-space: nowrap;
}

.btn:hover {
  background: rgba(255, 255, 255, .3);
}

.info {
  flex: 1;
  margin: 14px 0;
  display: flex;
  gap: 2.4vw;
  font-size: 1.2vw;
}

.icon {
  flex: 1;
}

.icon img {
  height: 7vw;
  margin: auto;
}

.text {
  flex: 6;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
}

.location {
  display: flex;
  align-items: center;
  gap: 12px;
}

.location img {
  height: 1.4vw;
}

.note {
  font-size: 1.05vw;
  font-family: TwCenLight;
  color: rgba(255, 255, 255, .85);
}

.note-label {
  font-family: TwCen, sans-serif;
  font-weight: bold;
  opacity: .7;
}

.note.empty {
  opacity: .45;
  font-style: italic;
}

.status {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  gap: 8px;
}

.status img {
  height: 5vw;
}

.device {
  margin: 0;
  font-size: .9vw;
  opacity: .8;
}

.expander {
  font-size: 1.5vw;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
}

.expander img {
  height: 2.4vw;
  transition: transform .15s;
}

.rotated {
  transform: rotate(180deg);
}

.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  border-radius: 20px;
  padding: 28px 32px;
  width: 80vw;
  max-height: 90vh;
  overflow-y: auto;
  color: #333;
}

.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.modal-title {
  font-size: 1.15rem;
  font-weight: bold;
}

.close {
  background: none;
  border: 0;
  font-size: 1.1rem;
  color: #aaa;
  cursor: pointer;
  padding: 4px 8px;
}

.close:hover {
  color: #555;
}
</style>