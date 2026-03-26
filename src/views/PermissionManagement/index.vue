<template>
  <div class="main-content">
    <div class="page-container">
      <div class="page-header jus-bet-center">
        <div class="header-left jus-bet-center">
          <div class="title-4">菜单权限管理</div>
        </div>
        <div class="btn-add-menu" @click="showAddDia = true">
          <img :src="addIcon" alt="添加" class="btn-icon"/>新增
        </div>
      </div>
      <section class="page-table">
        <div class="page-table-content">
          <div class="page-table-col">
            <div class="btn-see jus-center">
              <div v-if="isSeeAll" class="check-box" @click="handleSelctedSee"></div>
              <div v-if="!isSeeAll" class="checked-box" @click="handleSelctedSee">
                <el-icon color="#2173f7" size="12px">
                  <Check/>
                </el-icon>
              </div>
              只看菜单
            </div>
            <div class="btn-all jus-center" @click="expandAllFn">
              {{ showAll ? '全部收起' : '全部展开' }}
              <el-icon color="#666" size="14px">
                <ArrowDown v-if="!showAll"/>
                <ArrowUp v-else/>
              </el-icon>
            </div>
          </div>
          <el-table
              ref="tableRef"
              v-loading="loading"
              :data="tableData"
              :default-expand-all="true"
              :header-cell-style="TableRowStyle3"
              :show-header="false"
              :tree-props="{ children: 'children' }"
              class="aligned-tree-table"
              height="calc(100vh - 190px)"
              highlight-current-row
              row-key="treeCode"
              scrollbar-always-on
              @current-change="handleEditNode"
          >
            <el-table-column align="left" label="功能名称" min-width="300" prop="title">
              <template #default="scope">
                <span
                    v-if="scope.row.type == 0 && (!scope.row.children || scope.row.children.length === 0)"
                    class="expand-placeholder"
                ></span>

                <div class="inline-text">
                  <span v-if="scope.row.type == 0" class="text-level1">{{ scope.row.title }}</span>
                  <span v-if="scope.row.type == 1" class="text-level2">{{ scope.row.title }}</span>
                  <span v-if="scope.row.type == 2" class="text-level3">{{ scope.row.title }}</span>
                </div>
                <div class="inline-text inline-text-block">
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
                </div>
                <div class="inline-text">
                  <img v-if="scope.row.isEnabled == 1" alt="启用中" class="ico-img" src="@/assets/webp/archived.webp">
                  <img v-else alt="未启用" class="ico-img" src="@/assets/webp/archived_no.webp">
                  <span class="ml12">{{ scope.row.isEnabled == 1 ? '启用中' : '未启用' }}</span>
                </div>
                <div class="inline-text">
                  <i v-if="scope.row.isPublic == 1" class="ico-dot"></i>
                  <i v-else class="ico-dot gray"></i>
                  <span class="ml12">
                    {{ scope.row.isPublic == 1 ? '公开' : '非公开' }}
                  </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="right" label="操作" width="100">
              <template #default="scope">
                <div class="opt-content flex">
                  <div :class="{ 'dis-btn': scope.row.type == 2 || scope.row.name == 'home' }" class="text-btn"
                       @click="handleMoveFn(1, scope.row)">
                    <section  v-if="scope.row.type == 2 || scope.row.name == 'home' || scope.row.orderNum < 3">
                      <el-tooltip content="上移" effect="light" popper-class="fix-tooltip" placement="top">
                        <img :src="upGrayIcon" alt="上移" class="table-icon"/>
                      </el-tooltip>
                    </section>
                    <section v-else >
                      <el-tooltip content="上移" effect="light" popper-class="fix-tooltip" placement="top">
                        <img :src="upIcon" alt="上移" class="table-icon"/>
                      </el-tooltip>
                    </section>
                  </div>
                  <div :class="{ 'dis-btn': scope.row.type == 2 || scope.row.name == 'home' }" class="text-btn"
                       @click="handleMoveFn(2, scope.row)">
                    <section v-if="scope.row.type == 2 || scope.row.name == 'home'">
                      <el-tooltip content="下移" effect="light" popper-class="fix-tooltip" placement="top">
                        <img :src="downGrayIcon" alt="下移" class="table-icon"/>
                      </el-tooltip>
                    </section>
                    <section v-else>
                      <el-tooltip content="下移" effect="light" popper-class="fix-tooltip" placement="top">
                        <img :src="downIcon" alt="下移" class="table-icon"/>
                      </el-tooltip>
                    </section>
                  </div>
                  <div :class="{ 'dis-btn': scope.row.type == 2 || scope.row.name == 'home' }" class="text-btn"
                       @click="handleMoveNode(scope.row)">
                    <section v-if="scope.row.type == 2 || scope.row.name == 'home'">
                      <el-tooltip content="移动至" effect="light" popper-class="fix-tooltip" placement="top">
                        <img :src="moveGrayIcon" alt="移动至" class="table-icon"/>
                      </el-tooltip>
                    </section>
                    <section v-else>
                      <el-tooltip content="移动至" effect="light" popper-class="fix-tooltip" placement="top">
                        <img :src="moveIcon" alt="移动至" class="table-icon"/>
                      </el-tooltip>
                    </section>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="page-table-detail">
          <EditDia v-if="showEditDia" :nodeInfo="detailInfo" @closeDiaFn="handleCloseEditDia"
                   @confirmBtnFn="handleSaveBtnEdit" @confirmFn="handleSaveMenuEdit"
                   @deleteDiaFn="handleDeleFn"></EditDia>
        </div>
      </section>
    </div>
    <AddDia v-if="showAddDia" :isShow="showAddDia" :treeList="treeSelectList" @closeDiaFn="showAddDia = false"
            @confirmBtnFn="handleSaveBtn" @confirmFn="handleSaveMenu"></AddDia>
    <MoveDia v-if="showMoveDia" :isShow="showMoveDia" :nodeInfo="moveInfo" :treeList="treeSelectList"
             @closeDiaFn="handleCloseMoveDia" @confirmFn="handleMoveSave"></MoveDia>
  </div>
