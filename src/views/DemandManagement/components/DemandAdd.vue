<template>
  <el-dialog v-model="detailShow" :show-close="false" width="996px" @close="handleClose">
    <template #header="{ close }">
      <div class="dia-header">
        <div class="dia-header-title">
          <div class="title-icon"></div>
          <div class="title-text">{{ type }}需求</div>
        </div>
        <el-icon class="dia-header-close" size="16px" @click="close">
          <Close/>
        </el-icon>
      </div>
    </template>
    <div class="dia-main">
      <el-form ref="detailFromRef" :model="detailFrom" :rules="detailRule" class="dia-main-content"
               label-position="right" label-width="120px" :disabled="isReadonly"
               :hide-required-asterisk="isReadonly" :show-message="!isReadonly">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="所属项目" prop="projectId">
              <el-select v-model="detailFrom.projectId" clearable placeholder="请选择" @change="handleModel">
                <el-option v-for="item in projectList" :key="item.projectId" :label="item.name"
                           :value="item.projectId"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="no-rquired" label="功能模块" prop="projectModuleId">
              <el-cascader v-model="detailFrom.projectModuleId" :disabled="!detailFrom.projectId || isReadonly" :loading="modelListLoad"
                           :options="modelList" :props="defaultProps" :reserve-keyword="false" clearable
                           filterable
                           placeholder="请选择功能模块" style="width:100%"></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="需求标题" prop="title">
              <el-input v-model="detailFrom.title" clearable maxlength="100" placeholder="请输入需求标题"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item class="no-rquired" label="排序" prop="orderNum">
              <el-input-number v-model="detailFrom.orderNum" :min="0" :precision="0"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item class="no-rquired" label="需求描述">
              <el-input v-model="detailFrom.description" autosize clearable maxlength="300"
                        placeholder="请输入需求描述" show-word-limit type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item class="no-rquired" label="需求类型" prop="requirementType">
              <el-select v-model="detailFrom.requirementType" clearable placeholder="请选择">
                <el-option v-for="item in requirementTypeList" :key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优先级" prop="priority">
              <el-select v-model="detailFrom.priority" clearable placeholder="请选择">
                <el-option v-for="item in priorityList" :key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="需求状态" prop="status">
              <el-select v-model="detailFrom.status" clearable placeholder="请选择">
                <el-option v-for="item in statusList" :key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="no-rquired" label="执行进度" prop="progress">
              <el-select v-model="detailFrom.progress" clearable placeholder="请选择">
                <el-option v-for="item in progressList" :key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item class="no-rquired" label="开发支持" prop="devSupport">
              <el-select v-model="detailFrom.devSupport" clearable multiple collapse-tags placeholder="请选择">
                <el-option v-for="(item,index) in devSupportList" :key="index" :label="item.label"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="no-rquired" label="采集日期" prop="collectionDate">
              <el-date-picker v-model="detailFrom.collectionDate" clearable placeholder="请选择"
                              style="width: 100%" type="date" value-format="YYYY-MM-DD"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item class="no-rquired" label="确认日期">
              <el-date-picker v-model="detailFrom.confirmedDate" clearable placeholder="请选择"
                              style="width: 100%" type="date" value-format="YYYY-MM-DD"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="no-rquired" label="上线日期">
              <el-date-picker v-model="detailFrom.launchDate" clearable placeholder="请选择"
                              style="width: 100%" type="date" value-format="YYYY-MM-DD"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item class="no-rquired" label="需求分析人" prop="analystId">
              <el-select v-model="detailFrom.analystId" clearable placeholder="请选择">
                <el-option v-for="item in concatAndUniqueById(userList,userPOList)" :key="item.name" :label="item.nickname"
                           :value="item.name"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="no-rquired" label="业务负责人" prop="customerOwnerId">
              <el-input v-model="detailFrom.customerOwnerId" clearable placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item class="no-rquired" label="标签">
              <el-input v-model="detailFrom.tags" clearable maxlength="300"
                        placeholder="请用逗号分隔多个标签"></el-input>
            </el-form-item>
          </el-col>
        </el-row>


      </el-form>
      <div class="dia-footer jus-center fix-right">
        <div class="btn-cancel" @click="handleClose">取消</div>
        <div v-if="!isReadonly" class="btn-submit" @click="handleSubmit">确认</div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import {computed, onBeforeMount, reactive, ref, watch} from 'vue';
