import { createStore } from "vuex";
import { login as apiLogin } from "@/services/api/authApi";
import { listLocations } from "@/services/api/locationsApi";
import { listGroups } from "@/services/api/groupsApi";
import { listDevices } from "@/services/api/devicesApi";
import { listInspectionsForHive } from "@/services/api/inspectionsApi";
import { listChecklists, listChecklist } from "@/services/api/checklistsApi";

const myStore = createStore({
  state: {
    loginData: null,
    loginStatus: "idle",
    isGuest: false,
    locations: null,
    groups: null,
    devices: null,
    apiariesStatus: "idle",
    inspectionsByHive: {},
  },

  mutations: {
    setLoginData(state, data) {
      state.loginData = data;
    },
    setLoginStatus(state, status) {
      state.loginStatus = status;
    },
    setGuest(state, value) {
      state.isGuest = value;
    },
    clearLogin(state) {
      state.loginData = null;
      state.loginStatus = "idle";
      state.isGuest = false;
      state.locations = null;
      state.groups = null;
      state.devices = null;
      state.inspectionsByHive = {};
    },
    setLocations(state, data) {
      state.locations = data;
    },
    setGroups(state, data) {
      state.groups = data;
    },
    setDevices(state, data) {
      state.devices = data;
    },
    setApiariesStatus(state, status) {
      state.apiariesStatus = status;
    },
    setHiveInspections(state, { hiveId, data }) {
      state.inspectionsByHive = { ...state.inspectionsByHive, [hiveId]: data };
    },
    clearHiveInspections(state, hiveId) {
      const updated = { ...state.inspectionsByHive };
      delete updated[hiveId];
      state.inspectionsByHive = updated;
    },
  },

  actions: {
    async login({ commit, dispatch }, { email, password }) {
      commit("setLoginStatus", "loading");
      try {
        const response = await apiLogin(email, password);
        commit("setLoginData", response.data);
        commit("setGuest", false);
        commit("setLoginStatus", "idle");
        dispatch("loadApiaries");
      } catch (error) {
        commit("setLoginStatus", "error");
        throw error;
      }
    },
    loginAsGuest({ commit }) {
      commit("setGuest", true);
    },
    logout({ commit }) {
      commit("clearLogin");
    },
    async loadApiaries({ commit }) {
      commit("setApiariesStatus", "loading");
      try {
        const [locRes, grpRes, devRes] = await Promise.all([
          listLocations(),
          listGroups(),
          listDevices(),
        ]);
        commit("setLocations", locRes.data);
        commit("setGroups", grpRes.data);
        commit("setDevices", devRes.data);
        commit("setApiariesStatus", "idle");
      } catch (error) {
        commit("setApiariesStatus", "error");
        console.log("failed to load apiaries:", error);
      }
    },
    async loadHiveInspections({ commit, state }, hiveId) {
      if (state.inspectionsByHive[hiveId]) return;
      try {
        const response = await listInspectionsForHive(hiveId);
        commit("setHiveInspections", { hiveId, data: response.data });
      } catch (error) {
        console.log("failed to load inspections for hive " + hiveId, error);
      }
    },
    async loadChecklists() {
      try {
        const response = await listChecklists();
        console.log("CHECKLISTS:");
        console.log(response.data);
      } catch (err) {
        console.error(err);
      }
    },
    async loadChecklist(id) {
      try {
        const response = await listChecklist(id);
        console.log("CHECKLIST:");
        console.log(response.data);
      } catch (err) {
        console.log(err);
      }
    },
  },

  getters: {
    loginData: (state) => state.loginData,
    isAuthenticated: (state) => !!state.loginData || state.isGuest,
    isGuest: (state) => state.isGuest,
  },
});

export default myStore;
