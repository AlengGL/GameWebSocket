<template>
  <div @click="handleClick" :class="{ 'GameStart': gameStart, 'GameView': !gameStart }">
    <div v-if="isInRoom && !gameStart" class="leaveButton">
      <i @click="leaveRoom" class="fa-solid fa-person-walking-arrow-right fa-xl"></i>
    </div>
    <div v-if="!isInRoom && !gameStart" class="btnGroup">
      <p class="title">Cowboy</p>
      <div class="isButton">
        <input v-model="roomId" placeholder="Enter Room ID" />
        <button @click="joinRoom" type="button">Join Room</button>
        <button @click="createRoom" type="button">Create</button>
      </div>
    </div>
    <div v-if="isInRoom && !gameStart" class="userList">
      <div class="list">
        <h1>Room ID: {{ createRoomId }}</h1>
        <h2>Player List:</h2>
        <ul>
          <li class="player" v-for="player in players" :key="player">{{ player }}</li>
          <li v-if="!hasOtherPlayers" class="waitPlayer withAnimation">Wait Player Join<span class="dots"></span></li>
        </ul>
      </div>
      <button class="startButton" @click="start" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
          <path d="M528 56c0-13.3-10.7-24-24-24s-24 10.7-24 24v8H32C14.3 64 0 78.3 0 96V208c0 17.7 14.3 32 32 32H42c20.8 0 36.1 19.6 31 39.8L33 440.2c-2.4 9.6-.2 19.7 5.8 27.5S54.1 480 64 480h96c14.7 0 27.5-10 31-24.2L217 352H321.4c23.7 0 44.8-14.9 52.7-37.2L400.9 240H432c8.5 0 16.6-3.4 22.6-9.4L477.3 208H544c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32H528V56zM321.4 304H229l16-64h105l-21 58.7c-1.1 3.2-4.2 5.3-7.5 5.3zM80 128H464c8.8 0 16 7.2 16 16s-7.2 16-16 16H80c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/>
        </svg>Start</button>
    </div>

    <div
    v-if="gameStart"
    :class="{ 'animation-text': true, [animationText]: true }">
      {{ animationText }}
    </div>
    <div class="resultWin" v-if="victoryOrDefeat === 'win' && gameStart">
      <img src="@/assets/win.png" alt="loading" class="bangImage" />
    </div>
    <div class="resultLose" v-if="victoryOrDefeat === 'lose' && gameStart">
      <div class="top">You Game Over</div>
      <div class="bottom">Lose!</div>
    </div>
    <div class="resultTie" v-if="victoryOrDefeat === 'tie' && gameStart">
      <div class="tieTitle">This Game Draw</div>
    </div>
    <!-- Add the following code for the pseudo-element -->
    <div v-if="victoryOrDefeat === 'lose' && gameStart" class="bulletHole">
      <img src="@/assets/bulletHole.png" alt="loading" class="bulletHoleImage1"/>
      <img src="@/assets/bulletHole.png" alt="loading" class="bulletHoleImage2"/>
      <img src="@/assets/bulletHole.png" alt="loading" class="bulletHoleImage3"/>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
  onBeforeUnmount,
  computed
} from "vue";
import { useStore } from 'vuex';

