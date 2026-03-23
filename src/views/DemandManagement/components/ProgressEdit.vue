<template>
  <el-dialog v-model="detailShow" :show-close="false" align-center class="progress-dialog" width="900px"
             @close="handleClose">
    <template #header="{ close }">
      <div class="dia-header">
        <div class="header-title">需求进度跟踪</div>
        <el-icon class="close-icon" @click="close">
          <Close/>
        </el-icon>
      </div>
    </template>

    <div class="dia-main">
      <div class="info-card">
        <div class="card-icon"></div>
        <div class="card-content">
          <div :title="detailFrom.title" class="card-title">
            {{ detailFrom.reqName || '-' }}
          </div>
          <div class="card-subtitle" v-if="detailFrom.stageName !== '需求阶段'">
            {{ detailFrom.title || '-' }}
          </div>
        </div>
      </div>

      <el-form ref="detailFromRef" :model="detailFrom" :rules="detailRule" class="dia-main-content" label-position="right"
               label-width="90px">

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="阶段">
              <el-input v-model="detailFrom.stageName" disabled placeholder="需求阶段"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="负责人">
              <el-select v-model="detailFrom.leader" :loading="leaderLoading" clearable placeholder="请选择"
                         style="width: 100%">
                <el-option v-for="item in leaderOptions" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="阶段状态">
              <el-select v-model="detailFrom.stageStatus" clearable placeholder="请选择" style="width: 100%">
                <el-option v-for="(item,index) in dicStore.stageList" :key="index" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="计划开始">
              <el-date-picker v-model="detailFrom.planStart" :disabled-date="disabledPlanStartDate" format="YYYY-MM-DD"
                              placeholder="选择日期" style="width: 100%" type="date"
                              value-format="YYYY-MM-DD"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="计划结束">
              <el-date-picker v-model="detailFrom.planEnd" :disabled-date="disabledPlanEndDate" format="YYYY-MM-DD"
                              placeholder="选择日期" style="width: 100%" type="date"
                              value-format="YYYY-MM-DD"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="评审日期">
              <el-date-picker v-model="detailFrom.reviewDate" :disabled="detailFrom.stageName !== '需求阶段'" format="YYYY-MM-DD"
                              placeholder="选择日期" style="width: 100%" type="date"
                              value-format="YYYY-MM-DD"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="实际开始">
              <el-date-picker v-model="detailFrom.actualStart" :disabled-date="disabledActualStartDate" format="YYYY-MM-DD"
                              placeholder="选择日期" style="width: 100%" type="date"
                              value-format="YYYY-MM-DD"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="实际结束">
              <el-date-picker v-model="detailFrom.actualEnd" :disabled-date="disabledActualEndDate" format="YYYY-MM-DD"
                              placeholder="选择日期" style="width: 100%" type="date"
                              value-format="YYYY-MM-DD"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-if="detailFrom.stageName === '用户故事'" label="开发支持" prop="devSupport">
              <el-select v-model="detailFrom.devSupport" :loading="developerLoading" clearable collapse-tags placeholder="请选择"
                         multiple style="width: 100%">
                <el-option v-for="item in developerOptions" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="detailFrom.remarks" :rows="3" maxlength="300"
                        placeholder="请输入备注信息..." resize="none" show-word-limit type="textarea"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="dia-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">保 存</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import {onBeforeMount, reactive, ref, watch} from 'vue';
import {Close} from '@element-plus/icons-vue';
import {useDicStore} from "@/stores/dic.js";
import {getRoleUserList} from '@/api/demand.js';
import {getDicList} from '@/api/api.js';

// 阶段与角色映射
const STAGE_ROLE_MAP = {
  '需求阶段': 'BRA',
  '用户故事': 'BRA',
  '验收阶段': 'BRA',
  'UI设计': 'UI',
  '数据开发': 'DE',
  '前端开发': 'developer',
  '后端开发': 'developer',
  '测试阶段': 'QA'
}
const detailRule = {
  devSupport: [{required: true, message: '请选择开发支持', trigger: 'change'}],
}
const props = defineProps(['isShow', 'detailInfo']);
const emits = defineEmits([
  'closeDiaFn',
  'confirmFn'])

