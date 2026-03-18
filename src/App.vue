<template>
  <el-container v-if="$router.currentRoute.value.name != 'login'" class="page-content">
    <el-header>
      <div class="header-content jus-start-center">
        <div class="header-main jus-start-center">
          <HeaderSystemName></HeaderSystemName>
          <HeaderMenu></HeaderMenu>
        </div>
        <div class="header-main-end jus-end-center">
          <div class="projectinfo-content" @mouseenter="handleShowList" @mouseleave="hideShowList">
            <div class="project-box jus-bet-center">
              <div class="project-box-item">
                <img alt="" src="@/assets/images/Menu/project.png">
                <span class="project-box-title">{{dicStore.globalProjectName}}</span>
              </div>
              <div class="select-btn">
                <el-icon class="arrow-icon arrow-up" color="#FFF" size="14px">
                  <ArrowUp/>
                </el-icon>
                <el-icon class="arrow-icon arrow-down" color="#FFF" size="14px">
                  <ArrowDown/>
                </el-icon>
              </div>
            </div>
            <div v-show="isShowList" class="userdown-list">
              <div v-for="group in dicStore.globalUserProjectList" :key="group.status" class="item-group-box">
                <div class="item-group-title jus-start-center">
                  <img v-if="group.status == '规划中'" alt="" src="@/assets/images/home/status2.png">
                  <img v-else-if="group.status == '运维中'" alt="" src="@/assets/images/home/status3.png">
                  <img v-else-if="group.status == '已暂停'" alt="" src="@/assets/images/home/status4.png">
                  <img v-else-if="group.status == '已完成'" alt="" src="@/assets/images/home/status5.png">
                  <img v-else alt="" src="@/assets/images/home/status1.png">
                  {{ group.status }}
                </div>
                <div v-for="item in group.list" :key="item.projectId"
                     :class="{ 'list-item-active': item.projectId == dicStore.globalProjectCode }" :label="item.name"
                     class="list-item"
                     @click="handleChangeGlobalProject(item.projectId)">{{ item.name }}
                </div>
              </div>
            </div>
          </div>
          <HeaderUser></HeaderUser>
        </div>
      </div>
    </el-header>
    <el-container>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
    <div v-if="isVisible" class="msg-dia">
      <TodoPop :remindInfo="remindInfo" @optClose="closeTodoPop" @optLater="handleLater"/>
    </div>
  </el-container>
  <div v-else class="page-box">
    <router-view/>
  </div>
</template>

<script setup>
import {onBeforeMount, onBeforeUnmount, ref, watch} from 'vue';
import HeaderSystemName from './components/HeaderSystemName.vue';
import HeaderMenu from './components/HeaderMenu.vue';
import HeaderUser from './components/HeaderUser.vue';
import TodoPop from './components/TodoPop.vue'
import {
  getGlobalProjectList,
  getIsRemind,
  getRemindPopList,
  isPausePopList,
  isShowPopList,
  saveNotRemind
} from '@/api/api.js'
import {useRoute} from 'vue-router';
import {useDicStore} from '@/stores/dic.js';

const dicStore = useDicStore()
const route = useRoute()
const isVisible = ref(false)
const remindInfo = ref()
let autoTimer = null // 定时弹出定时器，3分钟
let laterTimer = ref(null) // 稍后弹出定时器，半小时
const globalProjectCode = ref('') // 项目

const isShowList = ref(false)
const handleShowList = () => {
  isShowList.value = true
}
const hideShowList = () => {
  isShowList.value = false
}

watch(() => route.path, (newPath, oldPath) => {
  let flag = (newPath != '/login' && newPath != '/') && oldPath == '/'
  let flag2 = oldPath == '/login' && newPath == '/home'
  if (flag || flag2) {
    getTodayStatus()
    getUserProjectListFn()
  }

  if (newPath == '/login') {
    clearInterval(autoTimer)
    autoTimer = null
    clearInterval(laterTimer)
  }

  if (!newPath.includes('/iterationManagement')) {
    localStorage.removeItem('iteraTab')
  }

}, {immediate: true})
// 查询是否不再弹窗
const getTodayStatus = () => {
  // 接口查询是否可弹窗
  getIsRemind().then(res => {
    if (res.success) {
      if (res.data == false) {
        getTodoListFn()
        startAutoTimer()
      } else {
        isVisible.value = false
      }
    }
  })
}

