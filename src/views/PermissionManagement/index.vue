<template>
  <div class="main-content">
    <div class="page-container">
      <div class="page-header jus-bet-center">
        <div class="header-left jus-bet-center">
          <div class="title-4">菜单权限管理</div>
          <div v-if="!showAll" class="btn-all jus-center" @click="expandAllFn">
            全部展开
            <el-icon color="#666" size="14px">
              <ArrowDown/>
            </el-icon>
          </div>
          <div v-if="showAll" class="btn-all jus-center" @click="expandAllFn">
            全部收起
            <el-icon color="#666" size="14px">
              <ArrowUp/>
            </el-icon>
          </div>
          <div class="btn-see jus-center">
            只看菜单
            <div v-if="isSeeAll" class="check-box" @click="handleSelctedSee"></div>
            <div v-if="!isSeeAll" class="checked-box" @click="handleSelctedSee">
              <el-icon color="#2173f7" size="12px">
                <Check/>
              </el-icon>
            </div>
          </div>
        </div>
        <div class="btn-add-menu" @click="showAddDia = true">新增</div>
      </div>
      <section class="page-table">
        <el-table ref="tableRef" v-loading="loading" :data="tableData" :default-expand-all="true"
                  :header-cell-style="TableRowStyle3"
                  :tree-props="{ children: 'children' }"
                  height="calc(100vh - 170px)" row-key="treeCode"
                  scrollbar-always-on stripe style="width: 100%">
          <el-table-column align="left" label="功能名称" min-width="200" prop="title">
            <template #default="scope">
              <span v-if="scope.row.type == 0" class="text-level1">{{ scope.row.title }}</span>
              <span v-if="scope.row.type == 1" class="text-level2">{{ scope.row.title }}</span>
              <span v-if="scope.row.type == 2" class="text-level3">{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" label="类型" min-width="80">
            <template #default="scope">
              <div class="jus-start-center">
                <div v-if="scope.row.type == 0" class="type-ml jus-center type-content">
                  <img alt="" class="icon-type" src="@/assets/images/log/type-ml_icon@2x.png">
                  目录
                </div>
                <div v-if="scope.row.type == 1" class="type-menu jus-center type-content">
                  <img alt="" class="icon-type" src="@/assets/images/log/type-menu_icon@2x.png">
                  菜单
                </div>
                <div v-if="scope.row.type == 2" class="type-btn jus-center type-content">
                  <img alt="" class="icon-type" src="@/assets/images/log/type-btn_icon@2x.png">
                  按钮
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="left" label="路由" min-width="200" prop="router">
            <template #default="scope">
              <span>{{ scope.row.routeName || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column align="left" label="功能描述" min-width="180" prop="description"
                           show-overflow-tooltip></el-table-column>
          <el-table-column align="left" label="启用状态" width="100" prop="isEnabled">
            <template #default="{ row, column, $index }">
              <img v-if="row.isEnabled == 1" alt="启用中" class="ico-img" src="@/assets/webp/archived.webp">
              <img v-else alt="未启用" class="ico-img" src="@/assets/webp/archived_no.webp">
              <span :class="[row.isEnabled == 1 ? 'fontBold' : '']" class="ml12">
                            {{ row.isEnabled == 1 ? '启用中' : '未启用' }}
                        </span>
            </template>
          </el-table-column>
          <el-table-column align="left" label="是否公开" width="100" prop="isPublic">
            <template #default="{ row, column, $index }">
              <i v-if="row.isPublic == 1" class="ico-dot"></i>
              <i v-else class="ico-dot gray"></i>
              <span :class="[row.isPublic == 1 ? 'fontBold' : '']" class="ml12">
                            {{ row.isPublic == 1 ? '公开' : '非公开' }}
                        </span>
            </template>
          </el-table-column>
          <el-table-column align="left" label="操作" width="200">
            <template #default="scope">
              <div class="opt-content jus-start-center">
                <div :class="{ 'dis-btn': scope.row.type == 2 || scope.row.name == 'home' }" class="text-btn"
                     @click="handleMoveFn(1, scope.row)">
                  <img v-if="scope.row.type == 2 || scope.row.name == 'home'" :src="upGrayIcon" alt="上移" class="table-icon" title="上移"/>
                  <img v-else :src="upIcon" alt="上移" class="table-icon" title="上移"/>
                </div>
                <div :class="{ 'dis-btn': scope.row.type == 2 || scope.row.name == 'home' }" class="text-btn"
                     @click="handleMoveFn(2, scope.row)">
                  <img v-if="scope.row.type == 2 || scope.row.name == 'home'" :src="downGrayIcon" alt="下移" class="table-icon" title="下移"/>
                  <img v-else :src="downIcon" alt="下移" class="table-icon" title="下移"/>
                </div>
                <div :class="{ 'dis-btn': scope.row.type == 2 || scope.row.name == 'home' }" class="text-btn"
                     @click="handleMoveNode(scope.row)">
                  <img v-if="scope.row.type == 2 || scope.row.name == 'home'" :src="moveGrayIcon" alt="移动至" class="table-icon" title="移动至"/>
                  <img v-else :src="moveIcon" alt="移动至" class="table-icon" title="移动至"/>
                </div>
                <div :class="{ 'dis-btn': scope.row.name == 'home' }" class="text-btn" @click="handleEditNode(scope.row)">
                  <img v-if="scope.row.name == 'home'" :src="editGrayIcon" alt="编辑" class="table-icon" title="编辑"/>
                  <img v-else :src="editIcon" alt="编辑" class="table-icon" title="编辑"/>
                </div>
                <div :class="{ 'dis-btn': scope.row.name == 'home' }" class="text-btn" @click="handleDeleFn(scope.row)">
                  <img v-if="scope.row.name == 'home'" :src="deleteGrayIcon" alt="删除" class="table-icon" title="删除"/>
                  <img v-else :src="deleteIcon" alt="删除" class="table-icon" title="删除"/>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </section>
    </div>
    <AddDia v-if="showAddDia" :isShow="showAddDia" :treeList="treeSelectList" @closeDiaFn="showAddDia = false"
            @confirmBtnFn="handleSaveBtn" @confirmFn="handleSaveMenu"></AddDia>
    <MoveDia v-if="showMoveDia" :isShow="showMoveDia" :nodeInfo="moveInfo" :treeList="treeSelectList"
             @closeDiaFn="handleCloseMoveDia" @confirmFn="handleMoveSave"></MoveDia>
    <EditDia v-if="showEditDia" :isShow="showEditDia" :nodeInfo="detailInfo" @closeDiaFn="handleCloseEditDia"
             @confirmBtnFn="handleSaveBtnEdit" @confirmFn="handleSaveMenuEdit"></EditDia>
  </div>
</template>
<script setup>
import {nextTick, onBeforeMount, ref} from 'vue';
import {TableRowStyle3} from '@/utils';
import AddDia from './components/AddDia.vue';
import MoveDia from './components/MoveDia.vue';
import EditDia from './components/EditDia.vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import {
  addSystemBtns,
  addSystemNodes,
  deleteSystemBtn,
  deleteSystemFeature,
  editSystemBtns,
  getPermissionMenuList,
  getTreeSelectList,
  movePermission,
  moveToOtherDir,
  savePermission
} from '@/api/permissionApi.js'
import {getDicList} from '@/api/api';
import {useDicStore} from '@/stores/dic.js';
import deleteGrayIcon from "@/assets/webp/ico-delete.webp";
import deleteIcon from "@/assets/webp/ico-delete-active.webp";
import editGrayIcon from "@/assets/webp/ico-edit.webp";
import editIcon from "@/assets/webp/ico-edit-active.webp";
import upIcon from "@/assets/webp/ico-up-active.webp";
import upGrayIcon from "@/assets/webp/ico-up.webp";
import downIcon from "@/assets/webp/ico-down-active.webp";
import downGrayIcon from "@/assets/webp/ico-down.webp";
import moveGrayIcon from "@/assets/webp/ico-move.webp";
import moveIcon from "@/assets/webp/ico-move-active.webp";

const dicStore = useDicStore()
const loading = ref(false)
const showAll = ref(true)
const isSeeAll = ref(true)
const tableRef = ref(null)
const tableData = ref([])
const showAddDia = ref(false)
const showMoveDia = ref(false)
const showEditDia = ref(false)
const moveInfo = ref(null)
const detailInfo = ref(null)
const treeSelectList = ref([])
const handleSaveMenu = (data) => {
  addSystemNodes(data).then(res => {
    if (res.success) {
      showAddDia.value = false
      handleInit()
    }
  })
}
const handleSaveBtn = (data) => {
  addSystemBtns(data).then(res => {
    if (res.success) {
      showAddDia.value = false
      handleInit()
    }
  })
}
const handleMoveNode = (data) => {
  if (data.type == 2 || data.name == 'home') return
  moveInfo.value = data
  showMoveDia.value = true
}
const handleMoveSave = (data) => {
  moveToOtherDir(data).then(res => {
    if (res.success) {
      moveInfo.vlaue = null
      showMoveDia.value = false
      handleInit()
    }
  })
}
const handleCloseMoveDia = () => {
  moveInfo.vlaue = null
  showMoveDia.value = false
}
const handleCloseEditDia = () => {
  detailInfo.value = null
  showEditDia.value = false
}
const handleSaveMenuEdit = (data) => {
  savePermission(data).then(res => {
    if (res.success) {
      showEditDia.value = false
      detailInfo.value = null
      handleInit()
    }
  })

}
const handleSaveBtnEdit = (data) => {
  console.log(data, '--编辑保存按钮接口调用')
  editSystemBtns(data).then(res => {
    if (res.success) {
      showEditDia.value = false
      detailInfo.value = null
      handleInit()
    }
  })
}
const handleEditNode = (data) => {
  if (data.name == 'home') return
  detailInfo.value = data
  showEditDia.value = true
}
const handleSelctedSee = () => {
  isSeeAll.value = !isSeeAll.value
  getList()
}
const handleDeleFn = (data) => {
  if (data.name == 'home') return
  if (data.type == 0) {
    if (data.children && data.children.length > 0) {
      ElMessage.warning('当前目录下存在子节点，不允许删除！')
      return
    } else {
      ElMessageBox.confirm('删除后不可恢复，请谨慎操作，请确认是否删除该目录？', '', {
        cancelButtonText: '取消',
        confirmButtonText: '确认',
        center: false,
        closeOnClickModal: false,
        autofocus: false,
        type: 'warning',
      }).then(() => {
        handleDeleMenu({'id': data.id})
      }).catch(() => {
        console.log('已取消')
      })
    }
  } else if (data.type == 1) {
    ElMessageBox.confirm(`删除后不可恢复，请谨慎操作，请确认是否删除该菜单！`, '', {
      cancelButtonText: '取消',
      confirmButtonText: '确认',
      center: false,
      closeOnClickModal: false,
      autofocus: false,
      type: 'warning',
    }).then(() => {
      handleDeleMenu({'id': data.id})
    }).catch(() => {
      console.log('已取消')
    })
  } else {
    ElMessageBox.confirm(`删除后将影响相关操作权限，请谨慎操作，请确认是否删除该按钮！`, '', {
      cancelButtonText: '取消',
      confirmButtonText: '确认',
      center: false,
      closeOnClickModal: false,
      autofocus: false,
      type: 'warning',
    }).then(() => {
      deleteSystemBtn({'id': data.id}).then(res => {
        if (res.success) {
          handleInit()
        }
      })
    }).catch(() => {
      console.log('已取消')
    })
  }
}

function handleDeleMenu(params) {
  deleteSystemFeature(params).then(res => {
    if (res.success) {
      handleInit()
    }
  })
}

function handleMoveFn(type, data) {
  if (data.type == 2 || data.name == 'home') return
  let params = {
    'id': data.id,
    'operation': type
  }
  movePermission(params).then(res => {
    if (res.success) {
      handleInit()
    }
  })
}

function expandAllFn() {
  showAll.value = !showAll.value
  nextTick(() => {
    tableRef.value.toggleRowExpansion(tableData.value, showAll.value)
    tableData.value.forEach(item => {
      tableRef.value.toggleRowExpansion(item, showAll.value)
      expandChildren(item, showAll.value)
    });
  })

}

function expandChildren(node, isExpand) {
  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      tableRef.value.toggleRowExpansion(child, isExpand)
      expandChildren(child, isExpand)
    })
  }
}