const detailShow = ref(props.isShow ?? false)
const detailFromRef = ref(null)
const dicStore = useDicStore()
const leaderOptions = ref([]) // 负责人下拉选项
const leaderLoading = ref(false) // 负责人加载状态
const developerOptions = ref([]) // 开发支持下拉选项
const developerLoading = ref(false) // 开发支持加载状态

// 根据第二张图的字段定义初始化数据结构
const detailFrom = reactive({
  id: '',
  reqName: '', // 依然用于显示顶部标题
  title: '', // 依然用于显示顶部标题
  stageCode: '',
  stageName: '',           // 阶段
  stageStatus: '',     // 阶段状态
  leader: '',          // 负责人
  devSupport: [], // 开发支持（用户故事阶段专用）- 数组类型支持多选
  planStart: '',       // 计划开始
  planEnd: '',         // 计划结束
  actualStart: '',     // 实际开始
  actualEnd: '',       // 实际结束
  reviewDate: '',      // 评审日期
  confirmDate: '',     // 确认日期 (虽然图1没显示，但图2有，保留以防万一)
  remarks: ''          // 备注
})

/**
 * 计划开始日期禁用逻辑：不能晚于计划结束日期（允许选择同一天）
 */
const disabledPlanStartDate = (time) => {
  if (detailFrom.planEnd) {
    const planEndTime = new Date(detailFrom.planEnd).setHours(0, 0, 0, 0)
    return time.getTime() > planEndTime
  }
  return false
}

/**
 * 计划结束日期禁用逻辑：不能早于计划开始日期（允许选择同一天）
 */
const disabledPlanEndDate = (time) => {
  if (detailFrom.planStart) {
    const planStartTime = new Date(detailFrom.planStart).setHours(0, 0, 0, 0)
    return time.getTime() < planStartTime
  }
  return false
}

/**
 * 实际开始日期禁用逻辑：不能晚于实际结束日期（允许选择同一天）
 */
const disabledActualStartDate = (time) => {
  if (detailFrom.actualEnd) {
    const actualEndTime = new Date(detailFrom.actualEnd).setHours(0, 0, 0, 0)
    return time.getTime() > actualEndTime
  }
  return false
}

/**
 * 实际结束日期禁用逻辑：不能早于实际开始日期（允许选择同一天）
 */
const disabledActualEndDate = (time) => {
  if (detailFrom.actualStart) {
    const actualStartTime = new Date(detailFrom.actualStart).setHours(0, 0, 0, 0)
    return time.getTime() < actualStartTime
  }
  return false
}
async function loadLeaderOptions(stageName) {
  const role = STAGE_ROLE_MAP[stageName]
  if (!role) {
    leaderOptions.value = []
    return
  }

  leaderLoading.value = true
  try {
    const res = await getRoleUserList(role)
    // 格式化数据：接口返回的格式可能不同，需要适配
    if (res.data && Array.isArray(res.data)) {
      leaderOptions.value = res.data.map(item => ({
        label: item.nickname,
        value: item.name
      }))
    } else {
      leaderOptions.value = []
    }
  } catch (e) {
    leaderOptions.value = []
  } finally {
    leaderLoading.value = false
  }
}

/**
 * 加载开发支持列表（用户故事阶段专用）
 */
async function loadDeveloperOptions() {
  developerLoading.value = true
  try {
    const res = await getDicList('REQ_DEVELOP_STATUs')
    // 格式化数据：value对应value，label对应name
    if (res.data && Array.isArray(res.data)) {
      developerOptions.value = res.data.map(item => ({
        label: item.name,
        value: item.value
      }))
    } else {
      developerOptions.value = []
    }
  } catch (e) {
    developerOptions.value = []
  } finally {
    developerLoading.value = false
  }
}

/**
 * 初始化数据并加载负责人列表
 */
