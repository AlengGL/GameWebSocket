import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import GameView from "../views/GameView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "123",
    meta: { title: '西部牛仔' },
    component: GameView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
