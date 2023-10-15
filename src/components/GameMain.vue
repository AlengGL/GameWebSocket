<template>
  <div class="GameView">
    
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "GameMain",
  
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.GameView {
  height: 100vh;
  border-style: solid;
  box-sizing: border-box; // 将盒模型设置为 border-box，以避免 border 影响盒子的尺寸
}

</style>
