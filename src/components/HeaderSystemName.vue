<template>
  <div class="system-name" @click.stop="goHome">
    <img alt="" src="@/assets/webp/logo.webp">
  </div>
</template>
<script setup>
import {useRouter} from "vue-router";

const router = useRouter();
const goHome = () => {
  router.push({path: '/home'})
}
</script>
<style lang="scss" scoped>
.system-name {
  flex-shrink: 0;
  width: 150px;
  cursor: pointer;
  margin-right: 24px;

  img {
    display: block;
    width: 100%;
  }
}
</style>