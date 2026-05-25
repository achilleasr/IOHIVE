import { createStore } from "vuex";
import { login as apiLogin } from "@/services/api/authApi";
import { listLocations } from "@/services/api/locationsApi";
import { listGroups } from "@/services/api/groupsApi";
import { listDevices } from "@/services/api/devicesApi";
import { listInspectionsForHive } from "@/services/api/inspectionsApi";

// try {
//   localStorage.removeItem("iohive_login");
// } catch {
//   // ignore — e.g. private-mode quirks
// }

const myStore = createStore({
  state: {
    // auth
    loginData: null,
    loginStatus: "idle",
    isGuest: false, // true after "Continue without account"; loginData stays null

    // apiaries
    locations: null,
    groups: null,
    devices: null,
    apiariesStatus: "idle",

    // inspections per hive: { 42: { inspections: {...} }, 55: { inspections: {...} } }
    inspectionsByHive: {},
  },

  mutations: {
    // auth
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

    // apiaries
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

    // inspections
    setHiveInspections(state, { hiveId, data }) {
      state.inspectionsByHive[hiveId] = data;
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

    // "Continue without account" — flips isGuest on so the rest of the app
    // treats the user as authenticated, while keeping loginData null so
    // components that branch on !loginData keep using the hardcoded demo data.
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
  },

  getters: {
    loginData: (state) => state.loginData,
    // Authenticated = real login OR guest mode. App.vue uses this to decide
    // between the main UI and the Login screen.
    isAuthenticated: (state) => !!state.loginData || state.isGuest,
    isGuest: (state) => state.isGuest,
  },
});

export default myStore;
