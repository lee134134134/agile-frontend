<template>
  <div class="main-content">
    <div class="title-1">系统功能管理</div>
    <el-table scrollbar-always-on :data="tableData" v-loading="loading" fit stripe style="width: 100%"
      :header-cell-style="TableRowStyle" max-height="calc(100vh - 194px)" class="mt25" show-overflow-tooltip>
      <el-table-column prop="orderNum" label="序号" min-width="60" align="center"></el-table-column>
      <el-table-column prop="name" label="功能名称" min-width="100" align="center"></el-table-column>
      <el-table-column prop="routeName" label="路由名称" min-width="150" align="center"></el-table-column>
      <el-table-column prop="description" label="功能描述" width="150" align="center" show-overflow-tooltip>
        <template #default="{ row, column, $index }">
          <span v-if="!row.isEdit" class="fontBold">{{ row.description }}</span>
          <el-input v-else v-model="row.description" maxlength="200" style="height: 28px;" clearable />
        </template>
      </el-table-column>
      <el-table-column prop="isEnabled" label="启用状态" min-width="100" align="center">
        <template #default="{ row, column, $index }">
          <el-switch v-model="row.isEnabled" :active-value="1" :inactive-value="0" :disabled="!row.isEdit"
            :before-change="() => beforeIsEnabledChange(row)"></el-switch>
          <span class="ml12" :class="[row.isEnabled == 1 ? 'fontBold' : 'fontGrey']">{{ row.isEnabled == 1 ? '启用中' :
            '未启用' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="isPublic" label="是否公开" min-width="100" align="center">
        <template #default="{ row, column, $index }">
          <el-switch v-model="row.isPublic" :active-value="1" :inactive-value="0" :disabled="!row.isEdit"
            :before-change="() => beforeIsPublicChange(row)"></el-switch>
          <span class="ml12" :class="[row.isPublic == 1 ? 'fontBold' : 'fontGrey']">{{ row.isPublic == 1 ? '公开' : '非公开'
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template #default="{ row, column, $index }">
          <div class="jus-start-center gap8">
            <div class="jus-start-center gap8">
              <el-icon class="moveIcon" @click="handleMove(row.id, 1)">
                <ArrowUp />
              </el-icon>
              <el-icon class="moveIcon" @click="handleMove(row.id, 2)">
                <ArrowDown />
              </el-icon>
            </div>
            <el-button v-if="!row.isEdit" type="text" class="btn-text-primary"
              :class="row.name == '权限管理' || row.name == '首页' ? 'disabled-btn' : 'text-btn'"
              :disabled="row.name == '权限管理' || row.name == '首页'" @click="handleEdit(row, $index)">编辑</el-button>
            <div v-else>
              <el-button type="text" class="btn-text-primary" @click="handleSave(row, $index)">保存</el-button>
              <el-button type="text" class="btn-text-primary" @click="handleCancel($index)">取消</el-button>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { TableRowStyle } from '@/utils';
import { getPermissionList, savePermission, movePermission } from '@/api/permissionApi.js'
import { ElMessage, ElMessageBox } from 'element-plus'

let loading = ref(false)
let tableData = ref([])

const getDataList = () => {
  getPermissionList().then(res => {
    if (res.success) {
      tableData.value = res.data
      tableData.value.forEach(item => {
        item.isEdit = false
      })
    }
  })
}

// 启用状态
const beforeIsEnabledChange = (val) => {
  let status
  if (val.isEnabled == 0) {
    status = true
  } else { // 要变为禁用，二次确认弹框
    status = ElMessageBox.confirm(`禁用${val.name}后将对所有用户彻底隐藏，请谨慎操作`, '', {
      cancelButtonText: '取消',
      confirmButtonText: '确认',
      center: false,
      closeOnClickModal: false,
      autofocus: false,
      type: 'warning',
    }).then(() => {
      return true
    }).catch(() => {
      return false
    })
  }
  return new Promise((resolve, reject) => {
    if (status) {
      return resolve(status)
    } else {
      return reject(status)
    }
  })
}

// 是否公开
const beforeIsPublicChange = (val) => {
  let status
  if (val.isPublic == 0) {
    status = true
  } else { // 要变为非公开，二次确认弹框
    status = ElMessageBox.confirm(`${val.name}切换为非公开后仅支持拥有权限的用户访问，请谨慎操作`, '', {
      cancelButtonText: '取消',
      confirmButtonText: '确认',
      center: false,
      closeOnClickModal: false,
      autofocus: false,
      type: 'warning',
    }).then(() => {
      return true
    }).catch(() => {
      return false
    })
  }
  return new Promise((resolve, reject) => {
    if (status) {
      return resolve(status)
    } else {
      return reject(status)
    }
  })
}


// 查询当前是否有正在编辑的信息
const hasEditing = () => {
  return tableData.value.some(item => item.isEdit == true)
}

// 点击编辑按钮
const handleEdit = (row, index) => {
  let hasEditData = hasEditing()
  if (hasEditData) {
    ElMessage.warning('当前有正在编辑的数据，请先保存后再进行其它操作！')
    return
  }
  tableData.value[index].isEdit = true
}

// 保存
const handleSave = (row, index) => {
  let params = {
    id: row.id,
    description: row.description,
    isEnabled: row.isEnabled,
    isPublic: row.isPublic
  }
  savePermission(params).then(res => {
    if (res.success) {
      tableData.value[index].isEdit = false
      getDataList() // 刷新列表
    }
  })
}

// 取消
const handleCancel = (index) => {
  tableData.value[index].isEdit = false
  getDataList() // 刷新列表
}

// 上下移动
const handleMove = (id, opt) => {
  let hasEditData = hasEditing()
  if (hasEditData) {
    ElMessage.warning('当前有正在编辑的数据，请先保存后再进行其它操作！')
    return
  }
  let params = {
    id: id,
    operation: opt
  }
  movePermission(params).then(res => {
    if (res.success) {
      getDataList() // 刷新列表
    }
  })
}

onMounted(() => {
  getDataList()
})
</script>

<style src="@/assets/css/dicManage.scss" ></style>
<style lang="scss" scoped>
.main-content {
  .mt25 {
    margin-top: 25px;
  }

  .ml12 {
    margin-left: 12px;
  }

  .gap8 {
    gap: 8px;
  }

  .fontBold {
    font-weight: bold !important;
  }

  .fontGrey {
    color: #bcbcbc;
  }

  .moveIcon {
    background: #2173f7;
    color: #fff;
    font-size: 24px;
    border-radius: 4px;
    cursor: pointer;
  }

  .moveIcon:hover {
    opacity: 0.8;
  }

  .disabled-btn {
    color: #B2B2B2 !important;
    cursor: default;
  }
}
</style>