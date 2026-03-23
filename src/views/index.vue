<template>
  <div class="ha">
    <div class="nav">
      <span v-for="(item, i) in $router.options.routes" :key="i" v-show="item.homeShow">
        <router-link :to="{ name: item.name }">{{ i + 1 }}：{{ item.meta.title }}</router-link>
      </span>
    </div>
    <router-view />
  </div>
  <!-- <el-button
      v-loading.fullscreen.lock="fullscreenLoading"
      type="primary"
      @click="openFullScreen1"
  >
    As a directive
  </el-button>
  <el-button type="primary" @click="openFullScreen2"> As a service </el-button> -->
</template>

<script setup>
// import { ref } from 'vue'
// import { ElLoading } from 'element-plus'

// const fullscreenLoading = ref(false)
// const openFullScreen1 = () => {
//   fullscreenLoading.value = true
//   setTimeout(() => {
//     fullscreenLoading.value = false
//   }, 2000)
// }

// const openFullScreen2 = () => {
//   const loading = ElLoading.service({
//     lock: true,
//     text: 'Loading',
//     background: 'rgba(0, 0, 0, 0.7)',
//   })
//   setTimeout(() => {
//     loading.close()
//   }, 2000)
// }
</script>
