// store/websocket.ts

import { Commit } from 'vuex';

interface WebSocketState {
    websocket: WebSocket | null;
    messages: Message[];
    userList: [];
    roomId: string | null;
    gameStart: boolean;
    roomExist: boolean | null;
    startTime: number | null;
    vOrD: string | null;
    AnnMessage: AnnMessage[];
}

interface Message {
    content: string | null;
    isReceived: boolean;
    isSent: boolean;
}

interface AnnMessage {
    content: string | null;
}

const state: WebSocketState = {
    websocket: null,
    messages: [],
    userList: [],
    roomId: null,
    gameStart: false,
    roomExist: null,
    startTime: null,
    vOrD: null,
    AnnMessage: [],
};

const mutations = {
    setWebSocket(state: WebSocketState, websocket: WebSocket) {
        state.websocket = websocket;
    },
    addMessage(state: WebSocketState, message: Message) {
        if (state.websocket) {
            state.messages.push(message);
        }
    },
    setMessages(state: WebSocketState, messages: Message[]) {
        state.messages = messages;
    },
    setUserList(state: WebSocketState, userList: []) {
        state.userList = userList;
    },
    setRoomId(state: WebSocketState, roomId: string | null) {
        state.roomId = roomId;
    },
    setGameStart(state: WebSocketState, gameStart: boolean) {
        state.gameStart = gameStart;
    },
    setRoomExist(state: WebSocketState, roomExist: boolean) {
        state.roomExist = roomExist;
    },
    setStartTime(state: WebSocketState, startTime: number) {
        state.startTime = startTime;
    },
    setVictoryOrDefeat(state: WebSocketState, vOrD: string) {
        state.vOrD = vOrD;
    },
    setAnnMessages(state: WebSocketState, messages: AnnMessage[]) {
        state.AnnMessage = messages;
    },
    addAnnMessage(state: WebSocketState, message: AnnMessage) {
        if (state.websocket) {
            state.AnnMessage.push(message);
        }
    },
};

const actions = {
    async connectWebSocket({ commit, rootState  }: { commit: Commit, rootState: any }) {
        const username = rootState.userInfo?.username || 'defaultUsername';
        console.log(username)
        const websocket = new WebSocket(`ws://localhost:3000?username=${username}`);

        websocket.addEventListener("open", (event) => {
            console.log("WebSocket 連接成功", event);
            commit('setMessages', []);
            commit('setGameStart', false);
            commit('setRoomExist', null);
            commit('setStartTime', null);
            commit('setVictoryOrDefeat', null);
            commit('setAnnMessages', []);
        });

        websocket.addEventListener("message", (event) => {
            console.log("接收訊息", event.data);
            const data = event.data;

            if(data.startsWith('chat')) {
                const content = data.substring(5);
                const message: Message = { content, isReceived: true, isSent: false };
                commit('addMessage', message);

            } else if(data.startsWith('user')) {
                const content = data.substring(5);
                const userList = JSON.parse(content);
                commit('setUserList', userList);
                console.log(userList)

            } else if(data.startsWith('RoomID')) {
                const content = data.substring(7);
                const roomId = content;
                commit('setRoomId', roomId);
                commit('setRoomExist', true);

            } else if(data == "RoomNot") {
                console.log("test");
                commit('setRoomExist', false);
            } else if(data.startsWith('start')) {
                commit('setGameStart', true);
                const content = data.substring(6);
                commit('setStartTime', content);
            } else if(data.startsWith('left')) {
                commit('setGameStart', false);
            } else if(data.startsWith('win') || data.startsWith('lose') || data.startsWith('tie')) {
                const test = data.startsWith('win') ?
                    commit('setVictoryOrDefeat', 'win') :
                    data.startsWith('lose') ?
                        commit('setVictoryOrDefeat', 'lose') :
                        commit('setVictoryOrDefeat', 'tie');

                        console.log("test123",test);
            } else if(data.startsWith('finish')) {
                commit('setGameStart', false);
                commit('setStartTime', null);
            } else if(data.startsWith('Ann')) {
                const content = data.substring(4);
                const message = { content };
                commit('addAnnMessage', message);
            }
        });

        websocket.addEventListener("close", (event) => {
            console.log("WebSocket 關閉", event);
        });

        websocket.addEventListener("error", (event) => {
            console.error("WebSocket Error", event);
        });

        commit("setWebSocket", websocket);
    },
    async sendMessage({ commit, state }: { commit: Commit; state: WebSocketState }, message: string) {
        if (state.websocket) {
            state.websocket.send(message);
            console.log("發送", message);
            if (message.startsWith('chat')) {
                const messageObj: Message = { content: message.match(/^chat (.*)$/)?.[1]|| null, isReceived: false, isSent: true };
                commit('addMessage', messageObj);
            }
        } else {
            console.error("WebSocket 未連接");
        }
    },
};

const websocketModule = {
    state,
    mutations,
    actions,
};

export default websocketModule;
