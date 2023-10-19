<template>
    <div class="chat-room">
        <div class="chat-content">
            <div class="message-list">
                <!-- 聊天内容 -->
                <div
                v-for="(message, index) in messages"
                :key="index"
                :class="getMessageClass(message)"
                >
                    {{ message.content }}
                </div>
            </div>
            <div class="chat-input">
                <input
                    v-model="newMessage"
                    @keyup.enter="sendMessage"
                    placeholder="Type your message..."
                />
                <button @click="sendMessage">Send</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useStore } from "vuex";

export default defineComponent({
    name: "ChatRoom",
    setup() {
        const store = useStore();
        const newMessage = ref("");

        const messages = computed(() => store?.state.websocket.messages || []);

        const sendMessage = () => {
            if (newMessage.value !== "") {
                store?.dispatch("sendMessage", `chat ${newMessage.value}`);
                newMessage.value = "";
            }
        };

        const getMessageClass = (message: any) => {
            console.log(message)
            return {
                received: message.isReceived,
                sent: message.isSent,
            };
        };

        return {
            messages,
            newMessage,
            sendMessage,
            getMessageClass,
        };
    },
});
</script>

<style lang="scss" scoped>
.chat-room {
    max-height: 70vh;
    display: flex;
    border-right: solid;
    border-bottom: solid;
    border-top: solid;

    .chat-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .message-list {
            height: 50vh;
            overflow-y: auto;
            padding: 10px;
            display: flex;
            flex-direction: column;

            div {
                margin-bottom: 10px;
                padding: 8px;
                border-radius: 8px;
            }

            .received {
                align-self: flex-start;
                background-color: white;
                max-width: 50%;
                word-wrap: break-word;
                text-align: left;
            }

            .sent {
                align-self: flex-end;
                background-color: #4caf50;
                color: #fff;
                max-width: 50%;
                word-wrap: break-word;
                text-align: left;
            }

        }

        .chat-input {
            display: flex;
            padding: 10px;
            border-top: 1px solid #ccc;

            input {
                flex: 1;
                padding: 8px;
                margin-right: 8px;
            }

            button {
                padding: 8px 16px;
                cursor: pointer;
            }
        }
    }
}
</style>