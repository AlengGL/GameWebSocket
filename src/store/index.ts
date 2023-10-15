import { createStore } from "vuex";

interface State {
  loggedIn: boolean;
}

export default createStore({
  state: (): State => ({
    loggedIn: false,
  }),
  getters: {},
  mutations: {
    setLoggedIn(state, loggedIn: boolean) {
      state.loggedIn = loggedIn;
    },
  },
  actions: {},
  modules: {},
});
