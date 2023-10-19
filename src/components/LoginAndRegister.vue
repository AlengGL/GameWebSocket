<template>
    <div v-if="loggedIn" class="overlay">
      <div class="login-box">
        <form @submit.prevent="login">
          <div class="topGroup">
            <div class="subTitle">
              <label>用戶名:</label>
              <label>密碼: </label>
            </div>
            <div class="InputGroup">
              <input v-model="loginUsername" placeholder="用户名" autocomplete="username" />
              <input v-model="loginPassword" placeholder="密码" type="password" autocomplete="current-password"/>
            </div>
          </div>
          <div class="btnGroup">
            <button type="submit">登录</button>
            <button @click="showRegister">注册</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showRegisterForm" class="overlay">
      <div class="register-box">
        <form @submit.prevent="register">
          <div class="topGroup">
            <div class="subTitle">
              <label>用戶名:</label>
              <label>新密碼: </label>
              <label>確認密碼: </label>
              <label>生日: </label>
            </div>
            <div class="InputGroup">
              <input v-model="registerUsername" placeholder="用户名" autocomplete="username" />
              <input v-model="registerPassword" placeholder="密码" type="password" autocomplete="new-password" />
              <input v-model="confirmPassword" placeholder="确认密码" type="password" autocomplete="new-password" />
              <input v-model="registerBirthday" placeholder="生日" type="date" />
            </div>
          </div>
          <div class="btnGroup">
            <button type="submit">注册</button>
            <button @click="showLogin">返回登录</button>
          </div>
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
              const token = response?.data?.access_token;
              const expired_in = response?.data?.expires_in;

              // 將 token 存儲在 localStorage 中
              localStorage.setItem("token", token);

              await store.dispatch('fetchUserInfo', token);
              await store.commit('tokenExpired', expired_in);
              // 更新 loggedIn 狀態
              state.loggedIn = true;
          } catch (error) {
              alert("登入失敗，帳號或密碼錯誤");
              console.error("登入失敗", error);
          }
        };

        const register = async () => {
          try {
              // 檢查密碼和確認密碼是否相符
              if (state.registerPassword !== state.confirmPassword) {
                alert("密碼和確認密碼不相符");
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
              alert("註冊失敗，名稱已有人使用");
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
  z-index: 99;
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
    width: 350px;
    height: fit-content;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); // 添加阴影效果

    .topGroup {
      display: flex;
      align-items: center;
      justify-content: space-around;

      .subTitle {
        display: flex;
        flex-direction: column;

        label {
          padding: 8px;
          margin-bottom: 5px;
          color: #333; // 文字颜色
        }
      }
    }

    .InputGroup {
      display: flex;
      flex-direction: column;
    }

    .btnGroup {
      display: flex;
      justify-content: space-around;
      margin-top: 20px;
    }
  }

  input {
    padding: 8px;
    margin-bottom: 6px;
    border: 1px solid #ccc; // 添加边框
    border-radius: 4px; // 圆角
    transition: border-color 0.3s ease; // 添加过渡效果

    &:hover {
      border-color: #3498db; // 鼠标悬停时的边框颜色
    }
  }

  button {
    padding: 8px 16px;
    margin-right: 10px;
    cursor: pointer;
    background-color: #3498db; // 按钮背景色
    color: white; // 按钮文字颜色
    border: none;
    border-radius: 4px;
    transition: background-color 0.3s ease; // 添加过渡效果

    &:hover {
      background-color: #2980b9; // 鼠标悬停时的背景色
    }
  }
}
</style>
  