import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "@/views/Home.vue";

// Déclaration des routes de notre application nécessaire pour le routing
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: Home,
    name: "Home",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export default router;
