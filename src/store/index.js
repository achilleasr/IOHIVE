import Vue from "vue";
import Vuex from "vuex";

export default new Vuex.Store({
  state: {
    isAuthenticated: false,
    loginData: null,
  },
  mutations: {
    login(state) {
      state.isAuthenticated = true;
      console.log("logged in");
    },
    logout(state) {
      state.isAuthenticated = false;
      state.loginData = null;
      console.log("logged out");
    },
    setLoginData(state, loginDataValue) {
      state.loginData = loginDataValue;
    },
  },
  actions: {
    login({ commit }) {
      commit("login");
    },
    logout({ commit }) {
      commit("logout");
    },
    setLoginData({ commit }, loginDataVal) {
      commit("setLoginData", loginDataVal);
    },
  },
  getters: {
    isAuthenticated: (state) => state.isAuthenticated,
    loginData: (state) => state.loginData,
  },
});
