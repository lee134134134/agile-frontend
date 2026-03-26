<template>
  <div class="main-content">
    <div class="page-search jus-bet-center">
      <div class="title-1">角色管理</div>
      <div class="roleAdd">
        <div class="opt-btn btn-margin-right" @click="handleAddFn">添加角色</div>
      </div>
    </div>
    <div class="page-table-wrapper">
      <div class="page-table">
        <!-- <div class="title-2">用户列表</div> -->
        <el-table v-loading="loading" :data="tableData" :header-cell-style="TableRowStyle" fit max-height="calc(100vh - 245px)" scrollbar-always-on
                  stripe style="width: 100%">
          <el-table-column align="left" label="角色简称" min-width="100" prop="name">
            <template #default="scope">
              <span style="color:#2173F7;">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" label="角色名称" min-width="100" prop="displayName">
          </el-table-column>
          <el-table-column align="left" label="描述" min-width="300" prop="description"
                           show-overflow-tooltip></el-table-column>
          <el-table-column align="left" label="关联功能" prop="featureNames" width="550">
            <template #default="scope">

              <div class="featureNamesClass">
                <div>{{ scope.row.featureNames ? scope.row.featureNames.length : '0' }}</div>
                <ul v-if="scope.row.featureNames">
                  <li v-for="(item, index) in scope.row.featureNames.slice(0, 4)" :key="item">{{ item }}</li>
                </ul>
                <el-tooltip :content="scope.row.featureNameStr" effect="dark" placement="top"
                            popper-class="roleModelTool">
                  <div v-if="scope.row.featureNames && scope.row.featureNames.length > 4" class="slh">.....
                  </div>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="left" label="操作" width="150">
            <template #default="scope">
              <div v-if="scope.row.name == 'admin'" style="color:#b2b2b2;font-size: 14px;">当前角色禁止操作</div>
              <div v-else>
                <el-button class="btn-text-primary" type="text"
                           @click="handleConfig(scope.row)"><el-tooltip content="权限分配" effect="light" popper-class="fix-tooltip" placement="top">
                  <img :src="powerIcon" alt="权限分配" class="table-icon"/>
                </el-tooltip>
                </el-button>
                <el-button class="btn-text-primary" type="text" @click="handleEditFn(scope.row)">
                  <el-tooltip content="编辑" effect="light" popper-class="fix-tooltip" placement="top">
                    <img :src="editIcon" alt="编辑" class="table-icon"/>
                  </el-tooltip>
                </el-button>
                <el-button class="btn-text-danger" type="text" @click="handleDelete(scope.row)">
                  <el-tooltip content="删除" effect="light" popper-class="fix-tooltip" placement="top">
                    <img :src="deleteIcon" alt="删除" class="table-icon"/>
                  </el-tooltip>
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="paginationg-box">
          <pagination :currentPage="userFrom.current" :pageSize="userFrom.size" :total="total"
                      @currentPageCurrent="currentPageCurrent" @currentPageSize="currentPageSize">
          </pagination>
        </div>
      </div>
    </div>
    <RoleOperationComVue v-if="operateDetailShow" ref="dicTypeOptRef" :isShow="operateDetailShow" :roleInfo="roleDetail"
                         :type="detailType" @closeDiaFn="handleClose" @confirmFn="handleAddRole"
                         @editConfirmFn="handleEditRole">
    </RoleOperationComVue>
    <PromissionConfigVue v-if="configShow" :data="configInfo" :isShow="configShow" :list="configList"
                         @closeDiaFn="configShow = false" @confirmFn="handleConfigSuccess"></PromissionConfigVue>
  </div>
</template>
<script setup>
import {markRaw, onMounted, reactive, ref} from 'vue';
import {TableRowStyle} from '@/utils';
import pagination from '@/components/pagination.vue';
import {ElMessageBox} from 'element-plus';
import {promissionTreeList, roleAdd, roleCheckDele, roleDele, roleEdit, roleList} from '@/api/RoleManagement.js';
import RoleOperationComVue from './components/RoleOperationCom.vue';
import PromissionConfigVue from './components/PromissionConfig.vue';
import editIcon from "@/assets/webp/edit.webp";
import powerIcon from "@/assets/webp/ico-power.webp";
import deleteIcon from "@/assets/webp/delete.webp";

const userFrom = reactive({
  size: 10,
  current: 1,
});
const total = ref(100);
const loading = ref(false);
const tableData = ref([]);
const operateDetailShow = ref(false)
const detailType = ref('')
const roleDetail = ref(null)
const configShow = ref(false)
const configInfo = ref(null)
const configList = ref([])
const currentPageCurrent = (val) => {
  userFrom.current = val
  getList()
}
const currentPageSize = (val) => {
  userFrom.size = val
  userFrom.current = 1
  getList()
}

function getList() {
  loading.value = true
  roleList(userFrom).then(res => {
    tableData.value = res.data.records;
    total.value = res.data.total;
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  })
}

