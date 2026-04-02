import Vue from "vue";
import { createStore } from "vuex";

export default createStore({
  state: {
    isAuthenticated: false,
    loginData: null,
  },
  mutations: {
    login(state) {
      state.isAuthenticated = true;
      console.log("logged in");
      localStorage.setItem("api_token", state.loginData?.api_token);
    },
    logout(state) {
      state.isAuthenticated = false;
      state.loginData = null;
      localStorage.removeItem("api_token");
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
