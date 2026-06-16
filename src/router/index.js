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
    meta: { requiresAuth: true },
  },
  {
    path: "/settings",
    name: "/settings",
    component: PageSettings,
    meta: { requiresAuth: true },
  },
  {
    path: "/account",
    name: "/account",
    component: PageAccount,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to) {
    if (to.hash)
      return { el: to.hash, behavior: "smooth", offset: { x: 0, y: 0 } };
  },
});

router.beforeEach((to) => {
  const loggedIn = !!store.state.loginData?.api_token;
  if (to.meta.requiresAuth && !loggedIn) {
    return { path: "/" };
  }
});

export default router;
