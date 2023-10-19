import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import axios from 'axios';
import websocketModule from './websocket';

interface UserInfo {
  username: string;
}

interface State {
  loggedIn: boolean;
  userInfo: UserInfo | null;
  tokenExpiration: number | null;
}

export default createStore({
  state: (): State => ({
    loggedIn: false,
    userInfo: null,
    tokenExpiration: null,
  }),
  getters: {},
  mutations: {
    setLoggedIn(state, loggedIn: boolean) {
      state.loggedIn = loggedIn;
    },
    setUserInfo(state, userInfo: UserInfo | null) {
      state.userInfo = userInfo;
    },
    setTokenExpiration(state, expiration: number) {
      state.tokenExpiration = expiration;
    },
  },
  plugins: [createPersistedState()],
  actions: {
    async fetchUserInfo({ commit }, token: string) {
      try {
        const userInfoResponse = await axios.post<UserInfo>('http://localhost:3000/getuserinfo', null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userInfo = userInfoResponse?.data;
        commit('setLoggedIn', true);
        commit('setUserInfo', userInfo);
      } catch (error) {
        console.error("Failed to fetch user information", error);
      }
    },
    async tokenExpired({ commit }, tokenExpiration: any) {
      // token過期時間
      if (tokenExpiration) {
        commit('setTokenExpiration', tokenExpiration);
        const now = new Date().getTime();
        const expiresIn = tokenExpiration - now;

        if (expiresIn > 0) {
          setTimeout(() => {
            window.alert('Token expired. Logging out...');
            commit('setLoggedIn', false);
          }, expiresIn);
        }
      }
    },
  },
  modules: {
    websocket: websocketModule,
  },
});
