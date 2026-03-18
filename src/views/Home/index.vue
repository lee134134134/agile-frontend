<template>
  <div class="home-page jus-bet-start">
    <div class="page-left homeView">
      <div class="page-banner">
        <el-carousel height="200px">
          <el-carousel-item>
            <img alt="" src="@/assets/images/home/banner-1.png" style="object-fit: cover;">
          </el-carousel-item>
          <el-carousel-item>
            <img alt="" src="@/assets/images/home/banner-2.png" style="object-fit: cover;">
          </el-carousel-item>
          <el-carousel-item>
            <img alt="" src="@/assets/images/home/banner-3.png" style="object-fit: cover;">
          </el-carousel-item>
        </el-carousel>
      </div>
      <ToolCom style="margin-top: 16px;"></ToolCom>
      <ToolComSystem v-role-code="['admin','PO','BRA']" style="margin-top: 16px;"></ToolComSystem>
      <AgileDoc></AgileDoc>
    </div>
    <div class="page-right">
      <TodoCom></TodoCom>
    </div>
  </div>
</template>

<script setup>
import AgileDoc from './components/AgileDoc.vue';
import ToolCom from './components/ToolCom.vue';
import ToolComSystem from './components/ToolComSystem.vue';
import TodoCom from './components/TodoCom.vue';
import vRoleCode from '@/directives/v-role-code.js';
// const bodyScale = () => {
//     //获取当前分辨率下的可是区域宽度
//     var devicewidth = document.documentElement.clientWidth
//     let scale = devicewidth / 1920; // 分母——设计稿的尺寸
//     let box = document.getElementsByClassName('homeView')
//     box[0].style.zoom = scale;
// }
// onMounted(() => {
//     bodyScale()
//     window.addEventListener('resize', bodyScale)
// })
// onUnmounted(() => {
//     window.removeEventListener('resize', bodyScale)
// })
</script>

<style lang="scss" scoped>
.home-page {
  background: #f6f8fc;
  padding: 12px 20px 0;
  height: 100%;

  .page-left {
    width: calc(100% - 496px);

    .page-banner {
      width: 100%;
      height: 200px;
      border-radius: 12px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .page-right {
    width: 480px;
    height: calc(100vh - 96px);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  /* 整个滚动条 */
  ::-webkit-scrollbar {
    width: 8px;
    /* 宽度 */
    height: 8px;
    /* 高度 */
  }

  /* 滚动条轨道 */
  ::-webkit-scrollbar-track {
    background: none;
    /* 颜色 */
  }

  /* 滚动条的滑块 */
  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    /* 颜色 */
    border-radius: 4px;
  }

  /* 滚动条的滑块：鼠标悬停时 */
  ::-webkit-scrollbar-thumb:hover {
    background: #e9e9e9;
    /* 颜色 */
  }

}
</style>