<template>
    <div v-if="loggedIn" class="overlay">
      <div class="login-box">
        <form @submit.prevent="login">
            <input v-model="loginUsername" placeholder="用户名" />
            <input v-model="loginPassword" placeholder="密码" type="password" autocomplete="current-password"/>
            <button type="submit">登录</button>
            <button @click="showRegister">注册</button>
        </form>
      </div>
    </div>

    <div v-if="showRegisterForm" class="overlay">
      <div class="register-box">
        <form @submit.prevent="register">
            <input v-model="registerUsername" placeholder="用户名" />
            <input v-model="registerPassword" placeholder="密码" type="password" autocomplete="new-password" />
            <input v-model="confirmPassword" placeholder="确认密码" type="password" autocomplete="new-password" />
            <input v-model="registerBirthday" placeholder="生日" type="date" />
            <button type="submit">注册</button>
            <button @click="showLogin">返回登录</button>
        </form>
      </div>
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    reactive,
    toRefs
} from "vue";
import { useStore } from 'vuex';
import axios from "axios";

export default defineComponent({
    name: "LoginComponent",
    setup() {
        // 使用 reactive 來定義 data
        const state = reactive({
        loggedIn: true,
        showRegisterForm: false,
        loginUsername: "",
        loginPassword: "",
        registerUsername: "",
        registerPassword: "",
        registerBirthday: "",
        confirmPassword: "",
        });

        const store = useStore();

        const login = async () => {
        try {
            // 處理登入邏輯
            const response = await axios.post("http://localhost:3000/login", {
            username: state.loginUsername,
            password: state.loginPassword,
            });

            const { token } = response.data;

            // 將 token 存儲在 localStorage 中
            localStorage.setItem("token", token);

            // 更新 loggedIn 狀態
            console.log(localStorage.getItem("token"));
            store.commit("setLoggedIn", true);

            state.loggedIn = true;
        } catch (error) {
            console.error("登入失敗", error);
        }
        };

        const register = async () => {
        try {
            // 檢查密碼和確認密碼是否相符
            if (state.registerPassword !== state.confirmPassword) {
            console.error("密碼和確認密碼不相符");
            return;
            }
            // 處理註冊邏輯
            await axios.post("http://localhost:3000/register", {
            username: state.registerUsername,
            password: state.registerPassword,
            birthday: state.registerBirthday,
            });

            // 註冊成功後可以自動切換到登入頁面
            showLogin();
        } catch (error) {
            console.error("註冊失敗", error);
        }
        };

        const showRegister = () => {
        console.log("Show Register Form");
        state.showRegisterForm = true;
        state.loggedIn = false;
        };

        const showLogin = () => {
        console.log("Show Login Form");
        state.showRegisterForm = false;
        state.loggedIn = true;
        };

        // 將要暴露給模板的屬性轉換為 refs
        return {
        ...toRefs(state),
        login,
        register,
        showRegister,
        showLogin,
        };
    },
});
</script>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;

  .login-box,
  .register-box {
    width: 250px;
    height: 250px;
    background: white;
    padding: 20px;
    border-radius: 8px;
  }

  input {
    margin-bottom: 10px;
    padding: 8px;
    width: 100%;
  }

  button {
    padding: 8px 16px;
    margin-right: 10px;
    cursor: pointer;
  }
}
</style>
  