</template>

<script setup>
// ... (Script部分保持原样，逻辑不需要变动)
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
import upIcon from "@/assets/webp/ico-up-active.webp";
import upGrayIcon from "@/assets/webp/ico-up.webp";
import downIcon from "@/assets/webp/ico-down-active.webp";
import downGrayIcon from "@/assets/webp/ico-down.webp";
import moveGrayIcon from "@/assets/webp/publish_disable.webp";
import moveIcon from "@/assets/webp/publish.webp";
import addIcon from "@/assets/webp/add.webp";
import {menuList} from "@/api/RoleManagement.js";
import bus from '@/utils/bus.js';

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
const detailTmpInfo = ref(null)
const currentInfoId = ref(-1)
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
  detailInfo.value = JSON.parse(JSON.stringify(detailTmpInfo.value))
}
const handleSaveMenuEdit = (data) => {
  savePermission(data).then(res => {
    if (res.success) {
      handleInit()
    }
  })

}
const handleSaveBtnEdit = (data) => {
  editSystemBtns(data).then(res => {
    if (res.success) {
      handleInit()
    }
  })
}
const handleEditNode = (data) => {
  if (data) {
    detailInfo.value = data
    detailTmpInfo.value = JSON.parse(JSON.stringify(data))
    currentInfoId.value = data?.id
    showEditDia.value = true
  }
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
  if (type === 1) {
    if (data.type == 2 || data.name == 'home' || data.orderNum < 3) return
  } else if (type === 2) {
    if (data.type == 2 || data.name == 'home') return
  }
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
  getPermissionMenuList(nodeNeed).then(async res => {
    if (res.success) {
      loading.value = false
      showAll.value = true
      tableData.value = res?.data?.children ?? []

      const result = await menuList()
      localStorage.setItem("agiles_menuList", JSON.stringify(result.data.menuList))
      bus.emit('refreshMenu');

      await nextTick(() => {
        if (currentInfoId.value === -1) {
          tableRef.value.setCurrentRow(tableData.value[0])
        } else {
          const targetNode = findNodeById(tableData.value, currentInfoId.value)
          if (targetNode) {
            tableRef.value.setCurrentRow(targetNode)

            nextTick(() => {
              const tableEl = tableRef.value.$el;
              const rowEl = tableEl.querySelector('.current-row');
              if (rowEl) {
                rowEl.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center',
                })
              }
            })
          } else {
            tableRef.value.setCurrentRow(tableData.value[0])
          }
        }
      })
    }
  })
}

