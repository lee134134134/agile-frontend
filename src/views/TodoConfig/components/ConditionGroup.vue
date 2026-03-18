<template>
  <div :class="{ 'is-root': isRoot, 'is-disabled': disabled }" class="condition-builder">
    <div :class="isRoot ? 'main-module-section' : 'related-module-item'">
      <div class="section-header">
        <div class="section-title">
          {{ isRoot ? '主模块' : '关联模块' }}
        </div>
        <el-button 
          v-if="!isRoot && !disabled" 
          :icon="Delete" 
          link 
          type="danger" 
          @click="$emit('remove')" 
        />
      </div>

      <div class="module-selection">
        <el-select
          v-model="moduleDataModel.targetCode"
          :disabled="disabled"
          class="module-select"
          clearable
          :placeholder="isRoot ? '请选择主模块' : '请选择关联模块'"
          @change="handleModuleChange"
        >
          <el-option
            v-for="mod in moduleData"
            :key="mod.moduleCode"
            :label="mod.moduleName"
            :value="mod.moduleCode"
          />
        </el-select>
      </div>

      <div v-if="moduleDataModel.targetCode" class="conditions-section">
        <div class="subsection-header">
          <span class="subsection-title">基本条件</span>
          <el-button v-if="!disabled" :icon="Plus" link type="primary" @click="addWhereCondition">
            添加条件
          </el-button>
        </div>
        <div class="conditions-list">
          <div
            v-for="(cond, index) in moduleDataModel.whereConditions"
            :key="index"
            class="condition-row"
          >
            <div class="condition-inputs">
              <el-select
                v-model="cond.field"
                :disabled="disabled"
                class="w-140"
                clearable
                placeholder="选择字段"
                @change="handleFieldChange(cond)"
              >
                <el-option
                  v-for="field in getFieldsByModule(moduleDataModel.targetCode)"
                  :key="field.fieldCode"
                  :label="field.fieldName"
                  :value="field.fieldCode"
                />
              </el-select>

              <el-select v-model="cond.operator" :disabled="disabled || !cond.field" class="w-100" placeholder="操作符">
                <el-option
                  v-for="op in getOperatorList(cond.field, moduleDataModel.targetCode)"
                  :key="op.operator"
                  :label="op.operatorName"
                  :value="op.operator"
                />
              </el-select>

              <template v-if="cond.field">
                <el-input
                  v-if="getFieldType(cond.field, moduleDataModel.targetCode) === 'STRING'"
                  v-model="cond.value"
                  :disabled="disabled"
                  class="w-140"
                  placeholder="请输入"
                />
                <template v-else-if="['DIC', 'ENUM'].includes(getFieldType(cond.field, moduleDataModel.targetCode))">
                  <el-select
                    v-model="cond.value"
                    :disabled="disabled"
                    :multiple="isMultiSelect(cond.operator)"
                    class="w-140"
                    collapse-tags
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="opt in getFieldOptions(cond.field, moduleDataModel.targetCode)"
                      :key="opt.code"
                      :label="opt.name"
                      :value="opt.code"
                    />
                  </el-select>
                </template>
                <el-input-number
                  v-else-if="getFieldType(cond.field, moduleDataModel.targetCode) === 'NUMBER'"
                  v-model="cond.value"
                  :disabled="disabled"
                  class="w-140"
                />
                <div
                  v-else-if="['DATETIME', 'DATE'].includes(getFieldType(cond.field, moduleDataModel.targetCode))"
                  class="date-offset-input"
                >
                  <el-select v-model="cond.dateOffsetOp" :disabled="disabled" class="w-60" @change="updateDateOffsetValue(cond)">
                    <el-option v-for="opt in dateOffsetOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
                  </el-select>
                  <el-input-number v-model="cond.dateOffsetNum" :disabled="disabled" :controls="false" class="w-60" @change="updateDateOffsetValue(cond)" />
                  <el-select v-if="['DATETIME'].includes(getFieldType(cond.field, moduleDataModel.targetCode))" v-model="cond.dateOffsetUnit" :disabled="disabled" class="w-80" @change="updateDateOffsetValue(cond)">
                    <el-option v-for="opt in dateOffsetUnitOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
                  </el-select>
                  <el-select v-else v-model="cond.dateOffsetUnit" :disabled="disabled" class="w-80" @change="updateDateOffsetValue(cond)">
                    <el-option v-for="opt in dateOffsetUnitOptionsNew" :key="opt.value" :label="opt.label" :value="opt.value" />
                  </el-select>
                </div>
              </template>

              <div v-if="index !== moduleDataModel.whereConditions.length -1" class="join-select">
                <el-select v-model="cond.localOperator" :disabled="disabled" class="w-80" placeholder="且/或">
                  <el-option label="且" value="AND" />
                  <el-option label="或" value="OR" />
                </el-select>
              </div>
            </div>
            <el-button v-if="!disabled" :icon="Delete" link type="danger" @click="removeWhereCondition(index)" />
          </div>
        </div>
      </div>

      <div v-if="moduleDataModel.targetCode" class="conditions-section">
        <div class="subsection-header">
          <span class="subsection-title">聚合条件</span>
          <el-button v-if="!moduleDataModel.aggregateCondition && !disabled" :icon="Plus" link type="primary" @click="addAggregateCondition">
            添加聚合
          </el-button>
        </div>
        <div v-if="moduleDataModel.aggregateCondition" class="condition-row">
          <div class="condition-inputs aggregate-style">
            <el-select v-model="moduleDataModel.aggregateCondition.type" :disabled="disabled" class="w-120">
              <el-option label="计数 (COUNT)" value="COUNT" />
              <el-option label="求和 (SUM)" value="SUM" />
              <el-option label="平均 (AVG)" value="AVG" />
            </el-select>
            <el-select v-model="moduleDataModel.aggregateCondition.operator" :disabled="disabled" class="w-100">
              <el-option label="大于" value="GREATER_THAN" />
              <el-option label="等于" value="EQUAL" />
              <el-option label="小于" value="LESS_THAN" />
            </el-select>
            <el-input-number v-model="moduleDataModel.aggregateCondition.value" :disabled="disabled" class="w-140" />
          </div>
          <el-button v-if="!disabled" :icon="Delete" link type="danger" @click="removeAggregateCondition" />
        </div>
      </div>

      <div v-if="moduleDataModel.targetCode" class="childrens-section">
        <div class="subsection-header">
          <span class="subsection-title">子关联模块</span>
          <el-button v-if="!disabled" :icon="Plus" link type="primary" @click="addChildModule">
            添加子关联
          </el-button>
        </div>
        <div class="childrens-list">
          <condition-group
            v-for="(child, index) in moduleDataModel.childrens"
            :key="index"
            :group="child"
            :is-root="false"
            :disabled="disabled"
            @remove="removeChildModule(index)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { Delete, Plus } from '@element-plus/icons-vue'
