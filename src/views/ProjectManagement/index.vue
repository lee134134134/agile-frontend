<template>
  <div class="main-content">
    <!--        <div class="menu-title title-1">项目管理</div>-->
    <div class="jus-bet-start">
      <el-form :inline="true">
        <el-form-item label="项目名称">
          <el-input v-model="searchForm.projectName" clearable placeholder="请输入项目名称/简称" style="width: 240px;"
                    @change="getProjectListFn"></el-input>
        </el-form-item>
        <el-form-item label="项目状态">
          <el-select v-model="searchForm.state" clearable placeholder="请选择项目状态" style="width: 160px;"
                     @change="getProjectListFn">
            <el-option v-for="item in stateList" :key="item.value" :label="item.name" :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="opt-btn" @click="operateFn(1)">新增项目</div>
    </div>
    <div class="list-content boxView">
      <div v-for="item in projectList" :key="item.id" class="card-content listView">
        <div class="card-header jus-bet-end">
          <div class="card-hearder-left jus-start-end">
            <div class="card-title">{{ item.name ?? '-' }} -</div>
            <div class="card-jc">{{ item.shortName ?? '-' }}</div>
          </div>
          <div
              :class="{ 'not_started': item.state === 'not_started', 'status-blue': item.state === 'in_progress', 'status-green': item.state === 'completed', 'status-yellow': item.state === 'paused', 'status-blue': item.state === 'planning','status-blueW': item.state === 'maintenance'}"
              class="card-header-right project-tag-fix">
            {{ filterDic(item.state) }}
          </div>
        </div>
        <div class="card-main">
          <div class="info-line jus-bet-start">
            <span class="info-title"><el-icon class="icon-tip"><img src="@/assets/webp/charge.webp" alt=""></el-icon>负责人</span>
            <span class="info-val">{{ item.projectLeader ?? '-' }}</span>
          </div>
          <div class="info-line jus-bet-start">
            <span class="info-title"><el-icon class="icon-tip"><img src="@/assets/webp/time.webp" alt=""></el-icon>计划开始 - 计划结束</span>
            <span class="info-val">{{ item.planStartDate ?? '-' }} - {{item.planEndDate ?? '-'}}</span>
          </div>
          <div class="info-line jus-bet-start">
            <span class="info-title"><el-icon class="icon-tip"></el-icon>创建日期 - 实际结束</span>
            <span class="info-val">{{ item.createdAt ?? '-' }} - {{item.actualEndDate ?? '-'}}</span>
          </div>
          <div class="info-line jus-bet-start">
            <span class="info-title"><el-icon class="icon-tip"><img src="@/assets/webp/iterate.png" alt=""></el-icon>迭代期数</span>
            <span class="info-val">{{ item.projectIteration ?? '-' }}</span>
          </div>
          <div class="info-line jus-bet-start">
            <div class="info-title">
              <el-icon class="icon-tip">
                <img src="@/assets/webp/schedule.webp" alt="">
              </el-icon>
              项目进度：
            </div>
            <el-progress v-if="item.projectProgress >= '0'" :percentage="item.projectProgress * 1"
                         color="#2173f7" style="width:70%"></el-progress>
            <div v-else>
              <el-icon color="#ff7d00" style="vertical-align: middle;">
                <WarningFilled/>
              </el-icon>
              请及时完善项目信息
            </div>
          </div>
          <div class="info-footer">
            <div class="opt-btn opt-btn-text" @click="operateFn(2, item.id)">项目信息管理</div>
            <div class="opt-btn" @click="goTimeLine(item.projectCode, item.name)">迭代时间轴</div>
            <div class="opt-btn" @click="goTree(item.projectCode)">项目树管理</div>
          </div>
        </div>
      </div>

    </div>
    <AddProject v-if="isOperateDia" :defaultStatus="defaultStatus" :isShow="isOperateDia" :projectInfo="detailInfo"
                :statusList="stateList" :type="operateType" @closeDiaFn="handleCloseDia"
                @confirmFn="handleAddData"
                @editConfirmFn="handleEditFn"></AddProject>
  </div>
</template>

<script setup>
import {onBeforeMount, onMounted, onUnmounted, reactive, ref} from 'vue';
import {useRouter} from 'vue-router';
import {getDicDefaultVal} from '@/utils';
import AddProject from './components/AddProject.vue';
import {User, WarningFilled} from '@element-plus/icons-vue';
import {addProject, emitProject, getProjectInfo, getProjectList} from '@/api/projectApi.js';
import {getDicList} from '@/api/api.js';

