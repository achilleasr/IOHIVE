import { createStore } from "vuex";

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
    isAuthenticated: !!savedLoginData,
    loginData: savedLoginData,
  },

  mutations: {
    login(state) {
      state.isAuthenticated = true;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.loginData = null;
      localStorage.removeItem("iohive_login");
    },
    setLoginData(state, loginDataValue) {
      state.loginData = loginDataValue;
      if (loginDataValue) {
        localStorage.setItem("iohive_login", JSON.stringify(loginDataValue));
      }
    },
  },
});

export default myStore;