import {Close} from '@element-plus/icons-vue';
import {getModelList} from '@/api/demand.js';
import {useDicStore} from '@/stores/dic.js';
import {DateFormat} from "@/utils/date.js";

const dicStore = useDicStore()
const props = defineProps(['type', 'isShow', 'detailInfo']);
const emits = defineEmits([
  'closeDiaFn',
  'confirmFn',
  'editConfirmFn'])

// 判断是否为只读模式（编辑状态下且status为completed）
const isReadonly = computed(() => {
  return props.type === '编辑' && props.detailInfo?.status === 'completed'
})
const defaultProps = ref({
  children: 'children',
  label: 'name',
  value: 'id',
  // multiple: true,
  emitPath: false,
  checkStrictly: true,
})
const detailShow = ref(props.isShow ?? false)
const title = ref(props.type || '新增')
const detailFromRef = ref(null)
const detailFrom = reactive({
  projectId: localStorage.getItem('global_ProjectCode'),
  title: '',
  orderNum: 0,
  projectModuleId: '',
  description: '',
  requirementType: dicStore.defaultRequire,
  analystId: '',
  priority: dicStore.defaultPriority,
  status: dicStore.defaultStatus,
  progress: dicStore.defaultProgress,
  tags: '',
  devSupport: '',
  collectionDate: DateFormat(new Date()), // 采集日期
  confirmedDate: '', // 确认日期
  launchDate: '', // 上线日期
  customerOwnerId: '' // 业务负责人
})
const modelListLoad = ref(false)
const projectList = ref(dicStore.projectList ?? [])//项目下拉数据
const modelList = ref([])//功能模块下拉列表
const requirementTypeList = ref(dicStore.requirementTypeList ?? [])//需求类型下拉列表
const userList = ref(dicStore.userRoleList ?? [])//责任人、需求分析人员下拉列表
const userPOList = ref(dicStore.userPOList ?? [])//责任人、需求分析人员下拉列表
const devSupportList = ref([
  {label: '数据开发', value: 'data_dev'},
  {label: '前端开发', value: 'front_end'},
  {label: '后端开发', value: 'back_end'},
  {label: 'UI设计', value: 'ui'},
])
const priorityList = ref(dicStore.priorityList ?? [])//优先级下拉列表
const statusList = ref(dicStore.statusList ?? [])//需求状态下拉列表
const progressList = ref(dicStore.progressList ?? [])//需求进度下拉列表
const detailRule = {
  projectId: [{required: true, message: '请选择项目', trigger: 'change'}],
  projectModuleId: [{required: true, message: '请选择功能模块', trigger: 'change'}],
  orderNum: [{required: true, message: '请选择排序', trigger: 'change'}],
  requirementType: [{required: true, message: '请选择需求类型', trigger: 'change'}],
  progress: [{required: true, message: '请选择执行进度', trigger: 'change'}],
  devSupport: [{required: true, message: '请选择开发支持', trigger: 'change'}],
  collectionDate: [{required: true, message: '请选择采集日期', trigger: 'change'}],
  title: [
    {required: true, message: '请输入需求标题', trigger: 'change'},
    {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'change'}
  ],
  priority: [{required: true, message: '请选择优先级', trigger: 'change'}],
  status: [{required: true, message: '请选择需求状态', trigger: 'change'}],
  analystId: [{required: true, message: '请选择需求分析人', trigger: 'change'}],
  customerOwnerId: [{required: true, message: '请输入业务负责人', trigger: 'change'}],
}
watch(() => props.type, (newName) => {
  title.value = newName
});
const handleClose = () => {
  detailShow.value = false
  emits('closeDiaFn')
}
const handleSubmit = () => {
  if (detailFromRef.value) {
    detailFromRef.value.validate((valid) => {
      if (valid) {
        detailFrom.requirementType = detailFrom.requirementType == undefined ? '' : detailFrom.requirementType
        detailFrom.progress = detailFrom.progress == undefined ? '' : detailFrom.progress
        detailFrom.projectModuleId = detailFrom.projectModuleId == '' || detailFrom.projectModuleId == undefined ? '' : detailFrom.projectModuleId
        // 将 devSupport 数组转成逗号连接的字符串
        const devSupportValue = Array.isArray(detailFrom.devSupport) && detailFrom.devSupport.length > 0
          ? detailFrom.devSupport.join(',')
          : ''
        const submitData = {
          ...detailFrom,
          devSupport: devSupportValue
        }
        if (props.type == '新增') {
          emits('confirmFn', submitData)
        } else {
          submitData.id = props.detailInfo.id
          // 编辑模式：保存时检查 analystId 是否在 userList 中
          const analystInList = userList.value.find(
            user => user.name === detailFrom.analystId
          )
          if (!analystInList) {
            submitData.analystId = props.detailInfo.analystId
          }
          emits('editConfirmFn', submitData)
        }
      }
    })
  }
}
const handleModel = async (projectId) => {
  if (detailFrom.projectId) {
    modelListLoad.value = true
    detailFrom.projectModuleId = ''
    await getModelListFn()
  } else {
    detailFrom.projectModuleId = ''
  }
}
const getModelListFn = async () => {
  let params = {
    projectCode: detailFrom.projectId
  }
  await getModelList(params).then(res => {
    modelList.value = res?.data ?? []
  })
}

