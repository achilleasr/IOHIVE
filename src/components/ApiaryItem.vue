<template>
  <div class="block">
    <div :class="['apiary-item', { selected: selectedApiaryName === name }]">
      <div class="apiary-title">{{ name }}</div>
      <div class="apiary-status">
        <div class="apiary-hives">
          <svg
            :class="selectedApiaryName === name ? 'hives-icon' : 'hives-icon-inverse'"
            viewBox="0 0 16 15"
            fill="none"
            stroke="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="0.5" y="0.5" width="15" height="7" />
            <rect x="0.5" y="7.5" width="15" height="7" />
            <line x1="6" y1="3.5" x2="10" y2="3.5" />
            <line x1="6" y1="10.5" x2="10" y2="10.5" />
          </svg>
          {{ hives.length }}
        </div>
        <div v-if="alerted" class="apiary-notice">
          <img
            :src="selectedApiaryName === name
              ? require('../assets/Hives/i_alert_selected.svg')
              : require('../assets/Hives/i_alert.svg')"
            alt=""
          />
        </div>
      </div>
    </div>
    <!-- <div v-if="selectedApiaryName === name" class="apiary-selected-line"></div> -->
  </div>
</template>

<script>
export default {
  name: 'ApiaryItem',
  props: {
    name: String,
    hives: Array,
    selectedApiaryName: String,
    apiary: Object,
  },
  computed: {
    alerted() {
      return this.hives.some(h => h.alert === true);
    },
  },
};
</script>

<style scoped>
.block {
  display: inline-block;
  margin-right: 16px;
  flex-shrink: 0;
}

.block:last-child {
  margin-right: 0;
}

.apiary-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  background-color: #ffffff;
  border: 2px solid rgb(125, 125, 125);
  color: black;
  font-size: 14px;
  width: 90px;
  height: 90px;
  word-wrap: wrap;
  border-radius: 10px;
  padding: 8px;
  box-shadow: 1px 2px 2px #575eae29;
  transition: all 0.2s ease;
  cursor: pointer;
  box-sizing: border-box;
}

.apiary-item:hover {
  box-shadow: 0px 15px 20px #575eae29;
  transform: translateY(-4px);
}

.apiary-item:active {
  transform: translateY(-1px);
}

.selected {
  background-color: #575eae;
  color: white;
  border-color: #3e4379;
}

.apiary-title {
  overflow: wrap;
  word-wrap: wrap;
  white-space: wrap;
  width: 100%;
}

/*.apiary-selected-line {
  margin-top: 6px;
  background-color: #575eae;
  height: 3px;
  border-radius: 2px;
}*/

.apiary-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.apiary-hives {
  display: flex;
  align-items: center;
  gap: 4px;
}

.hives-icon {
  height: 14px;
  width: 14px;
  stroke: white;
}

.hives-icon-inverse {
  height: 14px;
  width: 14px;
  stroke: black;
}

.apiary-notice img {
  height: 16px;
  width: 16px;
}
</style>
