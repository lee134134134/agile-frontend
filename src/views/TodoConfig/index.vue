<template>
  <div class="main-content">
    <div class="page-search">
      <div class="jus-bet-center">
        <div class="title-1">待办配置</div>
        <div class="btn-list jus-start-center gap12">
          <div class="opt-btn" @click="addTodoReminder">新增待办提醒</div>
          <div class="opt-btn" @click="isShowParamsDia = true">查看业务参数</div>
        </div>
      </div>
      <div class="search-content jus-start-center">
        <span class="status-gray">启用状态</span>
        <div :class="{'status-option-active': searchForm.isEnabled == undefined}" class="status-option"
             @click="changeStatus(undefined)">全部
        </div>
        <div :class="{'status-option-active': searchForm.isEnabled == 1}" class="status-option" @click="changeStatus(1)">
          启用中
        </div>
        <div :class="{'status-option-active': searchForm.isEnabled == 0}" class="status-option" @click="changeStatus(0)">
          未启用
        </div>
        <span class="ml30">所属模块</span>
        <el-cascader v-model="searchForm.moduleCode" :options="dicStore.moduleOptions" :props="defaultProps"
                     :reserve-keyword="false" clearable filterable placeholder="请选择"
                     style="width: 180px;height:32px;" @change="getDataList">
        </el-cascader>
<!--        <span class="ml30">待办类型关键字</span>-->
<!--        <el-input v-model="searchForm.todoTitle" clearable maxlength="10" placeholder="请输入" type="text"-->
<!--                  @blur="getDataList" @keydown.enter="getDataList"/>-->
      </div>
    </div>

    <div class="card-content-main">
      <div class="meet-list jus-flex-start">
        <TodoCard v-for="item in todoConfigList" :key="item.confId" :configInfo="item" class="meet-item"
                  @deleteFn="handleDelete" @viewFn="handleView"/>
      </div>
    </div>

    <AddTodoConfig v-if="isShowAddDia" :detailInfo="detailInfo" :isShow="isShowAddDia" :type="operateType"
                   @closeDiaFn="handleCloseAddDia" @confirmFn="handleConfirmAdd"/>
    <BusinessParamsDia v-if="isShowParamsDia" :isShow="isShowParamsDia" @closeDiaFn="handleCloseParamsDia"/>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue';
import TodoCard from './components/TodoCard.vue'
import BusinessParamsDia from './components/BusinessParamsDia.vue'
import AddTodoConfig from './components/AddTodoConfig.vue'
import {
  deleteConfigStatus, getMetaDataList,
  getRoleList,
  getSourceTypeList,
  getTodoConfigList,
  getUserList, saveConfigStatus, updateConfigStatus
} from '@/api/todoConfigApi.js';
import {getDicList} from '@/api/api';

import {useDicStore} from '@/stores/dic.js';
import {ElMessage, ElMessageBox} from "element-plus";

const dicStore = useDicStore()

const searchForm = reactive({
  isEnabled: undefined, // 0启用中 1未启用
  moduleCode: undefined,
  todoTitle: undefined,
})
const defaultProps = ref({
  children: 'children',
  label: 'name',
  value: 'value',
  emitPath: false
})

const todoConfigList = ref([])

const isShowAddDia = ref(false)
const operateType = ref('')
const detailInfo = ref()
const isShowParamsDia = ref(false) // 是否展示业务参数维护弹窗


const changeStatus = (val) => {
  searchForm.isEnabled = val
  // 筛选
  getDataList()
}

// 新增
const addTodoReminder = () => {
  detailInfo.value = null
  operateType.value = '新增'
  isShowAddDia.value = true

}

// 查看、编辑
const handleView = (type, todoInfo) => {
  if (type == 'edit') {
    operateType.value = '编辑'
  } else if (type == 'view') {
    operateType.value = '查看'
  }
  detailInfo.value = todoInfo
  isShowAddDia.value = true
}

const handleConfirmAdd = async (detailForm) => {
  if (detailForm.id) {
    const res = await updateConfigStatus(detailForm)
    if (res.success) {
      if(res.data){
        ElMessageBox.confirm(res.data, '', {
          cancelButtonText: '仅保存待办',
          confirmButtonText: '保存并启用',
          center: false,
          closeOnClickModal: false,
          autofocus: false,
          type: 'warning',
        }).then(async () => {
          const res = await updateConfigStatus({...detailForm, judgeFlag: 1, isEnabled: 1})
          handleCloseAddDia()
          getDataList()
        }).catch(async () => {
          const res = await updateConfigStatus({...detailForm,judgeFlag:1, isEnabled: 0})
          handleCloseAddDia()
          getDataList()
        })
      }else{
        // ElMessage.success('保存成功')
        handleCloseAddDia()
        getDataList()
      }
    }
  }else{
    const res = await saveConfigStatus(detailForm)
    if (res.success) {
      if(res.data){
        ElMessageBox.confirm(res.data, '', {
          cancelButtonText: '仅保存待办',
          confirmButtonText: '保存并启用',
          center: false,
          closeOnClickModal: false,
          autofocus: false,
          type: 'warning',
        }).then(async () => {
          const res = await saveConfigStatus({...detailForm, judgeFlag: 1, isEnabled: 1})
          handleCloseAddDia()
          getDataList()
        }).catch(async () => {
          const res = await saveConfigStatus({...detailForm,judgeFlag:1, isEnabled: 0})
          handleCloseAddDia()
          getDataList()
        })
      }else{
        // ElMessage.success('保存成功')
        handleCloseAddDia()
        getDataList()
      }
    }
  }
}


