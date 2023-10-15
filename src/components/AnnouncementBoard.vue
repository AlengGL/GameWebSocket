<template>
    <div class="announcement-board">
        <div v-for="(winner, index) in winners" :key="index">
            <p>{{ winner }} wins!</p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "AnnouncementBoard",
    data() {
        return {
        winners: [] as string[],
        };
    },
    methods: {
        addWinner(winner: string) {
        this.winners.push(winner);
        },
    },
});
</script>

<style lang="scss" scoped>
.announcement-board {
    border-right: solid;
    border-top: solid;
    height: 200px;
    overflow: hidden;
    background-color: rgb(223, 223, 223);

    div {
        margin-bottom: 10px;
        p {
            margin: 0;
            color: #4caf50;
        }
    }
}
</style>
  