async function getTreeList() {
  treeSelectList.value = []
  getTreeSelectList().then(res => {
    if (res.success) {
      treeSelectList.value.push(res.data)
    }
  })
}

async function getList() {
  loading.value = true
  tableData.value = []
  let nodeNeed = isSeeAll.value == true ? 0 : 1
  getPermissionMenuList(nodeNeed).then(res => {
    if (res.success) {
      loading.value = false
      showAll.value = true
      tableData.value = res?.data?.children ?? []
    }
  })
}

async function handleInit() {
  await getTreeList()
  await getList()
}

const getDicListFn = (type) => {
  getDicList(type).then(res => {
    if (res.success) {
      if (type == 'NODE_TYPE') {
        dicStore.groupTypeList = res?.data ?? []
      }
    }
  })
}

onBeforeMount(async () => {
  await handleInit()
  getDicListFn('NODE_TYPE') // 分组类型
})
</script>
<style lang="scss" scoped>
.main-content {
  padding: 12px 20px;
  height: 100%;

  .page-container {

    .page-header {
      margin-bottom: 22px;

      .header-left {
        gap: 25px;

        .btn-all {
          gap: 5px;
          color: #666;
          font-weight: 400;
          font-size: 14px;
          cursor: pointer;
        }

        .btn-see {
          gap: 5px;
          color: #666;
          font-weight: 400;
          font-size: 14px;
          line-height: 17px;

          .check-box {
            width: 14px;
            height: 14px;
            border: 1px solid #e2e4e8;
            cursor: pointer;
          }

          .checked-box {
            width: 14px;
            height: 14px;
            line-height: 14px;
            text-align: center;
            border: 1px solid #2173f7;
            cursor: pointer;
          }

        }
      }

      .btn-add-menu {
        width: 76px;
        height: 28px;
        line-height: 28px;
        border: 1px solid #2173f7;
        border-radius: 3px;
        background: #2173f7;
        color: #fff;
        font-size: 12px;
        font-weight: 500;
        text-align: center;
        cursor: pointer;
        letter-spacing: 1px;
      }

      .btn-add-menu:hover {
        opacity: 0.6;
      }
    }

    .page-table {
      padding: 16px;
      background: #fff;
      border-radius: 4px;
    }

    .opt-content {
      gap: 20px;

      .icon-btn {
        width: 12px;
        height: 12px;
        display: block;
        cursor: pointer;
      }

      .text-btn {
        color: #2173f7;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
      }

      .dis-btn {
        opacity: 0.5 !important;
        cursor: default !important;
      }

      .text-btn:hover {
        opacity: 0.6;
      }
    }

    .type-content {
      width: 53px;
      height: 21px;
      line-height: 21px;
      border-radius: 4px;
      text-align: center;
      font-weight: 400;
      font-size: 12px;
      gap: 3px;
    }

    .icon-type {
      width: 12px;
      height: 12px;
      display: block;
    }

    .type-ml {
      background: linear-gradient(270deg, rgba(163, 189, 255, 0.18) 0%, rgba(93, 88, 254, 0.18) 100%);
      border: 1px solid #5d58ff2e;
      color: #675fee;
    }

    .type-menu {
      background: linear-gradient(270deg, rgba(223, 241, 255, 0.9) 0%, rgba(198, 215, 254, 0.9) 100%);
      border: 1px solid rgba(184, 213, 255, 0.9);
      color: #1258c7;
    }

    .type-btn {
      background: linear-gradient(270deg, rgba(255, 224, 206, 0.65) 0%, rgba(255, 191, 165, 0.65) 100%);
      border: 1px solid rgba(250, 214, 195, 0.65);
      color: #ff5b02;
    }

    :deep(.el-table__cell) {
      position: static !important;
    }

    :deep(.el-table__cell .cell) {
      overflow: inherit !important;
    }
  }

  .mt25 {
    margin-top: 25px;
  }

  .ml12 {
    margin-left: 4px;
    font-size: 14px;
  }

  .gap8 {
    gap: 8px;
  }

  .fontBold {
    font-weight: 500 !important;
  }

  .fontGrey {
    color: #bcbcbc;
  }

  .text-level1 {
    font-size: 14px;
    color: #333;
    font-weight: 550;
  }

  .text-level2 {
    font-size: 14px;
    color: #333;
    font-weight: 400;
  }

  .text-level3 {
    font-size: 14px;
    color: #666;
    font-weight: 400;
  }

  :deep(.el-table) {
    .el-table__cell {
      height: 37px !important;
      line-height: 37px !important;
      padding: 0;

    }

    td.el-table__cell,
    th.el-table__cell.is-leaf {
      border-bottom: 1px solid #e2e4e8 !important;
    }

    --el-table-border-color: none !important
  }
}

.ico-img {
  width: 12px;
  height: 12px;
  vertical-align: -1px;
}

.ico-dot{
  display: inline-block;
  margin-right: 4px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #2173f7;
  vertical-align: 2px;

  &.gray{
    background: #d8d8d8;
  }
}
</style>