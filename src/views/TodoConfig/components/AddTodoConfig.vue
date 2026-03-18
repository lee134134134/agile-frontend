<template>
  <el-dialog v-model="addShow" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false"
             class="edit-dia"
             width="1200px" @close="handleClose">
    <template #header="{ close }">
      <div class="dia-header">
        <div class="dia-header-title">
          <div class="title-icon"></div>
          <div class="title-text">{{ title }}待办提醒</div>
        </div>
        <el-icon class="dia-header-close" size="16px" @click="handleClose">
          <Close/>
        </el-icon>
      </div>
    </template>
    <div class="dia-main">
      <el-form ref="detailFormRef" :model="detailForm" :rules="type == '查看' ? null : detailRule"
               class="dia-main-content"
               label-position="right" label-width="110px">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="所属模块" prop="moduleCode">
              <el-cascader v-model="detailForm.moduleCode" :disabled="isDisabled" :options="dicStore.moduleOptions"
                           :props="defaultProps" :reserve-keyword="false" clearable filterable
                           placeholder="请选择" style="width: 220px;">
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="待办类型" prop="ruleName">
              <el-input v-model="detailForm.ruleName" :disabled="isDisabled" clearable maxlength="10"
                        placeholder="请输入" style="width: 220px;"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="优先级" prop="priority">
              <el-select v-model="detailForm.priority" :disabled="isDisabled" clearable placeholder="请选择"
                         style="width: 220px;">
                <el-option v-for="item in dicStore.priorityList" :key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="标题模板" prop="ruleConfigJson.reminderTemplate.title">
              <el-input v-model="detailForm.ruleConfigJson.reminderTemplate.title" :disabled="isDisabled" clearable
                        maxlength="30" placeholder="请输入"
                        show-word-limit type="textarea"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="描述模板" prop="ruleConfigJson.reminderTemplate.content">
              <el-input id="myTextarea" v-model="detailForm.ruleConfigJson.reminderTemplate.content"
                        :disabled="isDisabled" clearable placeholder="请输入" type="textarea"/>
              <div>
                <span v-for="(item, index) in tagList" :key="index" class="tagItem" @click="handleInsetTag(item.name)">{{
                    item.name
                  }}</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="推送目标类型" prop="ruleConfigJson.notificationConfig.targetType">
              <el-radio-group v-model="detailForm.ruleConfigJson.notificationConfig.targetType" :disabled="isDisabled">
                <el-radio label="ROLE_BASED">按角色推送</el-radio>
                <el-radio label="USER_BASED">按用户推送</el-radio>
                <el-radio label="FIELD_BASED">按字段推送</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="detailForm.ruleConfigJson.notificationConfig.targetType == 'ROLE_BASED'" :span="12">
            <el-form-item label="目标角色" prop="ruleConfigJson.notificationConfig.roles">
              <el-select v-model="detailForm.ruleConfigJson.notificationConfig.roles" clearable collapse-tags :disabled="isDisabled"
                         collapse-tags-tooltip
                         multiple placeholder="请选择">
                <el-option v-for="item in dicStore.metaRoleList" :key="item.name" :label="item.displayName"
                           :value="item.name"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="detailForm.ruleConfigJson.notificationConfig.targetType == 'USER_BASED'" :span="12">
            <el-form-item label="目标用户" prop="ruleConfigJson.notificationConfig.userIds">
              <el-select v-model="detailForm.ruleConfigJson.notificationConfig.userIds" clearable collapse-tags :disabled="isDisabled"
                         collapse-tags-tooltip
                         multiple placeholder="请选择">
                <el-option v-for="item in dicStore.metaUserList" :key="item.name" :label="item.nickname"
                           :value="item.name"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="detailForm.ruleConfigJson.notificationConfig.targetType == 'FIELD_BASED'" :span="12">
            <el-form-item label="基于字段" prop="ruleConfigJson.notificationConfig.userFields">
              <el-select v-model="detailForm.ruleConfigJson.notificationConfig.userFields" clearable collapse-tags :disabled="isDisabled"
                         collapse-tags-tooltip multiple placeholder="请选择">
                <el-option v-for="item in userFieldOptions" :key="item.fieldCode" :label="item.fieldName"
                           :value="item.fieldCode"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="调度频率" prop="scheduleConfigJson.cronExpression">
              <CronEditor v-model="detailForm.scheduleConfigJson.cronExpression" :disabled="isDisabled"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item class="form-item-vertical" label="触发条件" prop="ruleConfigJson.triggerCondition">
              <div class="triggerCond-content">
                <ConditionGroup :group="detailForm.ruleConfigJson.triggerCondition" :is-root="true" :disabled="isDisabled"/>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div v-if="!isDisabled" class="dia-footer jus-flex-end">
        <div class="btn-cancel" @click="handleClose">取消</div>
        <div class="btn-submit btn-submit-fix-btn" @click="handleSubmit">保存</div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { onBeforeMount, reactive, ref, watch, nextTick } from 'vue';
