<template>
  <div class="hive-item-edit">
    <div>EDIT</div> <img src="../assets/Hives/i_edit.svg" />
  </div>

  <h2 class="hive-item-title">{{ hive.name }} <span v-if="hive.alert">
      <img src="../assets/Hives/i_alert_selected.svg" />
    </span></h2>

  <div class="hive-item-info">
    <div class="hive-item-icon"><img src="../assets/Hives/i_hives3.svg" /></div>
    <div class="hive-item-text">
      <div class="hive-item-location">
        <img src="../assets/Hives/i_location_pin.svg" />
        {{ hive.location_name || 'Unknown location' }}
      </div>
      <div class="hive-item-description">
        {{ hive.notes ? hive.notes : 'No notes' }}
      </div>
    </div>
    <div class="hive-item-status">
      <p>{{ isOnline ? 'ON' : 'OFF' }}</p>
      <img :src="isOnline ? require('../assets/Hives/i_status.svg') : require('../assets/Hives/i_status_grey.svg')" />
      <p>Device:<br>{{ deviceName }}</p>
    </div>
  </div>

  <div class="hive-item-inspection">
    <img src="../assets/Hives/i_arrow_down.svg" class="clickable" :class="{ rotated180: expanded }"
      @click="expandContentButton" />
    <span @click="expandContentButton" class="clickable">{{ latestInspectionText }}</span>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'HiveItemMain',
  props: {
    hive: Object,
  },
  data() {
    return {
      expanded: false,
    }
  },
  computed: {
    ...mapState(['devices', 'inspectionsByHive']),

    linkedDevice() {
      if (!this.devices || !this.hive?.id) return null;
      const list = Array.isArray(this.devices) ? this.devices : [];
      return list.find(d => d.hive_id === this.hive.id) ?? null;
    },

    isOnline() {
      if (!this.linkedDevice?.last_message_received) return false;
      const last = new Date(this.linkedDevice.last_message_received * 1000);
      return (Date.now() - last) < 7 * 24 * 60 * 60 * 1000;
    },

    deviceName() {
      return this.linkedDevice?.name ?? 'No device';
    },

    latestInspectionText() {
      const data = this.inspectionsByHive[this.hive?.id];
      if (!data) return 'Expand to load inspections';
      const list = data?.inspections?.data ?? [];
      if (list.length === 0) return 'No inspections yet';
      return 'Latest: ' + new Date(list[0].created_at).toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: 'numeric', minute: 'numeric', hour12: true
      });
    },
  },
  methods: {
    expandContentButton() {
      this.expanded = !this.expanded;
      this.$emit('update:expanded', this.expanded);
      if (this.expanded && this.hive?.id && !this.inspectionsByHive[this.hive.id]) {
        this.$store.dispatch('loadHiveInspections', this.hive.id);
      }
    }
  }
}

</script>


<style scoped>
.hive-item-edit {
  position: absolute;
  top: 8px;
  right: 20px;
  display: flex;
  font-size: 12px;
  align-items: center;
  gap: 8px;
}

.hive-item-edit img {
  height: 20px;
}

.hive-item-title {
  margin: 0.4vw 0px;
  font-size: 2.8vw;
  flex: 1;
}

.hive-item-title img {
  height: 2vw;
}

.hive-item-info {
  flex: 1;
  margin: 14px 0px;
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
  font-size: 1.3vw;
  font-family: "TwCenLight";
}

.hive-item-status {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  gap: 12px;
  height: 7vw;
}

.hive-item-status img {
  height: 5vw;
}

.hive-item-status p {
  margin: 0px;
}

.hive-item-inspection {
  font-size: 1.5vw;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.hive-item-inspection img {
  height: 2.4vw;
  transition: all 0.15s ease 0s;
}
</style>