<template>
  <div class="apiaries-title">Apiaries</div>

  <div class="apiaries-scroll">
    <template v-if="locations">
      <ApiaryItem
        v-for="(location, index) in locations.locations"
        :key="'loc-' + index"
        :name="location.name"
        :hives="location.hives"
        :selectedApiaryName="selectedApiary.name"
        @click="selectedApiary = location"
      />
    </template>

    <template v-if="groups">
      <ApiaryItem
        v-for="(group, index) in groups.groups"
        :key="'grp-' + index"
        :name="group.name"
        :hives="group.hives"
        :selectedApiaryName="selectedApiary.name"
        @click="selectedApiary = group"
      />
    </template>

    <template v-if="!loginData">
      <ApiaryItem
        v-for="(apiary, index) in apiaries"
        :key="'demo-' + index"
        :name="apiary.name"
        :hives="apiary.hives"
        :selectedApiaryName="selectedApiary.name"
        @click="selectedApiary = apiary"
      />
    </template>

    <AddApiary v-if="loginData" />
  </div>

  <SelectedApiary
    :selectedApiary="selectedApiary"
    :apiaries="apiaries"
    @select-apiary="onMapSelect"
  />
</template>

<script>
import { mapState } from 'vuex';
import ApiaryItem from './ApiaryItem.vue';
import SelectedApiary from './SelectedApiary.vue';
import AddApiary from './AddApiary.vue';
import { apiariesHardcoded } from './apiariesHardcoded.js';

export default {
  name: 'Apiaries',
  components: { SelectedApiary, ApiaryItem, AddApiary },
  data() {
    return {
      selectedApiary: { name: 'none' },
      apiaries: apiariesHardcoded,
    };
  },
  computed: {
    ...mapState(['loginData', 'locations', 'groups', 'devices', 'apiariesStatus']),
  },
  watch: {
    locations(newVal) {
      if (!newVal?.locations?.length) return;

      if (this.selectedApiary.name === 'none') {
        this.selectedApiary = newVal.locations[0];
        return;
      }

      const fresh = newVal.locations.find(l => l.id === this.selectedApiary.id);
      if (fresh) this.selectedApiary = fresh;
    },
  },
  created() {
    if (!this.loginData) {
      this.selectedApiary = this.apiaries[0];
    }
  },
  methods: {
    onMapSelect(apiaryId) {
      const match = this.locations?.locations?.find(l => l.id === apiaryId);
      if (match) {
        this.selectedApiary = match;
        return;
      }
      const demo = this.apiaries.find(a => a.id === apiaryId);
      if (demo) this.selectedApiary = demo;
    },
  },
};
</script>

<style scoped>
.apiaries-title {
  font-size: 22px;
  display: flex;
  align-items: center;
}

.apiaries-scroll {
  display: flex;
  flex-direction: row;
  gap: 8px;
  overflow-x: auto;
  overflow-y: visible;
  padding: 8px 4px 16px 4px;
  scrollbar-width: auto;
  scrollbar-color: #575eae #f0f0f0;
}

.apiaries-scroll::-webkit-scrollbar {
  height: 6px;
}

.apiaries-scroll::-webkit-scrollbar-track {
  background: #f0f0f0;
  border-radius: 3px;
}

.apiaries-scroll::-webkit-scrollbar-thumb {
  background: #575eae;
  border-radius: 3px;
}
</style>
