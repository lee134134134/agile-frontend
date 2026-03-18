<template>
  <div class="page-login">
    <Register v-show="ispage == 1" @registerResult="registerResult">
      <template #switch>
        <div class="switch-main" @click="ispage = 2">使用已有账户登录</div>
      </template>
    </Register>
    <RegisterSuccess v-show="ispage == 3" :info="userInfo">
      <template #backbtn>
        <span @click="ispage = 2">返回登陆</span>
      </template>
    </RegisterSuccess>
    <EntryVue v-show="ispage == 2" @loginResult="loginResult">
      <template #switch>
        <span class="switch-main" @click="ispage = 1">注册</span>
        <!-- <span class="switch-main">忘记密码</span> -->
      </template>
    </EntryVue>
    <!-- <el-dialog align-center width="480px" v-model="msgDia" :close-on-click-modal="false" :show-close="false">
        <template #header="{ close }">
            <div class="jus-flex-end">
                <el-icon color="#303133" size="32" style="cursor: pointer;" @click="close">
                    <Close></Close>
                </el-icon>
            </div>
        </template>
        <div class="dia-main jus-clumn-start-center">
            <img src="@/assets/images/Login/fail.png" alt="" class="failure-icon">
            <div class="defult-text">失败原因：</div>
            <div class="failure-info">{{ errorForm.info }}</div>
            <div class="defult-text">{{ errorForm.type }}失败！</div>
        </div>
    </el-dialog> -->
  </div>
</template>
<script setup>
import {onBeforeMount, onMounted, onUnmounted, reactive, ref} from 'vue';
import Register from './components/Register.vue';
import RegisterSuccess from './components/RegisterSuccess.vue';
import EntryVue from './components/Entry.vue'
import Cookies from "js-cookie";
import {ElMessage} from 'element-plus';
import {useRouter} from 'vue-router';
import {useDicStore} from '@/stores/dic.js';
import {getGlobalProjectList} from '@/api/api.js'

const dicStore = useDicStore()

const router = useRouter();

const ispage = ref(2)//1注册2登录3注册成功
const userInfo = ref({
  name: '',
  nickname: '',
  email: ''
})
const msgDia = ref(false)
const errorForm = reactive({
  info: '该邮箱已被占用',
  type: '注册'
})
const globalProjectCode = ref('') // 项目
const registerResult = (data) => {
  if (data.success) {
    ispage.value = 3
    userInfo.value = data.data
  } else {
    ElMessage({message: data.msg, type: 'error', duration: 5000})
  }
}
const loginResult = (data) => {
  if (data.success) {
    //跳转到首页
    Cookies.set('agiles_token', data.data.accessToken)
    Cookies.set('agiles_tokenType', data.data.tokenType)
    localStorage.setItem('agiles_token', data.data.accessToken)
    localStorage.setItem('agiles_tokenType', data.data.tokenType)
    localStorage.setItem('agiles_user', JSON.stringify(data.data.user))
    localStorage.setItem("agiles_router", JSON.stringify(data.data.user.featureVos))
    localStorage.setItem("agiles_menuList", JSON.stringify(data.data.user.menuList))
    dicStore.nickname = data.data.user.nickname
    getUserProjectListFn()
    router.push('/home')
  } else {
    // msgDia.value = true
    // errorForm.info = data.msg
    // errorForm.type = '登录'
    ElMessage({message: data.msg, type: 'error', duration: 5000})
  }
}
const bodyScale = () => {
  //获取当前分辨率下的可是区域宽度
  var devicewidth = document.documentElement.clientWidth
  let scale = devicewidth / 1920; // 分母——设计稿的尺寸
  let list = document.getElementsByClassName('zoomView')
  if (list && list.length > 0) {
    for (let i = 0; i < list.length; i++) {
      list[i].style.zoom = scale;//放大缩小相应倍数
    }
  }

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

onMounted(() => {
  bodyScale()
  window.addEventListener('resize', bodyScale)
})
onUnmounted(() => {
  window.removeEventListener('resize', bodyScale)
})
</script>
<style src="@/assets/css/login.scss"></style>
<style lang="scss" scoped>
::deep(.el-form-item) {
  margin-bottom: 28px !important;
}
</style>