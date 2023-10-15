<template>
  <div class="main">
    <div v-if="showloadingbox" class="showLoadingBox">
      <div class="LoadingBox">
        <img src="@/assets/loading.png" alt="loading" class="loading-image"/>
        <p>西部牛仔</p>
      </div>
    </div>
    <div v-if="showMainGameBox" class="GameMainBox">
      <div v-if="!store?.state?.loggedIn">
        <LoginComponent />
      </div>
      <div class="left-container">
        <GameMain />
      </div>
      <div class="right-container">
        <AnnouncementBoard />
        <ChatRoom />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GameMain from "@/components/GameMain.vue"; // @ is an alias to /src
import ChatRoom from "@/components/ChatRoom.vue";
import AnnouncementBoard from "@/components/AnnouncementBoard.vue";
import LoginComponent from "@/components/LoginAndRegister.vue";
import { useStore } from 'vuex';

export default defineComponent({
  name: "GameView",
  components: {
    GameMain,
    ChatRoom,
    AnnouncementBoard,
    LoginComponent,
  },
  setup() {
    const store = useStore();
    return {
      store,
    };
  },
  data() {
    return {
      showloadingbox: true,
      showMainGameBox: false,
    };
  },
  mounted() {
    setTimeout(() => {
      this.showloadingbox = false;
      this.showMainGameBox = true;
    }, 3000);
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@keyframes fadeInOut {
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.main {
  box-sizing: border-box;
  .showLoadingBox {
    box-sizing: border-box;
    display: flex;
    height: 100vh;
    width: 100vw;
    .LoadingBox {
      margin: auto auto;
      .loading-image, p{
        animation: fadeInOut 3s ease-out;
        width: 150px;
        height: 150px;
      }
    }
  }
  .GameMainBox {
    display: flex;
    animation: fadeIn 0.5s ease-out;
    .left-container {
      flex: 8;
    }

    .right-container {
      flex: 2;
      display: flex;
      flex-direction: column;

      .announcement-board {
        flex: 3;
      }

      .chat-room {
        flex: 7;
      }
    }
  }
}

</style>