import { useDicStore } from '@/stores/dic.js'

// 1. 声明组件名称以支持递归调用
defineOptions({
  name: 'ConditionGroup'
})

const props = defineProps<{
  group: any      // 接收主配置对象或子模块对象
  isRoot?: boolean
  disabled?: boolean // 接收全局禁用状态
}>()

const emit = defineEmits(['remove'])

const dicStore = useDicStore()
const moduleData = ref(dicStore.metaList)

/**
 * 2. 核心适配器：统一根节点和子节点的数据访问路径
 * 根节点操作 props.group.mainModule 和 props.group.relatedModules
 * 子节点直接操作 props.group 自身的属性
 */
const moduleDataModel = computed(() => {
  if (props.isRoot) {
    return {
      get targetCode() { return props.group.mainModule.mainModuleCode },
      set targetCode(val) { props.group.mainModule.mainModuleCode = val },
      get whereConditions() { return props.group.mainModule.whereConditions },
      get aggregateCondition() { return props.group.mainModule.aggregateCondition },
      set aggregateCondition(val) { props.group.mainModule.aggregateCondition = val },
      get childrens() { return props.group.relatedModules }
    }
  }
  return {
    get targetCode() { return props.group.targetModuleCode },
    set targetCode(val) { props.group.targetModuleCode = val },
    get whereConditions() { return props.group.whereConditions },
    get aggregateCondition() { return props.group.aggregateCondition },
    set aggregateCondition(val) { props.group.aggregateCondition = val },
    get childrens() { return props.group.childrens }
  }
})

// ==================== 业务工具函数 ====================

const getFieldsByModule = (code: string) => {
  if (!code) return []
  return moduleData.value.find(m => m.moduleCode === code)?.fieldMetas || []
}

