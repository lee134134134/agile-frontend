<template>
  <el-dialog v-model="addShow" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" class="edit-dia"
             width="1000px" @close="handleClose">
    <template #header="{ close }">
      <div class="dia-header">
        <div class="dia-header-title">
          <div class="title-icon"></div>
          <div class="title-text">{{ title }}阻塞信息</div>
        </div>
        <el-icon class="dia-header-close" size="16px" @click="close">
          <Close/>
        </el-icon>
      </div>
    </template>
    <div class="dia-main">
      <el-form ref="detailFromRef" :model="detailFrom" :rules="detailRule" class="dia-main-content"
               label-position="right" label-width="110px">
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="问题名称" prop="name">
              <el-input v-model="detailFrom.name" :disabled="type == '查看'" :show-word-limit="true" clearable
                        maxlength="50"
                        placeholder="请输入">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="问题描述" prop="description">
              <el-input v-model="detailFrom.description" :disabled="type == '查看'" :show-word-limit="true" clearable
                        maxlength="200" placeholder="请输入" type="textarea">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="问题类型" prop="category">
              <el-select v-model="detailFrom.category" :disabled="type == '查看'" clearable placeholder="请选择">
                <el-option v-for="item in dicStore.problemTypeList" key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="问题级别" prop="priority">
              <el-select v-model="detailFrom.priority" :disabled="type == '查看'" clearable
                         placeholder="请选择">
                <el-option v-for="item in dicStore.priorityList" key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="问题状态" prop="status">
              <el-select v-model="detailFrom.status" :disabled="type == '查看'" clearable placeholder="请选择">
                <el-option v-for="item in dicStore.problemStatusList" key="item.value" :disabled="!item.isCanSelect"
                           :label="item.name" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="问题来源" prop="source">
              <el-select v-model="detailFrom.source" :disabled="type == '查看'" clearable placeholder="请选择">
                <el-option v-for="item in dicStore.problemSourceList" key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="跟进人" prop="assigneeBy">
              <el-select v-model="detailFrom.assigneeBy" :disabled="type == '查看'" clearable
                         placeholder="请选择">
                <el-option v-for="item in dicStore.boardSprintUserList" :key="item.userAccount" :label="item.userName"
                           :value="item.userAccount"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="no-rquired" label="预计解决时间" prop="expectedResolveDate">
              <el-date-picker v-model="detailFrom.expectedResolveDate" :clearable="true" :disabled="type == '查看'"
                              :teleported="false" format="YYYY-MM-DD" placeholder="请选择"
                              style="width: 100%;" type="date" value-format="YYYY-MM-DD"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="type == '查看'" :gutter="24">
          <el-col :span="12">
            <el-form-item class="no-rquired" label="实际解决时间" prop="resolveDate">
              <el-date-picker v-model="detailFrom.resolveDate" :clearable="true" :disabled="type == '查看'"
                              :teleported="false" format="YYYY-MM-DD" placeholder="请选择"
                              style="width: 100%;" type="date" value-format="YYYY-MM-DD"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item class="no-rquired" label="解决方案" prop="solution">
              <el-input v-model="detailFrom.solution" :disabled="type == '查看'" :show-word-limit="true" clearable
                        maxlength="200" placeholder="请输入" type="textarea">
              </el-input>
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

const dicStore = useDicStore()
const props = defineProps(['type', 'isShow', 'detailInfo', 'leaderList', 'demandId']);
const emits = defineEmits([
  'closeDiaFn',
  'confirmFn',
  'editConfirmFn'])
const addShow = ref(props.isShow ?? false)
const title = ref(props.type || '新增')
const detailFromRef = ref(null)
const detailFrom = reactive({
  name: '',
  description: '',
  category: dicStore.defaultProblemType,
  priority: dicStore.defaultPriority,
  status: dicStore.defaultProblemStatus,
  source: dicStore.defaultProblemSource,
  assigneeBy: '',
  expectedResolveDate: '',
  resolveDate: '',
  solution: '',
})
const userList = ref(props.leaderList ?? [])//负责人员下拉列表
const taskPriorityList = ref(dicStore.taskPriorityList ?? [])//优先级下拉列表
const taskStatusList = ref(dicStore.taskStatusList ?? [])//任务状态下拉列表
const taskTypeList = ref(dicStore.taskTypeList ?? [])//任务类型下拉列表
const problemStatusList = ref()//问题状态下拉列表


const detailRule = {
  name: [
    {required: true, message: '请输入问题名称', trigger: 'submit'},
    {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'submit'}
  ],
  description: [
    {required: true, message: '请输入问题描述', trigger: 'submit'},
    {min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'submit'}
  ],
  category: [{required: true, message: '请选择问题类型', trigger: 'submit'}],
  priority: [{required: true, message: '请选择问题级别', trigger: 'submit'}],
  status: [{required: true, message: '请选择问题状态', trigger: 'submit'}],
  source: [{required: true, message: '请选择问题来源', trigger: 'submit'}],
  assigneeBy: [{required: true, message: '请选择跟进人', trigger: 'submit'}],
}

watch(() => props.type, (newName) => {
  title.value = newName
});
watch(() => props.leaderList, (newName) => {
  userList.value = newName
}, {immediate: true})

watch(() => detailFrom.status, (nval) => {
  if (nval == 'processing') {
    problemStatusList.value.forEach(item => {
      if (item.value == 'pending') {
        // item.isCanSelect = false
      }
    })
  } else if (nval == 'blocking') {
    problemStatusList.value.forEach(item => {
      if (item.value == 'pending' || item.value == 'processing') {
        // item.isCanSelect = false
      }
    })
  } else if (nval == 'resolved') {
    problemStatusList.value.forEach(item => {
      if (item.value == 'pending' || item.value == 'processing' || item.value == 'blocking') {
        // item.isCanSelect = false
      }
    })
  }
}, {immediate: true, deep: true})

const handleClose = () => {
  addShow.value = false
  emits('closeDiaFn')
}
const handleSubmit = () => {
  if (detailFromRef.value) {
    detailFromRef.value.validate((valid) => {
      if (valid) {
        if (props.type == '新增') {
          emits('confirmFn', detailFrom)
        }
        if (props.type == '编辑') {
          detailFrom.id = props.detailInfo.id
          emits('editConfirmFn', detailFrom)
        }
      }
    })
  }
}


onBeforeMount(async () => {
  problemStatusList.value = dicStore.problemStatusList ?? []
  problemStatusList.value.forEach(item => {
    item.isCanSelect = true
  })

  if (props.type != '新增') {
    detailFrom.name = props.detailInfo.name
    detailFrom.description = props.detailInfo.description
    detailFrom.category = props.detailInfo.category
    detailFrom.priority = props.detailInfo.priority
    detailFrom.status = props.detailInfo.status
    detailFrom.source = props.detailInfo.source
    detailFrom.assigneeBy = props.detailInfo.assigneeBy
    detailFrom.expectedResolveDate = props.detailInfo.expectedResolveDate
    detailFrom.resolveDate = props.detailInfo.resolveDate
    detailFrom.solution = props.detailInfo.solution
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
  // padding-bottom: 30px;
  // padding-left: 20px;
  // padding-right: 20px;

  // .dia-main-content {
  //     margin-bottom: 30px;
  // }

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
    height: 28px;
    border-radius: 4px;
  }

  :deep(.el-textarea) {
    --el-input-border-color: #DBDDE3;
    --el-input-border-radius: 4px;
    --el-input-padding-left: 10px;
    --el-input-padding-right: 10px;

    .el-textarea__inner {
      min-height: 88px !important;
      max-height: 200px !important;
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