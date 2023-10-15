import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

router.afterEach((to) => {
    document.title = (to.meta.title as string) || 'Default Title';
});

createApp(App).use(store).use(router).mount("#app");
