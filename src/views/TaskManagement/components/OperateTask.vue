<template>
  <el-dialog v-model="addShow" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false"
             class="edit-dia edit-dia-fix-page"
             width="780px" @close="handleClose">
    <template #header="{ close }">
      <div class="dia-header">
        <div class="dia-header-title">
          <div class="title-icon"></div>
          <div class="title-text">{{ title }}任务</div>
        </div>
        <el-icon class="dia-header-close" size="16px" @click="close">
          <Close/>
        </el-icon>
      </div>
    </template>
    <div class="dia-main">
      <el-form ref="detailFromRef" :model="detailFrom" :rules="detailRule" class="dia-main-content"
               label-position="right" label-width="90px">
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="用户故事">
              <el-input v-model="props.demandObj.title" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="任务类型" prop="taskType">
              <el-select v-model="detailFrom.taskType" clearable placeholder="请选择">
                <el-option v-for="item in taskTypeList" key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="no-rquired" label="负责人">
              <el-select v-model="detailFrom.userAccount" :disabled="type == '查看'" clearable
                         placeholder="请选择">
                <el-option v-for="item in userList" :key="item.userAccount" :label="item.userName"
                           :value="item.userAccount"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="任务名称" prop="taskName">
              <el-input v-model="detailFrom.taskName" clearable maxlength="50" placeholder="请输入任务名称"
                        show-word-limit="true">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item class="no-rquired" label="任务描述">
              <el-input v-model="detailFrom.taskDesc" clearable maxlength="200" placeholder="请输入任务描述"
                        show-word-limit="true" type="textarea">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="任务状态" prop="taskStatus">
              <el-select v-model="detailFrom.taskStatus" clearable placeholder="请选择">
                <el-option v-for="item in taskStatusList" key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="no-rquired" label="优先级">
              <el-select v-model="detailFrom.taskPriority" :disabled="type == '查看'" clearable
                         placeholder="请选择">
                <el-option v-for="item in taskPriorityList" key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="开始日期" prop="startDate">
              <el-date-picker v-model="detailFrom.startDate" :clearable="true" :teleported="false" :disabled-date="disableStartDate"
                              format="YYYY-MM-DD" placeholder="请选择开始日期" type="date"
                              value-format="YYYY-MM-DD"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束日期" prop="endDate">
              <el-date-picker v-model="detailFrom.endDate" :clearable="true" :disabled-date="disableEndDate" :teleported="false"
                              format="YYYY-MM-DD"
                              placeholder="请选择结束日期" type="date" value-format="YYYY-MM-DD"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="预估工时" prop="estimatedHours">
              <el-input-number v-model="detailFrom.estimatedHours" :max="8" :min="1" :precision="1"
                               :step="0.5" clearable controls-position="right" placeholder="请选择"
                               style="width: 100%;"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div class="dia-footer jus-flex-end">
        <div class="btn-cancel" @click="handleClose">取消</div>
        <div class="btn-submit" @click="handleSubmit">确认</div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import {onBeforeMount, reactive, ref, watch} from 'vue';
import {Close} from '@element-plus/icons-vue';
import {useDicStore} from '@/stores/dic.js';
import {ElMessage} from 'element-plus';

const dicStore = useDicStore()
const props = defineProps(['type', 'isShow', 'detailInfo', 'leaderList', 'demandId', 'demandObj']);
const emits = defineEmits([
  'closeDiaFn',
  'confirmFn',
  'editConfirmFn'])
const addShow = ref(props.isShow ?? false)
const title = ref(props.type || '新增')
const detailFromRef = ref(null)
const detailFrom = reactive({
  taskName: '',
  taskDesc: '',
  taskType: dicStore.defaultTaskType,
  userAccount: '',
  taskStatus: dicStore.defaultTaskStatus,
  taskPriority: dicStore.defaultTaskPriority,
  startDate: '',
  endDate: '',
  estimatedHours: '1',
})
const userList = ref(props.leaderList ?? [])//负责人员下拉列表
const taskPriorityList = ref(dicStore.taskPriorityList ?? [])//优先级下拉列表
const taskStatusList = ref(dicStore.taskStatusList ?? [])//任务状态下拉列表
const taskTypeList = ref(dicStore.taskTypeList ?? [])//任务类型下拉列表