const handleClose = () => {
  operateDetailShow.value = false
}
const handleAddFn = () => {
  operateDetailShow.value = true
  roleDetail.value = null
  detailType.value = '新增'
}
const handleAddRole = (data) => {
  roleAdd(data).then(res => {
    if (res.success) {
      operateDetailShow.value = false
      getBaceList()
    }
  })

}
const handleEditRole = (data) => {
  roleEdit(data).then(res => {
    if (res.success) {
      operateDetailShow.value = false
      getBaceList()
    }
  })
}
const handleEditFn = (data) => {
  operateDetailShow.value = true
  detailType.value = '编辑'
  roleDetail.value = data
}
const handleDelete = (data) => {
  roleCheckDele(data.id).then(res => {
    if (res.data) {
      ElMessageBox.confirm(`当前【${data.displayName}】删除后不可恢复，请确认是否删除？`, '', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        center: false,
        closeOnClickModal: false,
        autofocus: false,
        type: 'warning',
      }).then(() => {
        roleDele(data.id).then(res => {
          if (res.success) {
            getBaceList()
          }
        })
      }).catch(() => {
        console.log('catch')
      })
    } else {
      ElMessageBox.confirm(`当前【${data.displayName}】已被用户占用，不可删除！`, '', {
        confirmButtonText: '确认',
        showCancelButton: false,
        customClass: "dic-dialog",
        center: false,
        closeOnClickModal: false,
        autofocus: false,
        type: 'primary',
        icon: markRaw('WarningFilled'),
      }).then(() => {
        return
      }).catch(() => {
        console.log('catch')
      })
    }
  })

};
const handleConfig = (data) => {
  configInfo.value = data
  configShow.value = true
}
const handleConfigSuccess = () => {
  configShow.value = false
  configInfo.value = null
  getBaceList()
}
const getConfigList = () => {
  // promissionList().then(res => {
  // 	if (res.success) {
  // 		configList.value = res?.data ?? []
  // 	}
  // })
  promissionTreeList().then(res => {
    if (res.success) {
      configList.value = res?.data?.children ?? []
    }
  })

}
const getBaceList = () => {
  userFrom.size = 10
  userFrom.current = 1
  getList()
}
onMounted(() => {
  getList()
  getConfigList()
})
</script>
<style lang="scss" scoped>
.main-content {
  height: 100%;

  .roleAdd {
    display: flex;
    justify-content: end;

    .opt-btn {
    }
  }

  .page-search {
    margin-bottom: 20px;

    .search-content {
      margin-top: 25px;
      padding: 0 20px;
      height: 72px;

      .search-btn {
        margin-left: 20px;
        padding-right: 20px;
      }

    }

    :deep(.el-form-item) {
      margin-bottom: 0;
    }

    :deep(.el-input) {
      --el-input-height: 28px;
      --el-input-border-color: #DBDDE3;
      --el-input-border-radius: 4px;
      --el-input-padding-left: 10px;
      --el-input-padding-right: 10px;
      width: 260px;
    }

    :deep(.el-select__wrapper) {
      min-height: 28px;
      border-radius: 4px;
    }
  }

  .page-table {
    .title-2 {
      margin-bottom: 12px;
    }

    .status-content {
      text-align: center;
    }

    .current-user {
      margin-left: 5px;
      width: 80px;
      height: 24px;
      background: #E0EEFF;
      border-radius: 8px 8px 8px 8px;
      border: 1px solid #2173F7;
      color: #2173F7;
      font-size: 14px;
      font-weight: bold;
      line-height: 24px;
      text-align: center;
    }

    .btn-text-primary {
      color: #2173F7 !important;
    }

    .btn-text-danger {
      color: #2173F7 !important;
    }

    .disabled-btn {
      color: #B2B2B2 !important;
      cursor: default;
    }

    .text-btn:hover {
      opacity: 0.8 !important;
    }
  }

  .info-content {
    text-align: left;
    font-family: PingFang SC;
    font-weight: 400;
    font-size: 16px;
    color: #555555;
    line-height: 28px;

    .color-blue {
      color: #2173F7;
    }

    svg {
      width: 1.5em;
      height: 1.5em;
    }
  }

  .featureNamesClass {
    display: flex;

    & > div:nth-child(1) {
      width: 40px;
      height: 24px;
      background: #2173F7;
      text-align: center;
      line-height: 24px;
      font-size: 12px;
      color: #fff;
      border-radius: 4px;
      margin-right: 12px;
    }

    ul {
      display: flex;

      li {
        padding: 0 10px;
        height: 24px;
        background: #e0eeff;
        text-align: center;
        line-height: 24px;
        color: #2173f7;
        border-radius: 4px;
        margin-right: 12px;
        font-size: 12px;
      }
    }

    .slh {
      cursor: pointer;
      padding: 0 10px;
      height: 24px;
      background: #e0eeff;
      text-align: center;
      line-height: 24px;
      font-weight: bold;
      color: #2173f7;
      border-radius: 4px;
      font-size: 12px;
    }
  }
}

.page-table-wrapper{
  padding: 12px 16px;
  background: #fff;
  border-radius: 8px;
}
</style>
<style>
.roleModelTool {
  width: 500px !important;
}
</style>