/**
 * 合并两个对象数组，并按 id 去重
 * @param {Array<Object>} a
 * @param {Array<Object>} b
 * @returns {Array<Object>} 去重后的对象数组
 */
function concatAndUniqueById(a, b) {
  const c = a.concat(b);
  // Map: key = id, value = object
  const map = new Map();
  for (const item of c) {
    // 如果 item.id 为空，你也可以选择跳过或抛错
    map.set(item.id, item);
  }
  return Array.from(map.values());
}

onBeforeMount(async () => {
  handleModel(detailFrom.projectId)
  if (props.type == '编辑') {
    detailFrom.projectId = props.detailInfo.projectId
    await handleModel(detailFrom.projectId)
    detailFrom.projectModuleId = Number(props.detailInfo.projectModuleId)
    detailFrom.title = props.detailInfo.title
    detailFrom.orderNum = props.detailInfo.orderNum ?? 0
    detailFrom.description = props.detailInfo.description
    detailFrom.requirementType = props.detailInfo.requirementType
    detailFrom.customerOwnerId = props.detailInfo.customerOwnerId
    // 编辑模式：检查需求分析人是否在 userList 中
    const analystInList = userList.value.find(
      user => user.username === props.detailInfo.analystId
    )
    detailFrom.analystId = analystInList ? props.detailInfo.analystId : (props.detailInfo.analystName || '')
    detailFrom.priority = props.detailInfo.priority
    detailFrom.status = props.detailInfo.status
    detailFrom.progress = props.detailInfo.progress
    detailFrom.tags = props.detailInfo.tags
    detailFrom.collectionDate = props.detailInfo.collectionDate || ''
    detailFrom.confirmedDate = props.detailInfo.confirmedDate || ''
    detailFrom.launchDate = props.detailInfo.launchDate || ''
    detailFrom.devSupport = props.detailInfo.devSupport ? props.detailInfo.devSupport.split(',') : []
  } else {
    // 新增模式：检查当前用户是否在 userList 中
    const userStr = localStorage.getItem('agiles_user')
    if (userStr) {
      try {
        const currentUser = JSON.parse(userStr)
        const currentUserName = currentUser.name
        
        // 检查 userList 中是否包含当前用户
        const userInList = userList.value.find(
          user => user.name === currentUserName || user.username === currentUserName
        )
        if (userInList) {
          detailFrom.analystId = userInList.name
        }
        // 否则保持 analystId = ''
      } catch (e) {
        console.error('解析当前用户信息失败:', e)
      }
    }
  }
})

</script>
<style lang="scss" scoped>
.dia-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 15px;

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
    padding-left: 50px;
    padding-right: 50px;

    .dia-main-content {
      margin-bottom: 16px;
    }

    .dia-footer {
      .btn-cancel {
        margin-right: 12px;
      }
    }

    :deep(.el-input.is-disabled),
    :deep(.el-select.is-disabled),
    :deep(.el-cascader.is-disabled),
    :deep(.el-input-number.is-disabled),
    :deep(.el-textarea.is-disabled),
    :deep(.el-date-editor.is-disabled) {
      cursor: default !important;

      .el-input__wrapper,
      .el-select__wrapper,
      .el-cascader__tags,
      .el-input-number__decrease,
      .el-input-number__increase,
      .el-textarea__inner {
        cursor: default !important;
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

  :deep(.el-select__popper) {
    max-width: none !important;
  }

  .no-rquired {
    :deep(.el-form-item__label) {
      padding-left: 12px !important;
    }
  }
}
</style>