export default defineComponent({
  name: "GameMain",
  setup() {
    const store = useStore();
    const roomId = ref("");
    const players = ref();
    const createRoomId = ref();
    const isInRoom = ref(false);
    const hasOtherPlayers = ref(false);
    const gameStart = computed(() => store?.state.websocket.gameStart);
    const animationText = ref("READY!!");
    const hasClicked = ref(false);
    const canClick = ref(false);""
    const victoryOrDefeat = ref("");
    const timeoutId = ref();

    if(store.state.loggedIn) {
      store.dispatch('connectWebSocket');
    }

    const createRoom = () => {
      isInRoom.value = true;
      store.dispatch('sendMessage', 'createRoom');
    };

    const joinRoom = async () => {
      const roomToJoin = roomId.value;
      console.log(roomToJoin)
      if (roomToJoin !== "") {
        await new Promise<void>((resolve) => {
          // 在 WebSocket 连接成功后，resolve Promise
          const unsubscribe = store.subscribe((mutation) => {
            if (mutation.type === 'setRoomExist') {
              resolve();
              unsubscribe();
            }
          });

          store.dispatch('sendMessage', `joinRoom ${roomToJoin}`);
        });

        const roomExists = store?.state.websocket.roomExist;

        if (roomExists == null || roomExists === false) {
          alert("Room不存在");
          console.error("Room不存在");
        } else {
          roomId.value = "";
          isInRoom.value = true;
        }
      } else {
        alert("Room ID 不能為空");
        console.error("Room ID 不能为空");
      }
    };

    const leaveRoom = () => {
      isInRoom.value = false;
      store.dispatch('sendMessage', 'leaveRoom');
      store.commit('setVictoryOrDefeat', null);
    };

    const start = () => {
      if (hasOtherPlayers.value) {
        store?.dispatch("sendMessage", 'start ');
      } else {
        alert("必須等待另一位玩家");
      }
    }

    const handleClick = () => {
      if (canClick.value && animationText.value == "GO") {
        hasClicked.value = true;
        const clickedTime = new Date().getTime();
        const timer = clickedTime - store.state.websocket.startTime;
        animationText.value = "";
        store.dispatch("sendMessage", `time ${timer}`);
      }
    };

    watch(() => store.state.websocket.gameStart,(gameStart) => {
        if (gameStart) {
          animationText.value = "READY!!"
        }
      }
    );

    watch(() => store.state.websocket.userList,(newUserList) => {
        if (newUserList) {
          players.value = newUserList.players || [];
          if(newUserList.players.length == 2) {
            hasOtherPlayers.value = true;
          }else {
            hasOtherPlayers.value = false;
          }
          createRoomId.value = store.state.websocket.roomId || "";
        }
      }
    );

    watch(() => store.state.websocket.startTime,(startTime) => {
        hasClicked.value = false;
        canClick.value = false;
        animationText.value = "READY!!";
        victoryOrDefeat.value = "";
        store.commit('setVictoryOrDefeat', null);
        if (startTime) {
          setTimeout(() => {
            animationText.value = "GO";
            canClick.value = true;
            timeoutId.value = setTimeout(() => {
              console.log(" is in startTime2");
              if (!hasClicked.value && gameStart.value) {
                console.log(" is in startTime3");
                store.dispatch("sendMessage", 'tie ');
                animationText.value = "STOP";
                canClick.value = false;
              }
            }, 3000);
          }, startTime);
        }
      }
    );

    watch(() => store.state.websocket.vOrD, (newValue) => {
      victoryOrDefeat.value = newValue;
      if(newValue == "lose") clearTimeout(timeoutId.value);
      animationText.value = "";
      if(gameStart.value) {
        setTimeout(() => {
          store.dispatch("sendMessage", 'finish ');
        }, 3000)
      }

    });

    const closeWebSocket = () => {
      if (store.state.websocket) {
        store.dispatch('sendMessage', 'leaveRoom');
        store.state.websocket.websocket.close();
      }
    };

    onBeforeUnmount(() => {
      closeWebSocket();
    });

    return {
      gameStart,
      isInRoom,
      roomId,
      players,
      createRoomId,
      hasOtherPlayers,
      animationText,
      hasClicked,
      victoryOrDefeat,
      handleClick,
      createRoom,
      joinRoom,
      leaveRoom,
      start,
    };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.GameView {
  height: 100vh;
  border-style: solid;
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-content: center;
  justify-content: center;
  overflow: hidden;

  &::after {
    content: "";
    width: fit-content;
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('@/assets/GameViewBackImage.png') center/cover;
    opacity: 0.5; /* 設定透明度 */
  }

  .leaveButton {
    position: absolute;
    height: fit-content;
    right: 10px;
    top: 20px;
    z-index: 0;
    cursor: pointer;
  }

  .btnGroup {
    display: flex;
    flex-direction: column;
    width: fit-content;
    align-items: center;
    .title {
      font-size: 120px;
    }

    .isButton {
      display: flex;
      flex-direction: column;
      width: 50%;
      input {
        margin-bottom: 8px;
        padding: 10px;
        font-size: 16px;
        border: 2px solid #333;
        border-radius: 5px;
        transition: border 0.3s ease-in-out;

        &:hover {
          border-color: #4CAF50;
          box-shadow: 0 0 10px rgba(76, 175, 80, 0.6);
        }
      }

      button {
        margin-bottom: 30px;
        padding: 12px;
        font-size: 16px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.2s ease-in-out;

        &:hover {
          background: linear-gradient(to right, #45a049, #1e87f0);
          transform: scale(1.1);
          box-shadow: 0 0 20px rgba(33, 150, 243, 0.8);
        }
      }
    }
  }

  .userList {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 100%;
    .list {
      width: 50%;

      h1 {
        position: absolute;
        font-size: 24px;
        top: 0;
        left: 10px;
      }

      h2 {
        display: flex;
        font-size: 20px;
        margin-bottom: 30px;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        .player {
          margin-bottom: 8px;
          font-size: 18px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 5px;
          padding: 10px;
          transition: background-color 0.2s ease-in-out;
        }
        .waitPlayer {
          background-color: transparent;
          color: black;
          border: 5px solid #4CAF50;
          border-style: dashed;
          font-weight: bold;
          border-radius: 5px;
          padding: 10px;
          margin-bottom: 8px;

          &.withAnimation {
            .dots::before {
              content: ".";
              animation: dotsAnimation 1s infinite;
            }
          }

          .dots::before {
            /* 初始状态 */
            content: ".";
          }
        }

        @keyframes dotsAnimation {
          0%, 20% {
            content: ".";
          }
          40%, 60% {
            content: "..";
          }
          80%, 100% {
            content: "...";
          }
        }
      }
    }
    
    button {
      margin-top: 20px;
      padding: 12px;
      font-size: 16px;
      background-color: #ff5555;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.2s ease-in-out;

      &:hover {
        background: linear-gradient(to right, #ff6666, #cc0000);
        transform: scale(1.1);
        box-shadow: 0 0 20px rgba(255, 0, 0, 0.8);
      }
    }

    .startButton {
      background: #4CAF50;
      border: 0;
      border-radius: 5px;
      padding: 10px 30px 10px 20px;
      color: white;
      text-transform: uppercase;
      font-weight: bold;


      svg {
        display: inline-block;
        vertical-align: middle;
        padding-right: 5px;
      }

      &:hover {
        svg {
          animation: fly 2s ease 1;
        }
      }

      @keyframes fly {
        0% {
          transform: translateX(0%);
        }

        50% {
          transform: translateX(500%);
        }

        100% {
          transform: translateX(0);
        }
      }
    }
  }
}

.GameStart {
  height: 100vh;
  width: 100%;
  border-style: solid;
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-content: center;
  justify-content: center;
  cursor: pointer;

  &::after {
    content: "";
    width: 100%;
    height: 100%;
    background: url('@/assets/background.png') center/cover;
    background-size: cover;
    background-position: center;
    position: absolute;
    top: 0;
    left: 0;
  }

  .leaveButton {
    position: absolute;
    height: fit-content;
    right: 10px;
    top: 10px;
    z-index: 1;
  }

  .animation-text {
    position: absolute;
    left: 10%;
    top: 0;
    transform: translate(-50%, -50%);
    white-space: nowrap;
    font-size: 8vw;
    animation: moveText 2s cubic-bezier(0.5, 0, 0.5, 1) forwards;
    z-index: 1;
    overflow: hidden;

    @keyframes moveText {
      0% {
        transform: translateY(-50%);
      }

      100% {
        transform: translateY(150%);
      }
    }
  }

  @keyframes scaleUp {
    from {
      transform: scale(0); /* 开始时最小化 */
    }
    to {
      transform: scale(1); /* 结束时放大到正常大小 */
    }
  }

  .GO {
    color: #cc0000;
  }

  .STOP {
    color: #1e87f0;
  }

  .resultWin {
    z-index: 1;
    height: fit-content;
    animation: scaleUp 2s forwards;
    img {
      width: 600px;
    }
  }

  .resultLose {
    z-index: 2;
    height: fit-content;
    font-size: 8vw;
    width: 300px;
    color: #cc0000;
    .top {
      display: flex;
    }
  }

  .resultTie {
    z-index: 2;
    height: fit-content;
    font-size: 9vw;
    width: 300px;
    color: #1f00cc;
    position: fixed;
    animation: slideIn 1s forwards;

    @keyframes slideIn {
      to {
        transform: translateY(20%);
      }
    }
  }

  .bulletHole {
    z-index: 1;
    position: fixed;
    background-size: contain;
    background-repeat: no-repeat;
    width: 150px;
    height: 150px;
    img {
      animation: scaleDown 2s forwards;
      width: 200px;
      position: absolute;
    }

    .bulletHoleImage1 {
      top: calc(50vh * random());
      left: calc(-40vw * random());
    }
    .bulletHoleImage2 {
      top: calc(40vh * random());
      left: calc(10vw * random());
    }
    .bulletHoleImage3 {
      top: calc(70vh * random());
      left: calc(-10vw * random());
    }

    @keyframes scaleDown {
      from {
        transform: scale(0); /* 开始时最小化 */
      }
      to {
        transform: scale(1); /* 结束时放大到正常大小 */
      }
    }
  }
}
</style>
