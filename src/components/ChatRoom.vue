<template>
    <div class="chat-room">
        <div class="chat-content">
            <div class="message-list">
                <!-- 聊天消息内容 -->
                <div v-for="(message, index) in messages" :key="index" :class="{ 'received': message.isReceived, 'sent': !message.isReceived }">
                {{ message.content }}
                </div>
            </div>
            <div class="chat-input">
                <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type your message..." />
                <button @click="sendMessage">Send</button>
            </div>
        </div>
    </div>
</template>
  
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "ChatRoom",
    data() {
        return {
        messages: [] as { content: string; isReceived: boolean }[],
        newMessage: "",
        };
    },
    methods: {
        sendMessage() {
        if (this.newMessage.trim() !== "") {
            // Assume sent messages
            this.messages.push({ content: this.newMessage, isReceived: false });
            this.newMessage = "";
        }
        },
    },
});
</script>
  
<style lang="scss" scoped>
.chat-room {
    display: flex;
    height: 100vh;
    border-right: solid;
    border-bottom: solid;
    border-top: solid;

    .chat-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .message-list {
            flex: 1;
            overflow-y: auto;
            padding: 10px;
            background-color: rgb(223, 223, 223);

            div {
                margin-bottom: 10px;
            }
        }

        .received {
            align-self: flex-start;
            background-color: #e0e0e0;
        }

        .sent {
            align-self: flex-end;
            background-color: #4caf50;
            color: #fff;
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
  