import { Close } from '@element-plus/icons-vue';
import { ElMessageBox } from 'element-plus';
import { useDicStore } from '@/stores/dic.js';
import ConditionGroup from "@/views/TodoConfig/components/ConditionGroup.vue";
import CronEditor from "@/views/TodoConfig/components/CronEditor.vue";
import { getLabels, getNoticeList } from '@/api/todoConfigApi.js';

const dicStore = useDicStore()
const userFieldOptions = ref([])

const props = defineProps(['isShow', 'type', 'detailInfo', 'userInfo']);
const emits = defineEmits(['closeDiaFn', 'confirmFn'])

const addShow = ref(props.isShow ?? false)
const title = ref(props.type || '新增')
const isDisabled = ref(props.type === '查看')

const defaultProps = ref({
  children: 'children',
  label: 'name',
  value: 'value',
  emitPath: false
})

const detailFormRef = ref(null)
const tagList = ref([])

// 初始化表单的基础结构
const getInitialForm = () => ({
  id: null,
  moduleCode: null,
  ruleName: null,
  priority: null,
  ruleConfigJson: {
    reminderTemplate: { title: '', content: '' },
    notificationConfig: { targetType: '', roles: [], userIds: [], userFields: [] },
    triggerCondition: {
      mainModule: { mainModuleCode: '', whereConditions: [], aggregateCondition: null },
      relatedModules: []
    }
  },
  scheduleConfigJson: { cronExpression: '' },
  isEnabled: null,
})

let detailForm = reactive(getInitialForm())

// --- 逻辑核心：初始化与数据同步 ---

const initData = () => {
  title.value = props.type || '新增'
  isDisabled.value = props.type === '查看'
  
  if ((props.type === '编辑' || props.type === '查看') && props.detailInfo) {
    // 关键点：使用 JSON 序列化进行深拷贝，断开与父组件数据的引用关系
    const copyData = JSON.parse(JSON.stringify(props.detailInfo))
    
    // 合并数据
    Object.assign(detailForm, copyData)
    
    // 执行你的兼容性处理逻辑
    detailForm.ruleConfigJson.triggerCondition = compatibleTriggerCondition(detailForm.ruleConfigJson.triggerCondition)
  } else {
    // 新增模式，重置为初始结构
    Object.assign(detailForm, getInitialForm())
  }
  
  // 重置表单校验状态
  nextTick(() => {
    if (detailFormRef.value) detailFormRef.value.clearValidate()
  })
}

// 监听弹窗打开，每次打开时根据最新 props 初始化
watch(() => props.isShow, (val) => {
  addShow.value = val
  if (val) initData()
})

// ---------------------------

const fetchUserFieldOptions = async (moduleCode) => {
  if (!moduleCode) {
    userFieldOptions.value = []
    return
  }
  try {
    const res = await getNoticeList(moduleCode)
    userFieldOptions.value = res.success ? (res.data?.fieldMetas || []) : []
  } catch (error) {
    userFieldOptions.value = []
  }
}

watch(() => detailForm.ruleConfigJson?.triggerCondition?.mainModule?.mainModuleCode, (newCode) => {
  fetchUserFieldOptions(newCode)
}, { immediate: true })

const handleClose = () => {
  if (props.type === '查看') {
    emits('closeDiaFn')
    return
  }
  ElMessageBox.confirm(
    '输入信息即将丢失，此操作无法撤销，请确认是否取消本次编辑?',
    '',
    {
      cancelButtonText: '取消',
      confirmButtonText: '确认',
      type: 'warning',
      closeOnClickModal: false,
      showClose: false,
    }
  ).then(() => {
    emits('closeDiaFn')
  }).catch(() => {})
}

const handleSubmit = () => {
  detailFormRef.value.validate((valid) => {
    if (valid) {
      // 提交时发送的是副本数据，不会影响父组件展示，除非父组件在 confirmFn 里手动更新了列表
      emits('confirmFn', JSON.parse(JSON.stringify(detailForm)))
    }
  })
}

