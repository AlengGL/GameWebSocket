<template>
    <div v-if="loggedIn"  class="userInfo">
        <div>
            <span class="hiWord">Hi!</span>
            <strong>{{ loginUsername }}</strong>
        </div>
        <button @click="logout">Logout</button>
    </div>
    <div v-else>
        <span>請先登入 ! </span>
    </div>
    <div class="announcement-board">
        <div
        v-for="(message, index) in messages"
        :key="index"
        class="AnnMessage"
        >
            {{ message.content }}
        </div>
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    computed,
} from "vue";
import axios, { isAxiosError } from 'axios';
import { useStore } from 'vuex';

export default defineComponent({
    name: "AnnouncementBoard",
    setup() {
        const store = useStore();
        const loginUsername = computed(() => store.state.userInfo.username);
        const loggedIn = computed(() => store.state.loggedIn);
        const messages = computed(() => store?.state.websocket.AnnMessage || []);


        const logout = async () => {
            try {
                await axios.post('http://localhost:3000/logout', null, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                // 清除local stroage token
                localStorage.removeItem("token");
                store.commit('setLoggedIn', false);
            } catch (error) {
                if (isAxiosError(error) && error.response && error.response.data.error === 'Token expired') {
                    console.log('Token expired, handle it accordingly');
                    store.commit("setLoggedIn", false);
                } else {
                    console.error(error);
                }
            }
        };

        return {
            loggedIn,
            loginUsername,
            messages,
            logout,
        };
    },
});
</script>

<style lang="scss" scoped>
.userInfo {
    padding: 8px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-right: solid;
    border-top: solid;

    div {
        display: flex;
        align-items: center;
        .hiWord {
            margin-right: 10px;
        }
    }
    button {
        padding: 8px;
        font-size: 16px;
        background-color: gray;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.2s ease-in-out;
    }
}
.announcement-board {
    border-right: solid;
    border-top: solid;
    height: 200px;
    overflow: hidden;
    background-color: rgb(223, 223, 223);
    overflow-y: auto;

    div {
        margin-bottom: 10px;
        p {
            margin: 0;
            color: #4caf50;
        }
    }
    .AnnMessage {
        height: fit-content;
    }
}
</style>
  