// 查询弹窗待办列表
const getTodoListFn = async () => {
  // 调用接口查询,有数据：弹窗
  getRemindPopList().then(res => {
    if (res.success) {
      if (res.data && res.data.length > 0) {
        remindInfo.value = res.data
        isVisible.value = true
      }
    }
  })
}


// 开启定时器
const startAutoTimer = () => {
  autoTimer = setInterval(() => {
    getTodoListFn()
  }, 5 * 60 * 1000)
}

const stopAutoTimer = () => {
  clearInterval(autoTimer)
  autoTimer = null
}


// 关闭弹窗 （勾选了今日不再提醒：调用接口保存，关闭定时器）
const closeTodoPop = (status) => {
  isVisible.value = false
  if (status) {
    // 调用接口保存状态
    saveNotRemind().then(res => {
      if (res.success) {
        stopAutoTimer()
      }
    })
  }
}

// 稍后处理（不管是否勾选今日不再提醒，半小时弹窗）
const handleLater = async () => {
  isVisible.value = false
  stopAutoTimer()
  await isPausePopList({time: 5})
  laterTimer = setTimeout(() => {
    getTodayStatus()
  }, 5 * 60 * 1000)
}

// 获取当前用户的所属项目下拉列表
const getUserProjectListFn = () => {
  getGlobalProjectList({}).then(res => {
    if (res.success) {
      dicStore.globalUserProjectList = res?.data ?? []
      // 有缓存：判断缓存是否在下拉列表中，在：展示；不在：默认选择第一个进行中的数据，并存缓存
      let cacheProject = localStorage.getItem('global_ProjectCode')
      let cacheProjectName = localStorage.getItem('global_ProjectName')
      if (cacheProject) {
        let includeFlag = isIncludeProject(cacheProject)
        if (includeFlag) {
          globalProjectCode.value = cacheProject
          dicStore.globalProjectCode = cacheProject
          dicStore.globalProjectName = cacheProjectName
        } else {
          let project = getDefaultProject()
          if (project.projectCode) {
            globalProjectCode.value = project.projectCode
            handleSaveGlobalProject()
          }
        }

      } else { // 无缓存：默认选择第一个进行中的数据，并存缓存
        let project = getDefaultProject()
        if (project.projectCode) {
          globalProjectCode.value = project.projectCode
          handleSaveGlobalProject()
        }
      }
    }
  })
}

// 获取默认项目：第一个进行中的数据--------当前只返回第一个、后续接口修改再改
const getDefaultProject = () => {
  let projectCode = ''
  let projectName = ''
  if (dicStore.globalUserProjectList.length > 0) {
    let hasProgress = dicStore.globalUserProjectList.some(item => item.status == '进行中' && item.list.length > 0)
    if (hasProgress) {
      dicStore.globalUserProjectList.forEach(item => {
        if (item.status == '进行中' && item.list.length > 0) {
          projectCode = item.list[0].projectId
          projectName = item.list[0].name
        }
      })
    } else {
      projectCode = dicStore.globalUserProjectList[0].list[0].projectId || ''
      projectName = dicStore.globalUserProjectList[0].list[0].name || ''
    }
  }
  return {projectCode: projectCode, projectName: projectName}
}

// 判断项目下拉列表中是否包含该项目------------------需要修改
const isIncludeProject = (cacheProject) => {
  let result = false
  if (dicStore.globalUserProjectList.length > 0) {
    dicStore.globalUserProjectList.forEach(group => {
      group.list.forEach(item => {
        if (item.projectId == cacheProject) {
          result = true
        }
      })
    })
  }
  return result
}

// 通过项目code获取项目名称
const getProjectNameByCode = (projectCode) => {
  let result = ''
  if (dicStore.globalUserProjectList.length > 0) {
    dicStore.globalUserProjectList.forEach(group => {
      group.list.forEach(item => {
        if (item.projectId == projectCode) {
          result = item.name
        }
      })
    })
  }
  return result
}