const handleInsetTag = (element) => {
  if(isDisabled.value) return false
  let textarea = document.getElementById('myTextarea');
  const startPos = textarea.selectionStart;
  const endPos = textarea.selectionEnd;
  const textBefore = textarea.value.substring(0, startPos);
  const textAfter = textarea.value.substring(endPos, textarea.value.length);
  const cursorPos = startPos + element.length + 2; 
  detailForm.ruleConfigJson.reminderTemplate.content = `${textBefore} ${element} ${textAfter}`;
  nextTick(() => {
    textarea.setSelectionRange(cursorPos, cursorPos);
    textarea.focus();
  })
}

const parseDateOffsetValue = (value) => {
  if (!value || typeof value !== 'string') return null
  let result = []
  if (value.includes('${DATETIME_')) {
    result = value.replace("${DATETIME_", "").replace("}", "").split("_")
  } else if (value.includes('${DATE_')) {
    result = value.replace("${DATE_", "").replace("}", "").split("_")
  }
  if (result.length >= 3) {
    return { op: result[0], num: parseInt(result[1], 10), unit: result[2] }
  }
  return null
}

const initDateOffsetFields = (cond) => {
  const parsed = parseDateOffsetValue(cond.value)
  if (parsed) {
    cond.dateOffsetOp = parsed.op
    cond.dateOffsetNum = parsed.num
    cond.dateOffsetUnit = parsed.unit
  }
}

const compatibleTriggerCondition = (triggerCondition) => {
  if (!triggerCondition) return triggerCondition
  const processConditions = (conditions) => {
    if (!conditions) return
    conditions.forEach((cond) => {
      if (cond.localOperator == null) cond.localOperator = 'AND'
      if (typeof cond.value === 'number') cond.value = String(cond.value)
      initDateOffsetFields(cond)
    })
  }
  processConditions(triggerCondition.mainModule?.whereConditions)
  const processModules = (modules) => {
    if (!modules) return
    modules.forEach(mod => {
      processConditions(mod.whereConditions)
      if (mod.childrens) processModules(mod.childrens)
    })
  }
  processModules(triggerCondition.relatedModules)
  return triggerCondition
}

onBeforeMount(async () => {
  const result = await getLabels()
  tagList.value = result.data
})

// 初始进入如果是显示的，则初始化一次
if (props.isShow) initData()

const detailRule = {
  moduleCode: [{required: true, message: '请选择所属模块', trigger: 'change'}],
  ruleName: [{required: true, message: '请输入待办类型', trigger: 'blur'}],
  'ruleConfigJson.reminderTemplate.title': [{required: true, message: '请输入标题模板', trigger: 'blur'}],
  'ruleConfigJson.notificationConfig.targetType': [{required: true, message: '请选择推送目标类型', trigger: 'change'}],
  'ruleConfigJson.notificationConfig.roles': [{required: true, message: '请选择推送目标角色', trigger: 'change'}],
  'ruleConfigJson.notificationConfig.userIds': [{required: true, message: '请选择推送目标用户', trigger: 'change'}],
  'ruleConfigJson.notificationConfig.userFields': [{required: true, message: '请选择推送目标字段', trigger: 'change'}],
  'scheduleConfigJson.cronExpression': [{required: true, message: '请选择调度频率', trigger: 'change'}],
  'ruleConfigJson.triggerCondition': [{required: true, message: '请选择触发条件', trigger: 'change'}],
}
</script>

<style lang="scss" scoped>
/* 保持原有样式不变 */
.mt20 { margin-top: 20px; }
.opt-btn-disabled { background-color: #ececec; cursor: not-allowed; color: #A4A4A4; }
.dia-header {
  display: flex; justify-content: space-between; align-items: center; padding: 8px 15px 20px;
  .dia-header-title {
    display: flex; align-items: center;
    .title-icon { margin-right: 10px; width: 4px; height: 20px; background: #2173F7; border-radius: 2px; }
    .title-text { font-family: PingFang SC; font-weight: 600; font-size: 18px; color: #1D1D1D; }
  }
  .dia-header-close { cursor: pointer; svg { width: 1.5em; height: 1.5em; } }
}
.dia-main {
  .dia-main-content { .tagItem { margin-right: 30px; color: #79B9EF; cursor: pointer; } }
  .dia-footer { display: flex; justify-content: flex-end; padding: 20px 0; .btn-cancel { margin-right: 12px; cursor: pointer; } .btn-submit { cursor: pointer; color: #2173F7; } }
}
.form-item-vertical {
  flex-direction: column;
  :deep(.el-form-item__content) { overflow-x: auto; }
  .triggerCond-content { padding: 20px; background: #fff; margin-left: 20px; }
}

.btn-submit-fix-btn{
  color: #fff !important;
}
</style>