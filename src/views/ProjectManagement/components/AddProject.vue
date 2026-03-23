<template>
  <el-dialog v-model="addShow" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" class="edit-dia"
             width="780px" @close="handleClose">
    <template #header="{ close }">
      <div class="dia-header">
        <div class="dia-header-title">
          <div class="title-icon"></div>
          <div class="title-text">{{ title }}项目</div>
        </div>
        <el-icon class="dia-header-close" size="16px" @click="close">
          <Close/>
        </el-icon>
      </div>
    </template>
    <div class="dia-main">
      <el-form ref="detailFromRef" :model="detailFrom" :rules="detailRule" class="dia-main-content"
               label-position="right" label-width="120px">
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="项目名称" prop="name">
              <el-input v-model="detailFrom.name" clearable maxlength="20" placeholder="请输入项目名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="项目状态" prop="state">
              <el-select v-model="detailFrom.state" clearable placeholder="请选择项目状态">
                <el-option v-for="item in statusList" :key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目简称" prop="shortName">
              <el-input v-model="detailFrom.shortName" clearable maxlength="20"
                        placeholder="请输入项目简称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="项目负责人" prop="projectLeader">
              <el-select v-model="detailFrom.projectLeader" clearable placeholder="请选择负责人">
                <el-option v-for="item in projectLeaderList" :key="item.id" :label="item.nickname"
                           :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品负责人">
              <el-select v-model="detailFrom.productLeader" clearable placeholder="请选择产品负责人">
                <el-option v-for="item in productLeaderList" :key="item.name" :label="item.nickname"
                           :value="item.name"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="需求分析人">
              <el-select v-model="detailFrom.demandLeader" clearable placeholder="请选择需求分析人">
                <el-option v-for="item in demandLeaderList" :key="item.name" :label="item.nickname"
                           :value="item.name"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Scrum Master：">
              <el-select v-model="detailFrom.scrumMaster" clearable placeholder="请选择Scrum Master">
                <el-option v-for="item in scrumMasterLeaderList" :key="item.name" :label="item.nickname"
                           :value="item.name"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="项目英文全称">
              <el-input v-model="detailFrom.englishName" clearable maxlength="50"
                        placeholder="请输入项目英文全称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实际结束日期">
              <el-date-picker v-model="detailFrom.actualEndDate" :clearable="true" :teleported="false"
                              format="YYYY-MM-DD" placeholder="请输入实际结束日期" type="date"
                              value-format="YYYY-MM-DD"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="计划开始日期">
              <el-date-picker v-model="detailFrom.planStartDate" :clearable="true" :teleported="false"
                              format="YYYY-MM-DD" placeholder="请输入计划开始日期" type="date"
                              value-format="YYYY-MM-DD"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划结束日期">
              <el-date-picker v-model="detailFrom.planEndDate" :clearable="true" :teleported="false"
                              format="YYYY-MM-DD" placeholder="请输入计划结束日期" type="date"
                              value-format="YYYY-MM-DD"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item class="last-child" label="项目描述">
              <el-input v-model="detailFrom.projectDescription" clearable maxlength="200"
                        placeholder="请输入项目描述"></el-input>
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
import {isValidEChar} from "@/utils/index.js";
import {getLeaderList} from '@/api/api.js';

const props = defineProps(['type', 'isShow', 'projectInfo', 'statusList', 'defaultStatus']);
const emits = defineEmits([
  'closeDiaFn',
  'confirmFn',
  'editConfirmFn'])
const addShow = ref(props.isShow ?? false)
const title = ref(props.type || '新增')
const detailFromRef = ref(null)
const detailFrom = reactive({
  name: '',
  shortName: '',
  state: '',
  englishName: '',
  projectLeader: '',
  productLeader: '',
  demandLeader: '',
  scrumMaster: '',
  planEndDate: '',
  planStartDate: '',
  actualEndDate: '',
  projectDescription: '',
})
const statusList = ref([])
const projectLeaderList = ref([]) // 项目负责人
const productLeaderList = ref([]) // 产品负责人
const demandLeaderList = ref([]) // 需求负责人
const scrumMasterLeaderList = ref([]) // SM负责人
const checkValue = (rule, value, callback) => {
  if (value == '') {
    return callback(new Error('请输入简称！'))
  } else if (!isValidEChar(value)) {
    return callback(new Error('您输入的简称格式不正确，请输入英文'))
  } else {
    return callback()
  }
}
const detailRule = {
  name: [
    {required: true, message: '请输入名称', trigger: 'submit'},
    {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'submit'}
  ],
  shortName: [
    {required: true, validator: checkValue, trigger: 'submit'},
    {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'submit'}
  ],
  state: [{required: true, message: '请选择项目状态', trigger: 'submit'}],
  projectLeader: [{required: true, message: '请选择项目负责人', trigger: 'submit'}]

}

watch(() => props.type, (newName) => {
  title.value = newName
});
watch(() => props.statusList, (newName) => {
  statusList.value = newName
  detailFrom.state = props.defaultStatus ?? ''
}, {immediate: true})

const getLeaderListFn = async () => {
  await getLeaderList({}).then(res => {
    if (res.success) {
      projectLeaderList.value = res.data.projectLeaderList ?? []
      productLeaderList.value = res.data.productLeaderList ?? []
      demandLeaderList.value = res.data.demandLeaderList ?? []
      scrumMasterLeaderList.value = res.data.scrumMasterList ?? []
    }
  })
}
const handleClose = () => {
  addShow.value = false
  emits('closeDiaFn')
}
const handleSubmit = () => {
  if (detailFromRef.value) {
    detailFromRef.value.validate((valid) => {
      if (valid) {
        // addShow.value = false
        if (props.type == '新增') {
          emits('confirmFn', detailFrom)
        } else {
          detailFrom.id = props.projectInfo.id
          detailFrom.productLeader = detailFrom.productLeader || ''
          detailFrom.demandLeader = detailFrom.demandLeader || ''
          detailFrom.scrumMaster = detailFrom.scrumMaster || ''
          emits('editConfirmFn', detailFrom)
        }
      }
    })
  }
}
onBeforeMount(async () => {
  await getLeaderListFn()

  if (props.type == '编辑') {
    detailFrom.name = props.projectInfo.name
    detailFrom.shortName = props.projectInfo.shortName
    detailFrom.state = props.projectInfo.state
    detailFrom.englishName = props.projectInfo.englishName
    detailFrom.projectLeader = props.projectInfo.projectLeader
    detailFrom.productLeader = props.projectInfo.productLeader
    detailFrom.demandLeader = props.projectInfo.demandLeader
    detailFrom.scrumMaster = props.projectInfo.scrumMaster
    detailFrom.planEndDate = props.projectInfo.planEndDate
    detailFrom.planStartDate = props.projectInfo.planStartDate
    detailFrom.actualEndDate = props.projectInfo.actualEndDate
    detailFrom.projectDescription = props.projectInfo.projectDescription
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
}

:deep(.el-form-item.last-child){
  margin-bottom: 0;
}
</style>