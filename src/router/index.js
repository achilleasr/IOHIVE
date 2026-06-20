import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";

import PageHives from "../views/PageHives.vue";
import PageSettings from "../views/PageSettings.vue";
import PageAccount from "../views/PageAccount.vue";
import PageDevices from "../views/PageDevices.vue";

const routes = [
  { path: "/", name: "/", component: PageHives },
  {
    path: "/devices",
    name: "/devices",
    component: PageDevices,
  },
  {
    path: "/settings",
    name: "/settings",
    component: PageSettings,
  },
  {
    path: "/account",
    name: "/account",
    component: PageAccount,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to) => {
  const loggedIn = !!store.state.loginData?.api_token;
  if (!loggedIn) {
    return { path: "/" };
  }
});

export default router;
