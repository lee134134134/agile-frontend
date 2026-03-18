<template>
  <div class="menu-content">
    <el-menu :default-active="activePage" active-text-color="#fff" background-color="none" ellipsis mode="horizontal"
             style="width:100%" text-color="rgba(255,255,255,0.6)" @select="handleRoute">
      <MenuItem v-for="(item, index) in menuList" v-show="item.navShow == 1" :key="index" :menus="item">
      </MenuItem>
    </el-menu>
  </div>
</template>
<script setup>
import {onMounted, ref, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import MenuItem from './MenuItem.vue';
import {useUserStore} from "@/stores/user";
import {detailRoute} from '@/router/baseRoutes.js'

const store = useUserStore()
const route = useRoute()
const router = useRouter()
const activePage = ref(route.path || '')
const menuList = ref([])
const handleRoute = (key, keypath) => {
  router.push(key)
}
const detailList = detailRoute()
watch(() => route.path, (newValue) => {
  if (newValue == '/') {
    activePage.value = '/home'
  } else {
    detailList.forEach(item => {
      if (item.path == route.path) {
        activePage.value = item.parentPath
      } else {
        activePage.value = route.path
      }
    })

  }
}, {immediate: true});

onMounted(() => {
  let router = localStorage.getItem('agiles_menuList') ? JSON.parse(localStorage.getItem('agiles_menuList')) : []
  router = router.filter(item => item.isOvert == 1 || item.isBusiness == 1)
  if (router && router.length > 0) {
    menuList.value = router
    // let list = router.map(item => ({
    //     path: item.path,
    //     parentId: item.parentId,
    //     name: item.name,
    //     navShow: item.navShow == 1 ? true : false,
    //     isInnerPage: item.isInnerPage == 1 ? true : false,
    //     isSystem: item.isSystem == 1 ? true : false,
    //     isTool: item.isTool == 1 ? true : false,
    //     meta: item.metaVO,
    //     isChildren: item.name == 'monthStatisticsPage' ? true : false,
    //     childrenName: item.name == 'statisticsManagement' ? 'monthStatisticsPage' : '',
    //     // isChildren: item.isChildren ? item.isChildren : false,
    //     // childrenName: item.childrenName ?? ''
    // }))

    // list.forEach(item => {
    //     if (item.navShow == '1') {
    //         if (item.isChildren == false) {
    //             if (item.parentId == 1) {
    //                 let child = list.filter(child => child.name == item.childrenName)
    //                 Object.assign(item, {
    //                     children: child
    //                 })
    //                 menuList.value.push(item)
    //             } else {
    //                 c.push(item)
    //             }
    //         }
    //     }
    // });
  }
})

</script>
<style lang="scss" scoped>
.menu-content {
  flex: 1;
  overflow: hidden;

  :deep(.el-menu) {
    --el-menu-hover-bg-color: none !important;
    border-bottom: none !important;
    height: 44px;

    .el-menu-item {
      height: 44px;
      font-size: 14px;
      padding: 0 3px 0;
      margin: 1px 16px 0;
    }

    & > .el-sub-menu{
      margin-top: 1px;
    }

    .el-sub-menu__icon-more {
      svg {
        display: none;
      }
    }

    .el-sub-menu {
      height: 44px;
      padding-bottom: 0 !important;
      font-size: 14px;
      font-weight: bold;
      font-family: 'Microsoft YaHei', 'PingFang SC';;
    }

    .el-sub-menu__icon-more::before {
      content: '更多' !important;
      display: block;
      font-size: 14px;
      font-weight: bold;
      font-family: 'Microsoft YaHei', 'PingFang SC';;
      font-style: normal;

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
}
</style>