const router = useRouter()
const projectList = ref([])
const isOperateDia = ref(false)
const operateType = ref('')
const detailInfo = ref(null)
const stateList = ref([])
const defaultStatus = ref('')
// const projectName = ref(undefined)
// const projectState = ref(undefined)
const searchForm = reactive({
  projectName: '',
  state: '',
})
const baseDataList = ref([])

// const handleFilter = (type) => {

//     if (type == 1) {
//         if (projectName.value) {
//             let a = baseDataList.value.filter(item => item.name.includes(projectName.value) || item.shortName.includes(projectName.value))
//             return projectList.value = a
//         } else {
//             return projectList.value = baseDataList.value
//         }

//     } else {
//         if (projectState.value) {
//             let a = baseDataList.value.filter(item => item.state == projectState.value)
//             return projectList.value = a
//         } else {
//             return projectList.value = baseDataList.value
//         }

//     }

// }
const goTree = (id) => {
  router.push({path: '/project/projectTree', query: {proId: id}})
}
const goTimeLine = (id, name) => {
  router.push({path: '/project/timeLine', query: {proId: id, name: name}})
}
const handleCloseDia = () => {
  isOperateDia.value = false
  operateType.value = ''
  detailInfo.value = null
}
const handleAddData = (form) => {
  addProject(form).then(res => {
    if (res.success) {
      isOperateDia.value = false
      operateType.value = ''
      detailInfo.value = null
      getProjectListFn()
    }
  })
}
const handleEditFn = (form) => {
  emitProject(form).then(res => {
    if (res.success) {
      operateType.value = ''
      detailInfo.value = null
      isOperateDia.value = false
      getProjectListFn()
    }
  })
}
const operateFn = (type, id) => {
  if (type == 1) {
    operateType.value = '新增'
    detailInfo.value = null
    isOperateDia.value = true
  } else {
    getProjectInfo(id).then(res => {
      if (res.success) {
        operateType.value = '编辑'
        detailInfo.value = res?.data ?? null
        isOperateDia.value = true
      }
    })

  }

}
const getProjectListFn = async () => {
  searchForm.state = searchForm.state || ''
  getProjectList(searchForm).then(res => {
    if (res.success) {
      projectList.value = res?.data ?? []
      baseDataList.value = res?.data ?? []
    }
  })
}
const filterDic = (state) => {
  let name = ''
  if (stateList.value && stateList.value.length > 0) {
    stateList.value.forEach(item => {
      if (item.value == state) {
        name = item.name
      }
    })
  }
  return name
}
const getDicListFn = async () => {
  await getDicList('PROJECT_STATUS').then(res => {
    if (res.success) {
      stateList.value = res?.data ?? []
      defaultStatus.value = getDicDefaultVal(res.data)
    }
  })
}
const bodyScale = () => {
  //获取当前分辨率下的可是区域宽度
  var devicewidth = document.documentElement.clientWidth
  let scale = devicewidth / 1920; // 分母——设计稿的尺寸
  let list = document.getElementsByClassName('listView')
  let box = document.getElementsByClassName('boxView')
  box[0].style.zoom = scale;
  if (list && list.length > 0) {
    for (let i = 0; i < list.length; i++) {
      list[i].style.zoom = scale;//放大缩小相应倍数
    }
  }

}
onMounted(() => {
  bodyScale()
  window.addEventListener('resize', bodyScale)
})
onUnmounted(() => {
  window.removeEventListener('resize', bodyScale)
})
onBeforeMount(async () => {
  await getDicListFn()
  await getProjectListFn()
})
</script>
<style src="@/assets/css/project.scss"></style>
<style lang="scss" scoped>
.menu-title {
  margin-bottom: 20px;
}

.list-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 12px;
  max-height: calc(100vh - 150px);
  overflow-y: auto;
  align-items: flex-start;

  :deep(.el-progress__text) {
    text-align: end;
  }

  .card-header-right {
    width: 54px;
  }
}

:deep(.el-input) {
  --el-input-height: 28px;
  --el-input-border-color: #DBDDE3;
  --el-input-border-radius: 4px;
  --el-input-padding-left: 10px;
  --el-input-padding-right: 10px;
}

:deep(.el-select__wrapper) {
  min-height: 28px;
  border-radius: 4px;
}

:deep(.el-textarea) {
  --el-input-border-color: #DBDDE3;
  --el-input-border-radius: 4px;
  --el-input-padding-left: 10px;
  --el-input-padding-right: 10px;

  .el-textarea__inner {
    height: 88px !important;
  }
}

:deep(.el-form-item__label) {
  color: #555 !important;
  font-weight: 400 !important;
}

.main-content {
  background: #f6f8fc;
  height: 100%;
}

.icon-tip img{
  width: 14px;
  height: 14px;
}

.info-footer{
  padding-top: 12px;
  border-top: 1px solid #e2e4e8;
}
</style>