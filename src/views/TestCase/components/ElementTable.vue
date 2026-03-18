<template>
  <div class="ElementTableContainer">
    <div class="header-box">
      <div class="header-left">
        <span class="table-title">{{
            activeTab == 1 ? '设置项' : activeTab == 2 ? '变量' : activeTab == 3 ? '关键字' : '标签'
          }}列表</span>
        <el-checkbox v-if="activeTab !== 4" v-model="hideBuiltinMap[activeTab]" class="filter-checkbox"
                     label="隐藏内置元素"/>
      </div>
      <el-button icon="Plus" type="primary" @click="activeTab == 3 ? handleAddKeyword() : handleAdd()">
        创建{{ activeTab == 1 ? '设置项' : activeTab == 2 ? '变量' : activeTab == 3 ? '关键字' : '标签' }}
      </el-button>
    </div>

    <el-table v-if="activeTab !== 3" v-loading="loading" :data="filteredTableData" :header-cell-style="TableRowStyle3" :style="{ 'width': '100%'}"
              border
              class="tableData" fit height="calc(70vh - 226px)"
              scrollbar-always-on>
      <el-table-column v-for="(item,index) in tableColums" :key="item.prop + index" :label="item.label"
                       :min-width="item.width" :prop="item.prop" align="left" class-name="operateColumn">
        <template #default="{ row, column, $index}">
          <div v-if="row.isCanEdit">
            <template v-if="activeTab == 1 || activeTab == 4">
              <el-text v-if="item.prop == 'name' && optType == '编辑'" truncated>
                {{ row[`${item.prop}`] !== null && row[`${item.prop}`] !== '' ? row[`${item.prop}`] : '' }}
              </el-text>
              <el-input v-else v-model="row[column.property]" :maxlength="item.prop == 'description' ? 200 : 50"
                        clearable style="height: 30px;" type="text"/>
            </template>

            <template v-if="activeTab == 2">
              <el-text v-if="item.prop == 'name' && optType == '编辑'" truncated>
                {{ row[`${item.prop}`] !== null && row[`${item.prop}`] !== '' ? row[`${item.prop}`] : '' }}
              </el-text>
              <el-input v-else-if="item.prop == 'name' || item.prop == 'description'" v-model="row[column.property]"
                        :maxlength="item.prop == 'description' ? 200 : 50" clearable
                        style="height: 30px;" type="text"/>
              <el-select v-else-if="item.prop == 'varScopeType'" v-model="row[column.property]" clearable
                         placeholder="请选择">
                <el-option v-for="i in dicStore.autoEleVariScopeList" :key="i.value" :label="i.name" :value="i.value"/>
              </el-select>
              <el-input v-else v-model="row[column.property]" clearable style="height: 30px;" type="text"/>
            </template>

            <template v-if="activeTab == 3">
              <el-input v-if="item.prop == 'name' || item.prop == 'kwParameters'" v-model="row[column.property]"
                        :maxlength="item.prop == 'kwParameters' ? 300 : 50" clearable
                        style="height: 30px;" type="text"/>
              <el-input v-else v-model="row[column.property]" clearable style="height: 30px;" type="text"/>
            </template>
          </div>

          <template v-else>
                        <span v-if="activeTab == 2 && item.prop == 'varScopeType'">
                            <el-text truncated>
                                {{ row[`varScopeTypeDic`] || '' }}
                            </el-text>
                        </span>
            <span v-else-if="activeTab == 3 && item.prop == 'name'">
                            <el-text class="link-name" truncated>
                                {{
                                row[`${item.prop}`] !== null && row[`${item.prop}`] !== '' ? row[`${item.prop}`] : ''
                              }}
                            </el-text>
                        </span>
            <el-text v-else truncated>
              {{ row[`${item.prop}`] !== null && row[`${item.prop}`] !== '' ? row[`${item.prop}`] : '' }}
            </el-text>
          </template>
        </template>
      </el-table-column>
      <el-table-column :align="'center'" fixed="right" label="操作" width="130">
        <template #default="{ row, column, $index}">
          <div v-if="row.isCanEdit" class="jus-center" style="gap: 10px; height: 100%;">
            <span class="textBtn option" @click="handleSave($index)">保存</span>
            <span class="textBtn option" @click="handleCancel($index)">取消</span>
          </div>
          <div v-else-if="row.isBuiltin == '1'" style="color: #999;">
            内置元素
          </div>
          <div v-else class="jus-center" style="height: 100%;">
            <span class="textBtn option" @click="handleEdit(row, $index)">编辑</span>
            <span class="split-line">/</span>
            <span class="textBtn option" @click="handleDelete(row)">删除</span>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div v-if="activeTab == 3 && isShowForm" class="form-container">
      <el-form ref="keywordFormRef" :model="keywordForm" :rules="keywordRule" class="dia-main-content"
               label-position="right" label-width="80px">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="名称" prop="name">
              <el-input v-model="keywordForm.name" :disabled="keywordOptType == '编辑'" clearable maxlength="50"
                        placeholder="请输入" style="height: 32px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="参数" prop="kwParameters">
              <el-input v-model="keywordForm.kwParameters" clearable maxlength="300" placeholder="请输入"
                        style="height: 32px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属库名" prop="libraryName">
              <el-input v-model="keywordForm.libraryName" clearable maxlength="50" placeholder="请输入"
                        style="height: 32px;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="描述" prop="description">
              <el-input v-model="keywordForm.description" clearable maxlength="5000" placeholder="请输入"
                        show-word-limit type="textarea"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="jus-center gap12">
        <div class="btn-cancel" @click="handleCloseForm">取消</div>
        <div class="btn-submit" @click="handleSubmit">保存</div>
      </div>
    </div>

    <el-table v-if="activeTab == 3" v-loading="loading" :data="filteredTableData" :header-cell-style="TableRowStyle3" :height="isShowForm ? 'calc(70vh - 476px)' : 'calc(70vh - 226px)'"
              :style="{ 'width': '100%'}"
              border class="tableData"
              fit
              scrollbar-always-on>
      <el-table-column v-for="(item,index) in tableColums" :key="item.prop + index" :label="item.label"
                       :min-width="item.width" :prop="item.prop" align="left" class-name="operateColumn">
        <template #default="{ row, column, $index}">
                    <span v-if="item.prop == 'name'">
                        <el-text class="link-name" truncated @click="handleViewKeyword(row)">
                            {{ row[`${item.prop}`] !== null && row[`${item.prop}`] !== '' ? row[`${item.prop}`] : '' }}
                        </el-text>
                    </span>
          <el-text v-else truncated>
            {{ row[`${item.prop}`] !== null && row[`${item.prop}`] !== '' ? row[`${item.prop}`] : '' }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column :align="'center'" fixed="right" label="操作" width="130">
        <template #default="{ row, column, $index}">
          <div v-if="row.isBuiltin == '1'" style="color: #999;">
            内置元素
          </div>
          <div v-else class="jus-center" style="height: 100%;">
            <span class="textBtn option" @click="handleEditKeyword(row, $index)">编辑</span>
            <span class="split-line">/</span>
            <span class="textBtn option" @click="handleDelete(row)">删除</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import {computed, reactive, ref, watch} from 'vue';
import {TableRowStyle3} from '@/utils';
import {ElMessage, ElMessageBox} from 'element-plus';
import {getEleTabType, testCaseConstant} from '@/utils/testCaseConstant.js'
import {addManageEle, deleteManageEle, getSign, updateManageEle} from '@/api/testCaseApi';
import {useDicStore} from '@/stores/dic.js';

const dicStore = useDicStore()
const props = defineProps(['data', 'activeTab']);
const emits = defineEmits(['refreshListFn']);

const loading = ref(false)
const tableData = ref([])
const tableColums = ref()

// 修改：使用对象存储每个 Tab 的隐藏状态，Key 为 activeTab 的值 (1, 2, 3, 4)
const hideBuiltinMap = reactive({
  1: false, // 设置项
  2: false, // 变量
  3: false, // 关键字
  4: false  // 标签
})

// 修改：根据当前 activeTab 的状态过滤数据
const filteredTableData = computed(() => {
  // 获取当前 Tab 对应的隐藏状态
  const isHidden = hideBuiltinMap[props.activeTab];
  if (isHidden) {
    return tableData.value.filter(item => item.isBuiltin !== '1' && item.isBuiltin !== 1);
  }
  return tableData.value;
})

const variScopeOptions = ref([
  {
    configName: '用例级'
  },
  {
    configName: '模块级'
  },
])
const optType = ref(false)
const isShowForm = ref(false)
const keywordOptType = ref('')
const keywordFormRef = ref(null)
const keywordForm = reactive({
  type: 'keyword',
  name: '',
  kwParameters: '',
  libraryName: '',
  description: '',
})

watch(() => props.data, (newVal) => {
  tableData.value = newVal
}, {immediate: true})

watch(() => props.activeTab, (newVal) => {
  if (newVal == 1 || newVal == 4) {
    tableColums.value = testCaseConstant.SettingColumns
  } else if (newVal == 2) {
    tableColums.value = testCaseConstant.VariableColumns
  } else if (newVal == 3) {
    tableColums.value = testCaseConstant.KeywordColumns
  }
}, {immediate: true})


const keywordRule = {
  name: [{required: true, message: '请输入名称', trigger: 'submit'}],
  kwParameters: [{required: true, message: '请输入参数', trigger: 'submit'}],
  libraryName: [{required: true, message: '请输入所属库名', trigger: 'submit'}],
  // description: [{ required: true, message: '请输入描述', trigger: 'submit' }],
}

const handleCloseForm = () => {
  isShowForm.value = false
}

const handleSubmit = () => {
  if (keywordFormRef.value) {
    keywordFormRef.value.validate((valid) => {
      if (valid) {
        if (keywordOptType.value == '添加') {
          addManageEle(keywordForm).then(res => {
            if (res.success) {
              isShowForm.value = false
              emits('refreshListFn')
            }
          })
        } else if (keywordOptType.value == '编辑') {
          let params = {
            id: keywordForm.id,
            type: keywordForm.type,
            name: keywordForm.name,
            kwParameters: keywordForm.kwParameters,
            libraryName: keywordForm.libraryName,
            description: keywordForm.description,
          }
          updateManageEle(params).then(res => {
            if (res.success) {
              isShowForm.value = false
              emits('refreshListFn')
            }
          })
        }
      }
    })
  }
}

const handleAdd = () => {
  let hasEditData = hasEditing()
  if (hasEditData) {
    ElMessage.warning('当前有正在编辑的数据，请先保存后再进行其它操作！')
    return
  }
  let addData = {
    name: '',
    description: '',
    isCanEdit: true,
    isAddData: true, // 新增的数据
  }
  optType.value = '添加'
  tableData.value.unshift(addData)
}

// 添加关键字
const handleAddKeyword = () => {
  let obj = {
    name: '',
    kwParameters: '',
    libraryName: '',
    description: '',
  }
  Object.assign(keywordForm, obj)
  keywordOptType.value = '添加'
  isShowForm.value = true
}

// 判断是否有正在编辑的数据
function hasEditing() {
  return tableData.value.some(item => item.isCanEdit == true) || isShowForm.value
}

// 设置项保存
const handleSave = (index) => {
  // 从 filteredTableData 获取当前行
  let params = JSON.parse(JSON.stringify(filteredTableData.value[index]))
  let canSave = false
  let tipMsg = ''
  if (!params.name) {
    tipMsg = '名称'
  } else if (props.activeTab == 3 && !params.kwParameters) {
    tipMsg = '参数'
  } else if (props.activeTab == 3 && !params.libraryName) {
    tipMsg = '所属库名'
  } else {
    canSave = true
  }
  if (!canSave) {
    ElMessage.error(`【${tipMsg}】字段不能为空`)
    return
  }
  delete params.isCanEdit
  delete params.isAddData


  if (optType.value == '添加') {
    handleAddEle(params, index)
  } else {
    handleUpdateEle(params)
  }
}

// 新增保存
const handleAddEle = (params, index) => {
  params.type = getEleTabType(props.activeTab)

  // 调用保存接口
  addManageEle(params).then(res => {
    if (res.success) {
      emits('refreshListFn')
    }
  })
}

// 编辑保存
const handleUpdateEle = (params) => {
  params.varScopeType = params.varScopeType || ''
  delete params.varScopeTypeDic
  delete params.updateBy
  delete params.updateByName
  delete params.updateTime
  // return
  updateManageEle(params).then(res => {
    if (res.success) {
      isShowForm.value = false
      emits('refreshListFn')
    }
  })
}


// 取消
const handleCancel = (index) => {
  // 获取当前在显示列表中的行对象
  const row = filteredTableData.value[index];
  row.isCanEdit = false;

  // 如果是新增的数据，需要从原始 tableData 中移除
  if (row.isAddData) {
    const originalIndex = tableData.value.indexOf(row);
    if (originalIndex > -1) {
      tableData.value.splice(originalIndex, 1);
    }
  }

  emits('refreshListFn')
}

// 编辑
const handleEdit = (row, index) => {
  let hasEditData = hasEditing()
  if (hasEditData) {
    ElMessage.warning('当前有正在编辑的数据，请先保存后再进行其它操作！')
    return
  }
  row.isCanEdit = true
  optType.value = '编辑'
}

// 编辑关键字
const handleEditKeyword = (row, index) => {
  if (isShowForm.value) {
    if (row.name == keywordForm.name) {
      ElMessage.warning('当前数据正在编辑！')
    } else {
      ElMessage.warning('当前有正在编辑的数据，请先保存后再进行其它操作！')
    }
    return
  }
  Object.assign(keywordForm, row)
  keywordOptType.value = '编辑'
  isShowForm.value = true
}


const handleDelete = (row) => {
  let hasEditData = hasEditing()
  if (hasEditData) {
    ElMessage.warning('当前有正在编辑的数据，请先保存后再进行其它操作！')
    return
  }
  ElMessageBox.confirm(
      '确认删除该元素信息?',
      {
        type:'warning',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
      }
  ).then(() => {
    deleteManageEle(row.id).then(res => {
      if (res.success) {
        emits('refreshListFn') // 刷新列表数据
      }
    })
  })
}

const handleViewKeyword = (row) => {
  getSign(row.kwLink).then(res => {
    if (res.success) {
      let link = ''
      if (row.isBuiltin == '1') {
        link = res.data + '#' + row.name
      } else {
        link = res.data
      }
      window.open(link, '_blank')
    }
  })
}

defineExpose({hasEditing})

</script>

<style lang="scss" scoped>
.ElementTableContainer {
  .header-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 12px 0;
  }

  .header-left {
    display: flex;
    align-items: center;
  }

  .table-title {
    color: #333;
    font-weight: 600;
    font-size: 14px;
    margin-right: 20px;
    width: 70px;
  }

  .filter-checkbox {
    --el-checkbox-text-color: #666;
    height: auto;
  }

  .gap12 {
    gap: 12px;
  }

  .tableData {
    .option {
      cursor: pointer;
      color: #316AF6;
    }

    .option:hover {
      opacity: 0.8;
    }

    .split-line {
      color: #E9E9E9;
      margin: 0 8px;
    }

    .textBtn {
      user-select: none;
    }

    .textBtnDisabled {
      color: #808080;
      cursor: default;
    }

    .link-name {
      text-decoration: underline;
      color: #316AF6;
      cursor: pointer;
      user-select: none;
    }
  }

  .form-container {
    margin: 0 0 15px;
    background-color: #F2F6FD;
    border-radius: 8px;
    padding: 15px;
  }

  :deep(.el-button--primary) {
    background-color: #316AF6;
    border-color: #316AF6;
    padding: 8px 15px;
    height: 32px;
    border-radius: 4px;
  }

  :deep(.el-table__body-wrapper) {
    min-height: 37px !important;
  }

  :deep(.el-table__body-wrapper .el-scrollbar) {
    min-height: 37px !important;
  }

  :deep(.el-scrollbar__wrap--hidden-default) {
    min-height: 37px !important;
  }

  :deep(.el-table .el-table__cell) {
    padding: 6px 0;

    .cell {
      color: #333;
    }
  }

  :deep(.el-table td.el-table__cell > .cell) {
    line-height: 24px;
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
}
</style>