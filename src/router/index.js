import { createRouter, createWebHistory } from "vue-router";

import PageHives from "../views/PageHives.vue";
import PageSettings from "../views/PageSettings.vue";
import PageAccount from "../views/PageAccount.vue";

const routes = [
  {
    path: "/",
    name: "/",
    component: PageHives,
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
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
        offset: { x: 0, y: 0 },
      };
    }
  },
});

export default router;