const findNodeById = (data, id) => {
  for (const item of data) {
    if (item.id === id) return item;
    if (item.children && item.children.length > 0) {
      const found = findNodeById(item.children, id)
      if (found) return found;
    }
  }
  return null;
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
  getDicListFn('NODE_TYPE') // 分组类型
  await handleInit()
})
</script>

<style lang="scss" scoped>
/* 保持原有样式并添加/覆盖以下内容 */
.main-content {
  padding: 12px 20px;
  height: 100%;

  .page-container {
    /* ... 之前的 header 样式 ... */
    .page-header {
      margin-bottom: 22px;

      .header-left {
        gap: 25px;
      }

      .btn-add-menu {
        width: 76px;
        height: 28px;
        line-height: 26px;
        border: 1px solid #2173f7;
        border-radius: 3px;
        background: #2173f7;
        color: #fff;
        font-size: 12px;
        font-weight: 500;
        text-align: center;
        cursor: pointer;
        letter-spacing: 1px;

        &:hover {
          opacity: 0.6;
        }
      }
    }

    .page-table {
      display: flex;
      gap: 16px;

      .page-table-content {
        width: 564px;
        padding: 12px 16px;
        background: #fff;
        border-radius: 4px;
      }

      .page-table-detail {
        flex: 1;
        padding: 12px 16px;
        background: #fff;
        border-radius: 4px;
      }
    }
  }

  /* 树形对齐核心样式 */
  :deep(.el-table__expand-icon) {
    width: 14px !important; /* 统一宽度 */
    margin-right: 8px !important;
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    vertical-align: middle;
  }

  /* 占位符样式：用于没有子节点的一级菜单 */
  .expand-placeholder {
    display: inline-block;
    width: 14px; /* 与 expand-icon 宽度保持一致 */
    margin-right: 8px;
    vertical-align: middle;
  }

  /* 移除之前可能冲突的样式 */
  :deep(.el-table__expand-icon::before) {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    background: url(@/assets/webp/ico-arrow.webp) no-repeat;
    background-size: 100% 100%;
  }

  /* 隐藏默认图标但保留位置 */
  :deep(.el-table__expand-icon .el-icon) {
    display: none !important;
  }

  /* 确保缩进正确：二级及以下仍然正常缩进 */
  :deep(.el-table__row--level-1) {
    .el-table_1_column_1 .cell {
      padding-left: 16px !important; /* 这里控制二级的缩进距离 */
    }
  }

  /* 保持你原有的其他所有样式... */
  .opt-content {
    gap: 12px;

    .text-btn {
      color: #2173f7;
      font-size: 14px;
      cursor: pointer;

      &:hover {
        opacity: 0.6;
      }
    }

    .dis-btn {
      opacity: 0.5 !important;
      cursor: default !important;
    }
  }

  .type-content {
    width: 53px;
    height: 21px;
    line-height: 21px;
    border-radius: 4px;
    text-align: center;
    font-size: 12px;
    gap: 3px;
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

  .ico-img {
    width: 12px;
    height: 12px;
    vertical-align: -1px;
    margin-right: 4px;
  }

  .ico-dot {
    display: inline-block;
    margin-right: 4px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #2173f7;
    vertical-align: 2px;

    &.gray {
      background: #d8d8d8;
    }
  }

  .inline-text {
    display: inline-block;
    margin-right: 8px;

    &.inline-text-block {
      vertical-align: -2px;
    }
  }

  .text-level1 {
    font-size: 14px;
    color: #333;
    font-weight: 600;
  }

  .text-level2 {
    font-size: 14px;
    color: #333;
  }

  .text-level3 {
    font-size: 14px;
    color: #666;
  }

  .icon-type {
    width: 12px;
    height: 12px;
  }

  :deep(.el-table) {
    .el-table__cell {
      height: 47px !important;
      line-height: 47px !important;
      padding: 0;
    }

    td.el-table__cell, th.el-table__cell.is-leaf {
      border-bottom: 1px solid #e2e4e8 !important;
    }

    --el-table-border-color: none !important;
  }
}
.page-table-col {
  display: flex;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e4e8;
}

.btn-see {
  gap: 5px;
  color: #666;
  font-weight: 400;
  font-size: 12px;
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

.btn-icon{
  margin-right: 4px;
}
</style>