const getFieldType = (fCode: string, mCode: string) => {
  return getFieldsByModule(mCode).find(f => f.fieldCode === fCode)?.fieldType || 'STRING'
}

const getFieldOptions = (fCode: string, mCode: string) => {
  return getFieldsByModule(mCode).find(f => f.fieldCode === fCode)?.fieldValue || []
}

const getOperatorList = (fCode: string, mCode: string) => {
  return getFieldsByModule(mCode).find(f => f.fieldCode === fCode)?.operList || []
}

const isMultiSelect = (op: string) => ['IN', 'NOT_IN'].includes(op)

const dateOffsetOptions = [{ label: '加', value: 'PLUS' }, { label: '减', value: 'MINUS' }]
const dateOffsetUnitOptions = [
  { label: '年', value: 'YEARS' }, { label: '月', value: 'MONTHS' },{ label: '日', value: 'DAYS' }, { label: '时', value: 'HOURS' }, { label: '分', value: 'MINUTES' }, { label: '秒', value: 'SECONDS' }, { label: '周', value: 'WEEKS' }
]
const dateOffsetUnitOptionsNew = [
  { label: '年', value: 'YEARS' }, { label: '月', value: 'MONTHS' },{ label: '日', value: 'DAYS' }, { label: '周', value: 'WEEKS' }
]
// ==================== 事件处理 ====================

const handleModuleChange = () => {
  moduleDataModel.value.whereConditions.length = 0
  moduleDataModel.value.aggregateCondition = null
  if (moduleDataModel.value.childrens) {
    moduleDataModel.value.childrens.length = 0
  }
}

const handleFieldChange = (cond: any) => {
  cond.operator = ''
  cond.value = ''
  cond.dateOffsetOp = undefined
  cond.dateOffsetNum = undefined
  cond.dateOffsetUnit = undefined
}

const updateDateOffsetValue = (cond: any) => {
  if (cond.dateOffsetOp && cond.dateOffsetNum !== undefined && cond.dateOffsetUnit) {
    const type = getFieldType(cond.field, moduleDataModel.value.targetCode)
    cond.value = `\${${type}_${cond.dateOffsetOp}_${cond.dateOffsetNum}_${cond.dateOffsetUnit}}`
  }
}

const addWhereCondition = () => {
  moduleDataModel.value.whereConditions.push({
    localOperator: 'AND', field: '', operator: '', value: ''
  })
}

const removeWhereCondition = (index: number) => {
  moduleDataModel.value.whereConditions.splice(index, 1)
}

const addAggregateCondition = () => {
  moduleDataModel.value.aggregateCondition = { type: 'COUNT', operator: 'EQUAL', value: 0 }
}

const removeAggregateCondition = () => {
  moduleDataModel.value.aggregateCondition = null
}

const addChildModule = () => {
  if (!moduleDataModel.value.childrens) {
    if (props.isRoot) props.group.relatedModules = []
    else props.group.childrens = []
  }
  moduleDataModel.value.childrens.push({
    targetModuleCode: '',
    whereConditions: [],
    aggregateCondition: null,
    childrens: []
  })
}

const removeChildModule = (index: number) => {
  moduleDataModel.value.childrens.splice(index, 1)
}
</script>

<style lang="scss" scoped>
.condition-builder {
  border-radius: 4px;
  &.is-disabled {
    cursor: not-allowed;
  }
}

.main-module-section {
  min-width: 300px;
  padding: 16px;
  background: #f5f7fa;
  border: 1px solid #e4e7ed;
  margin-bottom: 15px;
}

.related-module-item {
  margin-top: 15px;
  padding: 15px;
  background: #ffffff;
  border: 1px dashed #409eff;
  border-radius: 4px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  .section-title { font-weight: bold; color: #409eff; }
}

.conditions-section { margin-top: 15px; }
.subsection-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.condition-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.condition-inputs { 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  flex: 1; 
  &.aggregate-style {
    background: #fff8f0;
    padding: 8px;
    border: 1px solid #ffd0a6;
    border-radius: 4px;
  }
}

.childrens-section {
  margin-top: 15px;
  padding-left: 20px;
  border-left: 2px solid #ebeef5;
}

.w-60 { width: 60px; }
.w-80 { width: 80px; }
.w-100 { width: 100px; }
.w-120 { width: 120px; }
.w-140 { width: 140px; }

.date-offset-input{
  gap: 5px;
  display: flex;
}
</style>