const handleCloseAddDia = () => {
  isShowAddDia.value = false
}

// 删除
const handleDelete = (todoInfo) => {
  ElMessageBox.confirm(`该待办配置将移出，请确认是否删除？`, '', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    center: false,
    closeOnClickModal: false,
    showClose: false,
    autofocus: false,
    type: 'warning',
  }).then(() => {
    deleteConfigStatus(todoInfo.id).then(res => {
      if (res.success) {
        getDataList()
      }
    })
  }).catch(() => {})
}

// 获取待办配置列表数据
const getDataList = () => {
  searchForm.moduleCode = searchForm.moduleCode || undefined
  searchForm.todoTitle = searchForm.todoTitle || undefined
  getTodoConfigList(searchForm).then(res => {
    if (res.success) {
      todoConfigList.value = res.data.map(item=>({
        ...item,
        isEnabled: item.isEnabled === 1 ? '1' : '0',
      }))
    }
  })
}

const getSourceTypeListFn = () => {
  getSourceTypeList().then(res => {
    if (res.success) {
      dicStore.moduleOptions = res?.data ?? []
    }
  })
}

// 获取字典
const getDicListFn = (type) => {
  getDicList(type).then(res => {
    if (res.success) {
      if (type == 'PRIORITY') {
        dicStore.priorityList = res?.data ?? []
      }
    }
  })

  getUserList().then(res=>{
    if (res.success) {
      dicStore.metaUserList = res?.data ?? []
    }
  })

  getRoleList().then(res=>{
    if (res.success) {
      dicStore.metaRoleList = res?.data ?? []
    }
  })

  getMetaDataList().then(res=>{
    if (res.success) {
      dicStore.metaList = res?.data ?? []
    }
  })
}

// 关闭待办配置弹窗
const handleCloseParamsDia = () => {
  isShowParamsDia.value = false
}

onMounted(() => {
  getSourceTypeListFn()
  getDicListFn('PRIORITY')
  getDataList()
})

</script>

<style lang="scss" scoped>
.main-content {
  background: #f6f8fc;

  .page-search {
    .gap12 {
      gap: 12px;
    }

    .ml30 {
      margin-left: 30px;
    }

    .search-content {
      margin-top: 25px;
      gap: 12px;

      .status-gray {
        font-size: 12px;
        font-weight: 400;
        color: #666;
      }

      .gap-line {
        width: 1px;
        height: 20px;
        background-color: #979797;
      }

      .status-option {
        padding: 0 12px;
        height: 28px;
        font-size: 12px;
        border-radius: 3px;
        line-height: 28px;
        text-align: center;
        cursor: pointer;
        user-select: none;
        background-color: #e5ebee;
      }

      .status-option:hover {
        background-color: #fff;
        color: #2173f7;
      }

      .status-option-active {
        background-color: #fff;
        color: #2173f7;
      }

      .el-input {
        width: 180px;
        height: 32px;
      }

    }

    .search-content > div, span {
      flex-shrink: 0;
    }
  }

  .card-content-main {
    width: 100%;
    margin-top: 30px;
    height: calc(100vh - 195px);
    overflow: auto;

    .meet-list {
      flex-wrap: wrap;
      // gap: 25px;
    }

    .meet-item {
      // width: calc((100% - 50px)/3);
      box-shadow: 0 0px 5px #e5ebff;
    }
  }

  @media screen and (max-width: 1600px) {
    .meet-list {
      gap: 25px;
    }
    .meet-item {
      width: calc((100% - 50px) / 3);
    }
  }
  @media screen and (min-width: 1600px) and (max-width: 2200px) {
    .meet-list {
      gap: 25px;
    }
    .meet-item {
      width: calc((100% - 75px) / 4);
    }
  }
  @media screen and (min-width: 2200px) {
    .meet-list {
      gap: 25px;
    }
    .meet-item {
      width: calc((100% - 100px) / 5);
    }
  }

  :deep(.el-input ) {
    --el-input-height: 32px !important;
    --el-border-radius-base: 3px !important;

    .el-input__wrapper {
      height: 28px;
    }
  }

  :deep(.el-select__wrapper) {
    --el-border-radius-base: 3px !important;
  }

  :deep(.el-textarea__inner) {
    --el-input-border-radius: 3px !important;
  }
}
</style>