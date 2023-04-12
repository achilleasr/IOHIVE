import Vue from "vue";
import Vuex from "vuex";

// Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isAuthenticated: false,
  },
  mutations: {
    login(state) {
      state.isAuthenticated = true;
      console.log("logged in");
    },
    logout(state) {
      state.isAuthenticated = false;
      console.log("logged out");
    },
  },
  actions: {
    login({ commit }) {
      // Make an API call to authenticate the user and commit the "login" mutation
      commit("login");
    },
    logout({ commit }) {
      // Make an API call to log out the user and commit the "logout" mutation
      commit("logout");
    },
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
  },
});
