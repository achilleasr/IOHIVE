import { createStore } from "vuex";
import { login as apiLogin } from "@/services/api/authApi";
import { listLocations } from "@/services/api/locationsApi";
import { listGroups } from "@/services/api/groupsApi";
import { listDevices } from "@/services/api/devicesApi";
import { listInspectionsForHive } from "@/services/api/inspectionsApi";
import {
  listChecklists,
  getChecklist,
  getChecklistForInspection,
  listCategories,
} from "@/services/api/checklistsApi";

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
    apiaryLocations: {},

    // Checklists
    checklists: [], // summary list from /inspections/lists
    defaultChecklist: null, // the `checklist` field BEEP returns as the user default
    checklistsById: {}, // full checklists (editor shape: category_ids) cached by id
    checklistTreeById: {}, // inspection-renderable nested `categories` tree cached by id
    checklistsStatus: "idle",

    // Category catalogue (the pool you pick items from when editing a checklist)
    categories: null,
    categoriesStatus: "idle",
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
      state.checklists = [];
      state.defaultChecklist = null;
      state.checklistsById = {};
      state.checklistTreeById = {};
      state.checklistsStatus = "idle";
      state.categories = null;
      state.categoriesStatus = "idle";
      state.apiaryLocations = {};
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

    setChecklists(state, list) {
      state.checklists = Array.isArray(list) ? list : [];
    },
    setDefaultChecklist(state, checklist) {
      state.defaultChecklist = checklist || null;
    },
    setChecklistById(state, checklist) {
      if (checklist && checklist.id != null) {
        state.checklistsById = {
          ...state.checklistsById,
          [checklist.id]: checklist,
        };
      }
    },
    setChecklistTree(state, checklist) {
      if (checklist && checklist.id != null) {
        state.checklistTreeById = {
          ...state.checklistTreeById,
          [checklist.id]: checklist,
        };
      }
    },
    invalidateChecklistTree(state, id) {
      if (id != null && state.checklistTreeById[id]) {
        const updated = { ...state.checklistTreeById };
        delete updated[id];
        state.checklistTreeById = updated;
      }
    },
    setChecklistsStatus(state, status) {
      state.checklistsStatus = status;
    },
    setCategories(state, data) {
      state.categories = data;
    },
    setCategoriesStatus(state, status) {
      state.categoriesStatus = status;
    },
    setApiaryLocation(state, { apiaryId, location }) {
      state.apiaryLocations = {
        ...state.apiaryLocations,
        [apiaryId]: location,
      };
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
        dispatch("loadChecklists");
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

    /**
     * Load the checklist summary list + the user's default checklist.
     * Source: GET /inspections/lists -> { checklists, checklist }.
     */
    async loadChecklists({ commit, state }, force = false) {
      if (!force && state.checklists.length > 0) return;
      commit("setChecklistsStatus", "loading");
      try {
        const res = await listChecklists();
        commit("setChecklists", res.data?.checklists ?? []);
        commit("setDefaultChecklist", res.data?.checklist ?? null);
        commit("setChecklistsStatus", "idle");
      } catch (error) {
        commit("setChecklistsStatus", "error");
        console.log("failed to load checklists:", error);
      }
    },

    /**
     * Load one full checklist (editor shape: category_ids) and cache it by id.
     * Source: GET /checklists/{id}. Used by the checklist manager.
     */
    async loadChecklist({ commit, state }, { id, force = false }) {
      if (!force && state.checklistsById[id]) return state.checklistsById[id];
      try {
        const res = await getChecklist(id);
        commit("setChecklistById", res.data);
        return res.data;
      } catch (error) {
        console.log("failed to load checklist " + id, error);
        throw error;
      }
    },

    /**
     * Load one checklist's RENDERABLE category tree and cache it by id.
     * Source: GET /inspections/lists?id={id} -> { checklist: { categories: [...] } }.
     * Used by the inspection form to build the dynamic field set.
     */
    async loadChecklistTree({ commit, state }, { id, force = false }) {
      if (!force && state.checklistTreeById[id])
        return state.checklistTreeById[id];
      const res = await getChecklistForInspection(id);
      const checklist = res.data?.checklist ?? null;
      if (checklist) commit("setChecklistTree", checklist);
      return checklist;
    },

    /** Load the category catalogue once (the item pool for editing checklists). */
    async loadCategories({ commit, state }, force = false) {
      if (!force && state.categories) return state.categories;
      commit("setCategoriesStatus", "loading");
      try {
        const res = await listCategories();
        commit("setCategories", res.data);
        commit("setCategoriesStatus", "idle");
        return res.data;
      } catch (error) {
        commit("setCategoriesStatus", "error");
        console.log("failed to load categories:", error);
        throw error;
      }
    },
    async loadApiaryLocation({ commit, state }, { id, lat, lon }) {
      if (state.apiaryLocations[id]) {
        return;
      }
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
          { headers: { "Accept-Language": "en" } },
        );
        const data = await res.json();
        const a = data.address || {};
        const place =
          a.village || a.town || a.city || a.county || a.state || "";
        const country = a.country || "";
        const loc =
          [place, country].filter(Boolean).join(", ") ||
          data.display_name ||
          "Unknown location";
        commit("setApiaryLocation", { apiaryId: id, location: loc });
      } catch {
        commit("setApiaryLocation", {
          apiaryId: id,
          location: "Unknown location",
        });
      }
    },
  },

  getters: {
    loginData: (state) => state.loginData,
    isAuthenticated: (state) => !!state.loginData || state.isGuest,
    isGuest: (state) => state.isGuest,
    checklists: (state) => state.checklists,
    defaultChecklist: (state) => state.defaultChecklist,
  },
});

export default myStore;
