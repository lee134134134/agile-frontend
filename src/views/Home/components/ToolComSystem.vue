<template>
  <div class="tool-content">
    <div class="tab-content jus-start-center">
      <!-- <div :class="activeTab == 1 ? 'tab-btn-active' : 'tab-btn'" class="btn-margin" @click="activeTab = 1">敏捷工具
      </div> -->
      <!-- <div v-if="rolesCode.includes('admin')" :class="activeTab == 2 ? 'tab-btn-active' : 'tab-btn'" @click="activeTab = 2">系统管理</div> -->
      <div class="tab-btn-active">系统管理</div>
    </div>
    <!-- <div class="menu-content-1 jus-start-center" v-if="activeTab == 1">
        <div class="menu-items jus-bet-center" v-for="item in agileMenu" :key="item.path" @click="goPage(item.path)">
            <div class="jus-start-center">
                <div class="title-icon"></div>
                <div class="item-title">{{ item.meta.title }}</div>
            </div>
            <div class="right-icon">
                <el-icon>
                    <ArrowRightBold></ArrowRightBold>
                </el-icon>
            </div>
        </div>
    </div> -->
    <div class="menu-content-2 jus-start-center">
      <div v-for="item in systemMenu" :key="item.path" class="menu-items jus-bet-center" @click="goPage(item.path)">
        <div class="jus-start-center">
          <!-- <div class="title-icon"></div> -->
          <img alt="" src="@/assets/images/home/system.png" style="width: 24px;margin-right: 12px;"/>
          <div class="item-title">{{ item.meta.title }}</div>
        </div>
        <div class="right-icon">
          <img src="@/assets/webp/ico-right-arrow.webp" alt="">
        </div>
      </div>

    </div>
  </div>
</template>
<script setup>
import {onBeforeMount, onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';

const router = useRouter()
const activeTab = ref(2)
const agileMenu = ref([])
const systemMenu = ref([])
const rolesCode = ref([])
const goPage = (data) => {
  router.push(data)
}

onBeforeMount(() => {
  rolesCode.value = JSON.parse(localStorage.getItem("agiles_user")).rolesCode
})

onMounted(() => {
  let menu = localStorage.getItem('agiles_router') ? JSON.parse(localStorage.getItem('agiles_router')) : []
  menu = menu.filter(item => item.isTool == 1 || item.isSystem == 1)
  if (menu && menu.length > 0) {
    menu.forEach(item => {
      if (item.isTool == 1) {
        agileMenu.value.push({
          name: item.name,
          path: item.path,
          meta: item.metaVO,
        })
      }
      if (item.isSystem == 1) {
        systemMenu.value.push({
          name: item.name,
          path: item.path,
          meta: item.metaVO,
        })
      }
    })
  }
})
</script>
<style lang="scss" scoped>
.tool-content {
  height: 142px;
  background: #fff;
  padding: 0 20px;
  border-radius: 12px;

  .tab-content {
    height: 56px;
    line-height: 56px;
    //box-shadow: inset 0px -1px 0px 0px rgba(221, 221, 221, 0.3);

    .btn-margin {
      margin-right: 40px;
    }

    .tab-btn {
      font-size: 16px;
      color: #fff;
      font-weight: bold;
      color: #c7c7c7;
      font-family: 'Microsoft YaHei', 'PingFang SC';
      cursor: pointer;
    }

    .tab-btn-active {
      font-size: 16px;
      color: #fff;
      font-weight: bold;
      color: #2d3748;
      font-family: 'Microsoft YaHei', 'PingFang SC';
      cursor: pointer;
    }
  }

  .menu-content-2 {
    padding-bottom: 14px;
    width: 100%;
    overflow-x: auto;
    column-gap: 20px;

    &::-webkit-scrollbar {
      height: 6px;
    }

    .menu-items {
      height: 64px;
      line-height: 64px;
      padding: 0 20px;
      border-radius: 8px;
      background: #F9FAFB;
      cursor: pointer;
      flex-shrink: 0;

      &:hover{
        background: #e1edff;
      }

      .title-icon {
        display: inline-block;
        width: 4px;
        height: 26px;
        background: #369fff;
        border-radius: 4px;
        margin-right: 10px;
      }

      .item-title {
        color: #283039;
        font-size: 16px;
        font-weight: 600;
        font-family: 'Microsoft YaHei', 'PingFang SC';
      }

      .right-icon {
        margin-left: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        color: #DDD;
        border-radius: 50%;

        img{
          display: block;
          width: 16px;
          height: 16px;
        }
      }
    }
  }
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
</style>