const initData = () => {
  if (props.detailInfo) {
    // 基础信息映射
    detailFrom.id = props.detailInfo.id
    detailFrom.reqName = props.detailInfo.reqName
    detailFrom.title = props.detailInfo.title

    // 图2字段映射
    detailFrom.stageCode = props.detailInfo.stageCode
    detailFrom.stageName = props.detailInfo.stageName
    detailFrom.stageStatus = props.detailInfo.stageStatus
    detailFrom.leader = props.detailInfo.leader
    detailFrom.devSupport = props.detailInfo.devSupport
      ? props.detailInfo.devSupport.split(',').filter((item) => item)
      : []

    // 日期字段映射
    detailFrom.planStart = props.detailInfo.planStart
    detailFrom.planEnd = props.detailInfo.planEnd
    detailFrom.actualStart = props.detailInfo.actualStart
    detailFrom.actualEnd = props.detailInfo.actualEnd
    detailFrom.reviewDate = props.detailInfo.reviewDate
    detailFrom.confirmDate = props.detailInfo.confirmDate

    detailFrom.remarks = props.detailInfo.remarks

    // 根据阶段加载负责人列表
    loadLeaderOptions(detailFrom.stageName)
    
    // 如果是用户故事阶段，加载开发支持列表
    if (detailFrom.stageName === '用户故事') {
      loadDeveloperOptions()
    }
  }
}

const handleClose = () => {
  detailShow.value = false
  emits('closeDiaFn')
}

const handleSubmit = () => {
  if (detailFromRef.value) {
    detailFromRef.value.validate((valid) => {
      if (valid) {
        // 排除 title 字段，只提交需要的字段
        const submitData = {
          id: detailFrom.id,
          stageCode: detailFrom.stageCode,
          stageStatus: detailFrom.stageStatus,
          leader: detailFrom.leader,
          devSupport: Array.isArray(detailFrom.devSupport)
            ? detailFrom.devSupport.join(',')
            : '',
          planStart: detailFrom.planStart,
          planEnd: detailFrom.planEnd,
          actualStart: detailFrom.actualStart,
          actualEnd: detailFrom.actualEnd,
          reviewDate: detailFrom.reviewDate,
          confirmDate: detailFrom.confirmDate,
          remarks: detailFrom.remarks
        }
        emits('confirmFn', submitData)
      }
    })
  }
}

onBeforeMount(() => {
  initData()
})

// 监听弹窗打开时重新初始化数据（防止缓存）
watch(() => props.isShow, (val) => {
  detailShow.value = val
  if (val) {
    initData()
  }
})
</script>

<style lang="scss" scoped>
/* Dialog Header */
.dia-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 10px;

  .header-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
  }

  .close-icon {
    cursor: pointer;
    color: #909399;
    transition: color 0.3s;

    &:hover {
      color: #303133;
    }
  }
}

.dia-main {
  padding: 0 20px 20px 20px;

  /* 顶部信息卡片样式 - 仿照截图 */
  .info-card {
    display: flex;
    align-items: center;
    border-radius: 4px;
    padding: 0 20px 16px 0;
    margin-bottom: 24px;

    .card-icon {
      width: 48px;
      height: 48px;
      background: url(@/assets/images/ui/tips.png) no-repeat;
      background-size: 100%;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
      /* 这是一个柔和的阴影 */
      box-shadow: 0 4px 10px rgba(64, 158, 255, 0.1);
    }

    .card-content {
      flex: 1;
      overflow: hidden;

      .card-title {
        font-size: 14px;
        font-weight: bold;
        color: #333;
        margin-bottom: 6px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .card-subtitle {
        font-size: 12px;
        color: #909399;
        line-height: 1.4;
      }
    }
  }

  .dia-main-content {
    margin-bottom: 0;
  }

  /* 表单控件样式微调 */
  :deep(.el-form-item) {
  }

  :deep(.el-form-item__label) {
    color: #606266;
    font-weight: normal;
    padding-right: 12px;
  }

  :deep(.el-input__wrapper),
  :deep(.el-textarea__inner) {
    box-shadow: 0 0 0 1px #DCDFE6 inset;

    &:hover {
      box-shadow: 0 0 0 1px #C0C4CC inset;
    }

    &.is-focus {
      box-shadow: 0 0 0 1px #409EFF inset;
    }
  }

  /* 禁用状态样式优化 */
  :deep(.el-input.is-disabled .el-input__wrapper) {
    background-color: #F5F7FA;
    box-shadow: 0 0 0 1px #E4E7ED inset;
  }

  /* 底部按钮区域 - 右对齐 */
  .dia-footer {
    display: flex;
    justify-content: flex-end;

    .el-button {
      padding: 9px 20px;
      border-radius: 4px;
    }
  }
}
</style>