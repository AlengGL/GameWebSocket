<template>
  <div class="main">
    <div v-if="showloadingbox" class="showLoadingBox">
      <div class="LoadingBox">
        <img src="@/assets/loading.png" alt="loading" class="loading-image"/>
        <p>Cowboy</p>
      </div>
    </div>
    <div v-if="showMainGameBox" class="GameMainBox">
      <div v-if="!store?.state?.loggedIn">
        <LoginComponent />
      </div>
      <div class="left-container">
        <GameMain />
      </div>
      <div class="right-container" :class="{ collapsed: isRightContainerCollapsed }">
        <i @click="toggleRightContainer" :class="{ 'rotate': isRotated }" class="fa-solid fa-angle-right" id="collapse"></i>
        <div class="content">
          <AnnouncementBoard />
          <ChatRoom />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
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

    const isRightContainerCollapsed = ref(false);
    const isRotated = ref(false);

    const toggleRightContainer = () => {
      isRightContainerCollapsed.value = !isRightContainerCollapsed.value;
      isRotated.value = !isRotated.value;
    };
    
    return {
      toggleRightContainer,
      isRotated,
      isRightContainerCollapsed,
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
      z-index: 2;
      flex: 3;
      max-width: 300px;
      display: flex;
      flex-direction: column;
      transition: max-width 0.5s ease-out;
      position: relative;
      background-color: #f0f0f0;

      .fa-solid {
        cursor: pointer;
        color: #fff;
        background-color: #3498db;
        padding: 10px;
        border-radius: 5px 0 0 5px;
      }


      .content {
        overflow: hidden;
        margin-left: 0;
        transition: margin-left 0.5s ease-out;
        display: flex;
        flex-direction: column;

        .announcement-board {
          flex: 3;
          background-color: #fff;
        }

        .chat-room {
          flex: 7;
          background-color: #e0e0e0;
        }
      }
    }
    .rotate {
        transform: rotate(180deg);
        border-radius: 0 5px 5px 0 !important;
    }

    .collapsed {
      max-width: 0;

      .content {
        margin-left: 0;
      }
    }

    #collapse {
      position: absolute;
      z-index: 2;
      left: -33px;
      top: 45%;
      transition: left 1s ease-out;
    }
  }
}

</style>