// 通过项目code获取项目状态
const getProjectStatusByCode = (projectCode) => {
  let result = ''
  if (dicStore.globalUserProjectList.length > 0) {
    dicStore.globalUserProjectList.forEach(group => {
      group.list.forEach(item => {
        if (item.projectId == projectCode) {
          result = group.status
        }
      })
    })
  }
  return result
}

const handleSaveGlobalProject = () => {
  localStorage.setItem('global_ProjectCode', globalProjectCode.value)
  dicStore.globalProjectCode = globalProjectCode.value
  let projectName = getProjectNameByCode(globalProjectCode.value)
  localStorage.setItem('global_ProjectName', projectName)
  dicStore.globalProjectName = projectName
  let projectStatus = getProjectStatusByCode(globalProjectCode.value)
  localStorage.setItem('global_ProjectStatus', projectStatus)
  dicStore.globalProjectStatus = projectStatus
}

const handleChangeGlobalProject = (projectId) => {
  globalProjectCode.value = projectId
  handleSaveGlobalProject()
}

onBeforeMount(() => {
  getUserProjectListFn() // 当前用户的所属项目
})

onBeforeUnmount(() => {
  clearInterval(autoTimer)
  autoTimer = null
  clearInterval(laterTimer)
})
</script>

<style lang="scss" scoped>
.page-content {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #fff;

  .header-content {
    height: 48px;
    gap: 12px;
    width: 100%;
    padding: 0 24px;
    background: #1D7CFF;
  }

  .header-main {
    width: calc(100% - 360px);
  }

  .header-main-end{
    width: 360px;
  }

  .projectinfo-content {
    height: 32px;
    padding: 0 12px;
    position: relative;
    border-radius: 18px;
    background: #196cdd;
    width: 200px;
    flex-shrink: 0;

    .userdown-list {
      display: block;
      position: absolute;
      top: 33px;
      right: -180px;
      z-index: 999999;
      // display: flex;
      // flex-direction: column;
      // justify-content: space-around;
      width: 360px;
      max-height: 589px;
      padding: 20px 0;
      background: #fff;
      box-shadow: 0px 2px 15px 5px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      border: 1px solid #edf5ff;
      overflow: auto;

      .item-group-box {
        margin-bottom: 15px;
      }

      .item-group-title {
        margin-bottom: 5px;
        padding: 0 28px;
        color: #666;
        font-size: 12px;

        img {
          width: 12px;
          margin-right: 4px;
        }
      }

      .list-item {
        height: 32px;
        line-height: 32px;
        padding: 0 28px;
        color: #283039;
        cursor: pointer;

        .item-text {
          font-family: 'Microsoft YaHei', 'PingFang SC';
          font-weight: 400;
          font-size: 14px;
          color: #232323;
        }
      }

      .list-item:hover {
        background-color: rgba(20, 124, 255, 0.1);
        font-weight: bold;
      }

      .list-item-active {
        background-color: rgba(20, 124, 255, 0.1);
        font-weight: bold;
      }
    }

    .userdown-list > .item-group-box:last-child {
      margin-bottom: 0;
    }
  }

  .project-box {
    height: 34px;
    color: #FFF;
    gap: 3px;

    img {
      width: 22px;
      margin-bottom: 2px;
    }

    .select-btn {
      margin-left: 0px;
      padding-bottom: 2px;

      .arrow-up {
        display: block;
      }

      .arrow-down {
        display: none;
      }
    }
  }

  .project-box:hover {
    .select-btn {
      .arrow-up {
        display: none;
      }

      .arrow-down {
        display: block;
      }
    }
  }

  :deep(.el-header) {
    --el-header-padding: 0 !important;
    --el-header-height: 48px !important;
  }

  :deep(.el-main) {
    --el-main-padding: 0 !important;
  }
}

.page-box {
  width: 100%;
  height: 100vh;
  overflow: auto;
}

.msg-dia {
  position: fixed;
  right: 0px;
  bottom: 3px;
  //   height: 300px;
  //   width: 300px;
  z-index: 999999;
  //   background-color: aquamarine;
}

:deep(.el-message-box) {
  width: 300px !important;
}

:deep(.el-button--primary) {
  --el-button-outline-color: #2173f7 !important;
}

.project-box-title{
  font-size: 14px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}

.project-box-item{
  display: flex;
  width: 100%;
  gap: 10px;
  align-items: center;
}
</style>
