import { createStore } from "vuex";
import beepConnection from "@/services/beepConnection";

const savedLoginData = (() => {
  try {
    const raw = localStorage.getItem("iohive_login");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

const myStore = createStore({
  state: {
    // auth
    loginData: savedLoginData,
    loginStatus: "idle",

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
      if (data) {
        localStorage.setItem("iohive_login", JSON.stringify(data));
      }
    },
    setLoginStatus(state, status) {
      state.loginStatus = status;
    },
    clearLogin(state) {
      state.loginData = null;
      state.loginStatus = "idle";
      state.locations = null;
      state.groups = null;
      state.devices = null;
      state.inspectionsByHive = {};
      localStorage.removeItem("iohive_login");
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
        const response = await beepConnection.post("/login", {
          email,
          password,
        });
        commit("setLoginData", response.data);
        commit("setLoginStatus", "idle");
        dispatch("loadApiaries");
      } catch (error) {
        commit("setLoginStatus", "error");
        throw error;
      }
    },

    loginAsGuest({ commit }) {
      commit("setLoginData", { guest: true });
    },

    logout({ commit }) {
      commit("clearLogin");
    },

    async loadApiaries({ commit }) {
      commit("setApiariesStatus", "loading");
      try {
        const [locRes, grpRes, devRes] = await Promise.all([
          beepConnection.get("/locations"),
          beepConnection.get("/groups"),
          beepConnection.get("/devices"),
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
        const response = await beepConnection.get(
          "/inspections/hive/" + hiveId,
        );
        commit("setHiveInspections", { hiveId, data: response.data });
      } catch (error) {
        console.log("failed to load inspections for hive " + hiveId, error);
      }
    },
  },

  getters: {
    loginData: (state) => state.loginData,
    isAuthenticated: (state) => !!state.loginData,
  },
});

export default myStore;
