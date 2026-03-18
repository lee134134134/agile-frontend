<template>
  <div class="main-content">
    <MenuBreadCom :type="1"></MenuBreadCom>
    <div class="tree-content">
      <div class="tree-info jus-bet-center">
        <div class="header-left jus-start-center">
          <div class="info-icon"></div>
          <div class="info-title">{{ projectInfo.name }}</div>
          <div class="info-jc">{{ projectInfo.shortName }}</div>
          <!-- <div class="info-time">2025-08-01 03:27</div> -->
        </div>
        <div class="btn-content jus-start-center">
          <div class="btn-add">
            <span class="btn-icon-menu"></span>
            <span @click.stop="handleAddMenu(projectInfo.id)">添加菜单</span>
          </div>
          <div class="btn-add">
            <span class="btn-icon-page"></span>
            <span @click.stop="handleAddPage(projectInfo.id)">添加页面</span>

          </div>
          <div class="btn-more" @click="isShowMore = !isShowMore">
            <span v-if="isShowMore">全部收起</span>
            <span v-else>全部展开</span>
          </div>
        </div>
      </div>
      <div v-if="dataList && dataList.length > 0" class="tree-list">
        <TreeNode v-for="item in dataList" :key="item.id" :nodes="item" @add-menu-node="handleAddMenu"
                  @add-page-node="handleAddPage" @edit-node="handleEdit" @move-up-node="handleMoveUp"
                  @move-down-node="handleMoveDown" @delete-node="handleDelete"></TreeNode>
      </div>
      <EmptyDia v-if="dataList.length == 0" :type="'zwsj'"></EmptyDia>
    </div>
    <el-dialog v-if="diaShow" v-model="diaShow" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false"
               class="edit-dia" width="530px" @close="handleClose">
      <template #header="{ close }">
        <div class="dia-header">
          <div class="dia-header-title">
            <div class="title-icon"></div>
            <div class="title-text">{{ diaTitle }}</div>
          </div>
          <el-icon class="dia-header-close" size="16px" @click="close">
            <Close/>
          </el-icon>
        </div>
      </template>
      <div class="dia-main">
        <el-form ref="diaFromRef" :model="diaFrom" :rules="diaRule" class="dia-main-content" label-position="right"
                 label-width="110px">
          <el-form-item :label="diaFrom.type == 'menu' ? '菜单节点名称' : '页面节点名称'" prop="name">
            <el-input v-model="diaFrom.name"
                      :placeholder="`请输入${diaFrom.type == 'menu' ? '菜单节点名称' : '页面节点名称'}`"
                      clearable></el-input>
          </el-form-item>
        </el-form>
        <div class="dia-footer jus-flex-end">
          <div class="btn-cancel" @click="handleClose">取消</div>
          <div class="btn-submit" @click="handleSubmit">确认</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import {markRaw, nextTick, onMounted, reactive, ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import EmptyDia from '../../components/EmptyDia.vue';
import {ElMessage, ElMessageBox} from 'element-plus';
import MenuBreadCom from './components/MenuBreadCom.vue';
import TreeNode from './components/TreeNode.vue';
import {traverseTree} from '@/utils/changeTreeData.js'
import {isOnlyEnglishOrChinese} from "@/utils/index.js";
import {
  addTreeNode,
  checkDeleTreeNode,
  deleTreeNode,
  getProjectTree,
  moveTreeNode,
  updataTreeNode
} from '@/api/projectApi.js';

const route = useRoute();
const proId = ref(route.query.proId || '')
const isShowMore = ref(true)
const diaShow = ref(false)
const diaTitle = ref('')
const diaFromRef = ref(null)
const diaFrom = reactive({
  nodeId: '',
  type: '',
  name: ''
})
const optType = ref(null)//新增菜单：1；新增页面：2；修改菜单：3；修改页面：4
const projectInfo = reactive({
  id: '',
  name: "",
  shortName: '',
  projectCode: "",
})
const dataList = ref([])
const checkValue = (rule, value, callback) => {
  if (value == '') {
    return callback(new Error('请输入名称！'))
  } else if (!isOnlyEnglishOrChinese(value)) {
    return callback(new Error('您输入的名称格式不正确，请输入中英文'))
  } else {
    return callback()
  }
}
const diaRule = {
  name: [
    {required: true, validator: checkValue, trigger: 'submit'},
    {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'submit'}
  ],
}
watch(() => isShowMore.value, (newName) => {
  nextTick(() => {
    dataList.value = traverseTree(dataList.value, newName)
  })

}, {immediate: true});
const handleAddMenu = (parentId) => {
  diaFrom.nodeId = parentId
  diaFrom.type = 'menu'
  optType.value = 1
  diaTitle.value = '添加菜单'
  diaShow.value = true
}
const handleAddPage = (parentId) => {
  diaFrom.nodeId = parentId
  diaFrom.type = 'page'
  optType.value = 2
  diaTitle.value = '添加页面'
  diaShow.value = true
}
const handleEdit = (node) => {
  if (node.nodeType == 'menu') {
    diaFrom.nodeId = node.id
    diaFrom.type = 'menu'
    diaFrom.name = node.name
    optType.value = 3
    diaTitle.value = '编辑菜单'
    diaShow.value = true
  } else {
    diaFrom.nodeId = node.id
    diaFrom.type = 'page'
    diaFrom.name = node.name
    optType.value = 4
    diaTitle.value = '编辑页面'
    diaShow.value = true
  }
}
const handleMoveUp = (id) => {
  let params = {
    id: id,
    operation: 1
  }
  moveNodeFn(params)
}
const handleMoveDown = (id) => {
  let params = {
    id: id,
    operation: 2
  }
  moveNodeFn(params)
}
const handleDelete = (id) => {
  checkDeleTreeNode({id: id}).then(res => {
    if (res.success) {
      let checkData = res?.data ?? ''
      if (checkData == '3') {
        ElMessageBox.confirm(`节点将实时移除，请确认是否删除？`, '', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          center: false,
          closeOnClickModal: false,
          autofocus: false,
          type: 'warning',
        }).then(() => {
          deleNode(id)
        }).catch(() => {
          console.log('catch')
        })
      } else if (checkData == '2') {
        ElMessageBox.confirm(`该节点下存在子级节点，不允许删除！`, '提示', {
          confirmButtonText: '确认',
          showCancelButton: false,
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
      } else if (checkData == '1') {
        ElMessageBox.confirm(`该节点下存在关联数据，无法删除！`, '提示', {
          confirmButtonText: '确认',
          showCancelButton: false,
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
      } else {
        ElMessage.warning(res.msg)
        return
      }
    }
  })

}
const handleClose = () => {
  diaTitle.value = ''
  diaShow.value = false
  diaFrom.nodeId = ''
  diaFrom.type = ''
  diaFrom.name = ''
}
const handleSubmit = () => {
  if (diaFromRef.value) {
    diaFromRef.value.validate((valid) => {
      if (valid) {
        let addparams = {
          parentId: diaFrom.nodeId,
          projectCode: proId.value,
          nodeType: diaFrom.type,
          name: diaFrom.name
        }
        let editParams = {
          id: diaFrom.nodeId,
          name: diaFrom.name
        }
        if (optType.value == 1) {
          addNodeFn(addparams)
        } else if (optType.value == 2) {
          addNodeFn(addparams)
        } else if (optType.value == 3) {
          updataNodeFn(editParams)
        } else if (optType.value == 4) {
          updataNodeFn(editParams)
        }
      }
    })
  }

}
const getTreeFn = async () => {
  let params = {
    projectCode: proId.value
  }
  isShowMore.value = true
  getProjectTree(params).then(res => {
    if (res.success) {
      projectInfo.id = res?.data?.id ?? ''
      projectInfo.name = res?.data?.name ?? ''
      projectInfo.shortName = res?.data?.shortName ?? ''
      projectInfo.projectCode = res?.data?.projectCode ?? ''
      dataList.value = res?.data?.children ?? []
    }
  })
}

function resetDia() {
  diaFrom.nodeId = ''
  diaFrom.name = ''
  diaFrom.type = ''
  optType.value = null
  diaTitle.value = ''
  diaShow.value = false
}

function addNodeFn(data) {
  addTreeNode(data).then(res => {
    console.log(res, '--res')
    if (res.success) {
      getTreeFn()
      resetDia()
    }
  })
}

function updataNodeFn(data) {
  updataTreeNode(data).then(res => {
    if (res.success) {
      getTreeFn()
      resetDia()
    }
  })
}

function moveNodeFn(data) {
  moveTreeNode(data).then(res => {
    if (res.success) {
      getTreeFn()
      resetDia()
    }
  })
}

function deleNode(data) {
  deleTreeNode({id: data}).then(res => {
    if (res.success) {
      getTreeFn()
      resetDia()
    }
  })
}

onMounted(async () => {
  await getTreeFn()
})
</script>

<style lang="scss" scoped>
.tree-content {
  padding: 20px;
  margin-top: 15px;
  border-radius: 8px;
  background: #fff;

  .tree-info {
    .info-icon {
      width: 20px;
      height: 20px;
      margin-right: 10px;
      border-radius: 4px;
      background: url('/project.svg') no-repeat center;
      background-size: 100% 100%;
      vertical-align: sub;
    }

    .info-title {
      font-size: 20px;
      font-family: Source Sans 3;
      font-weight: bold;
      color: #1d1d1d;
    }

    .info-jc {
      margin: 0 15px;
      padding: 0px 8px;
      background: #e0eeff;
      border-radius: 8px;
      border: 1px solid #2173f7;
      font-size: 14px;
      font-family: 'Microsoft YaHei', 'PingFang SC';;
      font-weight: bold;
      color: #2173f7;
    }

    .info-time {
      font-size: 16px;
      font-family: Source Sans 3;
      font-weight: 400;
      color: #888;
    }

    .btn-content {
      .btn-icon-menu {
        display: inline-block;
        margin-right: 4px;
        width: 20px;
        height: 20px;
        background: url('/add-menu.svg') no-repeat center;
        background-size: 100% 100%;
        vertical-align: middle;
      }

      .btn-icon-page {
        display: inline-block;
        margin-right: 4px;
        width: 20px;
        height: 20px;
        background: url('/add-page.svg') no-repeat center;
        background-size: 100% 100%;
        vertical-align: middle;
      }

      .btn-add {
        cursor: pointer;
        margin: 0 10px;
        font-size: 20px !important;
      }
    }

    .btn-more {
      height: 20px;
      line-height: 25px;
      font-size: 14px;
      font-weight: 400;
      color: #1d1d1d;
      margin-left: 16px;
      cursor: pointer;
    }
  }

  .tree-list {
    margin-top: 20px;
    overflow-y: auto;
    overflow-x: hidden;
    height: calc(100vh - 208px);
  }

  .tree-list > .tree-item-page {
    margin-left: 0;
  }

  .tree-list > .tree-item-menu {
    margin-left: 0;
  }
}

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
      font-size: 18px;
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

  .dia-main-content {
    // margin-bottom: 50px;

    :deep(.el-checkbox) {
      min-width: 110px !important;

      .el-checkbox__label {
        color: #1D1D1D !important;
        font-weight: 500;
      }
    }
  }

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
}
</style>