const detailRule = {
  taskName: [
    {required: true, message: '请输入任务名称', trigger: 'submit'},
    {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'submit'}
  ],
  taskType: [{required: true, message: '请选择任务类型', trigger: 'submit'}],
  taskStatus: [{required: true, message: '请选择任务状态', trigger: 'submit'}],
  startDate: [{type: 'date', required: true, message: '请选择开始日期', trigger: 'submit'}],
  endDate: [{type: 'date', required: true, message: '请选择结束日期', trigger: 'submit'}],
  estimatedHours: [{required: true, message: '请输入预估工时', trigger: 'submit'}],
}

watch(() => props.type, (newName) => {
  title.value = newName
});
watch(() => props.leaderList, (newName) => {
  userList.value = newName
}, {immediate: true})

const handleClose = () => {
  addShow.value = false
  emits('closeDiaFn')
}
const handleSubmit = () => {
  if (detailFromRef.value) {
    detailFromRef.value.validate((valid) => {
      if (valid) {
        if (detailFrom.estimatedHours < 1) {
          ElMessage.warning('最小预估工时为1！')
          return
        }
        if (props.type == '添加') {
          detailFrom.storyCode = props.demandId
          detailFrom.userAccount = detailFrom.userAccount ? detailFrom.userAccount : ''
          emits('confirmFn', detailFrom)
          return
        }
        if (props.type == '编辑') {
          detailFrom.storyCode = props.demandId
          detailFrom.taskCode = props.detailInfo.taskCode
          detailFrom.userAccount = detailFrom.userAccount ? detailFrom.userAccount : ''
          emits('editConfirmFn', detailFrom)
        }
      }
    })
  }
}
const disableStartDate = (time) => {
  if(!detailFrom.endDate) return false;
  return time.getTime() > new Date(detailFrom.endDate).setHours(0,0,0,0);
}
const disableEndDate = (time) => {
  if(!detailFrom.startDate) return false;
  return time.getTime() < new Date(detailFrom.startDate).setHours(0,0,0,0);
}
onBeforeMount(async () => {
  if (props.type != '添加') {
    detailFrom.taskName = props.detailInfo.taskName
    detailFrom.taskDesc = props.detailInfo.taskDesc
    detailFrom.taskType = props.detailInfo.taskType
    detailFrom.userAccount = props.detailInfo.userAccount
    detailFrom.taskStatus = props.detailInfo.taskStatus
    detailFrom.taskPriority = props.detailInfo.taskPriority
    detailFrom.startDate = props.detailInfo.startDate
    detailFrom.endDate = props.detailInfo.endDate
    detailFrom.estimatedHours = props.detailInfo.estimatedHours
  } else {
    const userInfo = JSON.parse(localStorage.getItem("agiles_user"))
    let selectItem = userList.value.filter(item => item.userAccount === userInfo.name)
    if (selectItem.length > 0) {
      detailFrom.userAccount = selectItem[0].userAccount
    } else {
      detailFrom.userAccount = ''
    }
  }
})
</script>
<style lang="scss" scoped>
.dia-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 15px 20px;

  .dia-header-title {
    display: flex;
    align-items: center;

    .title-icon {
      margin-right: 10px;
      width: 4px;
      height: 20px;
      background: #2173F7;
      border-radius: 2px 2px 2px 2px;
    }

    .title-text {
      font-family: PingFang SC;
      font-weight: 600;
      font-size: 16px;
      color: #1D1D1D;
      line-height: 22px;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
  }

  .dia-header-close {
    cursor: pointer;

    svg {
      width: 1.5em;
      height: 1.5em;
    }
  }
}

.dia-main {

  .dia-footer {
    .btn-cancel {
      margin-right: 12px;
    }
  }

  .info-text {
    font-family: 'PingFangSC';
    color: #000;
    font-size: 10px;
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

  .no-rquired {
    :deep(.el-form-item__label) {
      padding-left: 12px !important;
    }
  }
}
</style>