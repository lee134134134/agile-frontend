<template>
  <div class="main-content">
    <!--    <div class="title-1">字典管理</div>-->
    <div class="dic-manage-containe jus-bet-start">
      <div class="dic-manage-left bg-color-1 border-radius-8">
        <div class="card-header jus-bet-center">
          <div class="title-2">字典管理</div>
          <div class="opt-btn" @click="handleAddType"><img :src="addIcon" alt="添加" class="btn-icon"/>新增类型</div>
          <!-- <div class="head-opt jus-bet-center">
                        <div class="opt-btn">模块管理</div>
                        <div class="opt-btn">新增类型</div>
                    </div> -->
        </div>
        <div class="card-search">
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="模块" label-position="left">
                <el-select v-model="searchForm.module" clearable placeholder="请选择"
                           style="width: 240px"
                           @change="getDictTypeListFn">
                  <el-option v-for="item in moduleList" :key="item.id" :label="item.name" :value="item.name"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="关键词" label-position="left">
                <el-input v-model="searchForm.keyword" clearable placeholder="请输入" @change="getDictTypeListFn">
                  <template #suffix>
                    <el-icon class="el-input__icon">
                      <search/>
                    </el-icon>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="card-body">
          <div v-for="item in groupList" :key="item.id" class="group-content">
            <div class="group-header jus-bet-end">
              <div class="group-title jus-start-end">
                <div class="title-icon-1">
                  <el-icon v-if="item.isShowChildern">
                    <ArrowDown/>
                  </el-icon>
                  <el-icon v-else>
                    <ArrowUp/>
                  </el-icon>
                </div>
                <div class="title-text title-text-bold">{{ item.name }}</div>
              </div>
              <div class="group-opt" @click="item.isShowChildern = !item.isShowChildern">
                <span v-show="item.isShowChildern">收起</span>
                <span v-show="!item.isShowChildern">展开</span>
              </div>
            </div>
            <div v-show="item.isShowChildern" class="item-content">
              <div v-for="info in item.dictTypes" :key="info.id"
                   :class="info.id == currentId ? 'group-item-checked' : ''"
                   class="group-item" @click="handleGetDicInfo(info, item.name)">
                <div class="item-title"><span v-if="info.hasUsed == 1" class="item-title-tip">使用</span>{{ info.name }}
                </div>
                <div>
                  <el-text class="item-type" truncated>{{ info.code }}</el-text>
                </div>
                <div class="item-description">{{ info.description }}</div>
                <div class="group-item-opt jus-flex-end">
                  <div class="opt-item" @click.stop="handleMoveUpDictType(info.id)">
                    <el-icon>
                      <img src="@/assets/webp/dic-up.webp" alt="">
                    </el-icon>
                  </div>
                  <div class="opt-item" @click.stop="handleMoveDownDictType(info.id)">
                    <el-icon>
                      <img src="@/assets/webp/dic-down.webp" alt="">
                    </el-icon>
                  </div>
                  <div class="opt-item" @click.stop="handleEditType(info)">
                    <el-icon>
                      <img src="@/assets/webp/dic-edit.webp" alt="">
                    </el-icon>
                  </div>
                  <div class="opt-item" @click.stop="handleDelDictType(info)">
                    <el-icon>
                      <img src="@/assets/webp/dic-del.webp" alt="">
                    </el-icon>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div class="dic-manage-right bg-color-1 border-radius-8">
        <div class="card-header jus-bet-center">
          <div class="jus-start-center">
            <div v-if="currentName" class="title-2">字典项</div>
            <div v-if="currentName"><span class="title-circle-left">{{ currentModule }}</span><span
                class="title-circle-right">{{ currentName }}</span></div>
          </div>
          <div v-if="currentName" class="opt-btn" @click="handleRightDetail('新增')">新增字典项</div>
        </div>
        <div class="card-body">
          <section v-if="!currentName" class="dict-empty">
            <img alt="" src="@/assets/webp/dic-icon.webp">
            请选择左侧字典类型
          </section>
          <div v-for="(items, index) in dicList" :key="items.id" class="dic-content">
            <div class="dic-header">
              <div class="dic-title jus-start-center">
                <div class="title-index">{{ index + 1 }}</div>
                <div class="title-text">{{ items.name }}</div>
                <div v-show="items.isDefault" class="title-tip">默认</div>
              </div>
              <div class="dic-opt jus-flex-end">
                <div class="opt-item" @click.stop="handleMoveUpDictOpt(items.id)">
                  <el-icon>
                    <img src="@/assets/webp/dic-up.webp" alt="">
                  </el-icon>
                </div>
                <div class="opt-item" @click.stop="handleMoveDownDictOpt(items.id)">
                  <el-icon>
                    <img src="@/assets/webp/dic-down.webp" alt="">
                  </el-icon>
                </div>
                <div class="opt-item" @click.stop="handleEditOpt('编辑', items)">
                  <el-icon>
                    <img src="@/assets/webp/dic-edit.webp" alt="">
                  </el-icon>
                </div>
                <div class="opt-item" @click.stop="handleDelDictOpt(items)">
                  <el-icon>
                    <img src="@/assets/webp/dic-del.webp" alt="">
                  </el-icon>
                </div>
              </div>
            </div>
            <div class="dic-main">
              <div class="main-item jus-start-center">
                <div class="item-content jus-start-center no-wrap">
                  <div class="text-default">编码：</div>
                  <div class="text-light val-length">
                    <el-text truncated>{{ items.code }}</el-text>
                  </div>
                </div>
                <div class="item-content jus-start-center no-wrap">
                  <div class="text-default">值：</div>
                  <div class="text-light val-length">
                    <el-text truncated>{{ items.value }}</el-text>
                  </div>
                </div>
              </div>
              <div v-show="items.description" class="item-description text-default">{{ items.description }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <DicTypeOpt v-if="leftDetailShow" ref="dicTypeOptRef" :isShow="leftDetailShow" :moduleList="moduleList"
                :type="detailType" :typeInfo="typeInfo" @closeDiaFn="handleClose"
                @confirmFn="handleAddDictType"
                @editConfirmFn="handleEditDictType">
    </DicTypeOpt>
    <DicValueOpt v-if="rightDetailShow" :isShow="rightDetailShow" :optInfo="optInfo" :type="rightDetailType"
                 @closeDiaFn="handleRightDetailClose" @confirmFn="handleAddDictOpt"
                 @editConfirmFn="handleEditDictOpt"></DicValueOpt>
  </div>
</template>
<script setup>
import {markRaw, onMounted, reactive, ref} from 'vue';
import {ArrowDown, ArrowUp, Delete, Edit, Search} from '@element-plus/icons-vue';
import DicTypeOpt from './components/DicTypeOpt.vue';
import DicValueOpt from './components/DicValueOpt.vue';
import {
  addDictOpt,
  addDictType,
  delDictOpt,
  deleteDictType,
  editDictOpt,
  editDictType,
  getDictOptList,
  getDictTypeList,
  getModuleList,
  isOptOccupied,
  isTypeOccupied,
  moveDownDictOpt,
  moveDownDictType,
  moveUpDictOpt,
  moveUpDictType
} from '@/api/api.js'
import {ElMessage, ElMessageBox} from 'element-plus'
import addIcon from "@/assets/webp/add.webp";

let dicTypeOptRef = ref(null)
const searchForm = reactive({
  module: '',
  keyword: '',
});
const currentId = ref(null)
const currentName = ref(null)
const currentModule = ref(null)
const moduleList = ref([])
const groupList = ref([])
const dicList = ref([])

const leftDetailShow = ref(false)
const rightDetailShow = ref(false)
const detailType = ref('')
const rightDetailType = ref('')
const typeInfo = ref({})
const optInfo = ref({})

const handleClose = () => {
  leftDetailShow.value = false
}
// 新增字典类型弹窗
const handleAddType = () => {
  leftDetailShow.value = true
  detailType.value = '新增'
}
const handleEditType = (info) => {
  leftDetailShow.value = true
  detailType.value = '编辑'
  typeInfo.value = info
}
const handleRightDetailClose = () => {
  rightDetailShow.value = false
}

// 新增字典项弹窗
const handleRightDetail = (type) => {
  if (!currentId.value) {
    ElMessage.warning('请选择字典类型')
    return
  }
  rightDetailShow.value = true
  rightDetailType.value = type
}
const handleEditOpt = (type, info) => {
  rightDetailShow.value = true
  rightDetailType.value = type
  optInfo.value = info
}

const handleGetDicInfo = (info, moduleName) => {
  currentId.value = info.id
  currentName.value = info.name
  currentModule.value = moduleName
  getDictOptListFn()
}

const getModuleListFn = () => {
  getModuleList().then(res => {
    if (res.success) {
      moduleList.value = res.data
    }
  })
}

// 字典类型列表查询
const getDictTypeListFn = () => {
  getDictTypeList(searchForm.module || '', searchForm.keyword).then(res => {
    if (res.success) {
      groupList.value = res.data
      groupList.value.forEach(item => {
        item.isShowChildern = true
      })
      // 清空选中及字典项列表
      currentId.value = null
      currentName.value = null
      dicList.value = []
    }
  })
}

// 新增字典类型
const handleAddDictType = (dictTypeObj) => {
  addDictType(dictTypeObj).then(res => {
    if (res.success) {
      ElMessage.success('新增成功')
      getDictTypeListFn() // 刷新列表
    }
  })
}

const handleEditDictType = (dictTypeObj) => {
  editDictType(dictTypeObj).then(res => {
    if (res.success) {
      ElMessage.success('编辑成功')
      getDictTypeListFn() // 刷新列表
    }
  })
}

// 删除字典类型
const handleDelDictType = async (info) => {
  // 调用接口判断字典类型是否被占用
  let flag
  await isTypeOccupied(info.id).then(res => {
    if (res.success) {
      flag = res.data.isUsed
    }
  })
  if (flag) {
    ElMessageBox.confirm(`当前操作字典【${info.name}】，该字典类型已被占用，不可删除`, '', {
      showCancelButton: false,
      confirmButtonText: '确认',
      center: false,
      customClass:"dic-dialog",
      closeOnClickModal: false,
      autofocus: false,
      type: 'primary',
      icon: markRaw('WarningFilled'),
    }).then(() => {

    })
  } else {
    ElMessageBox.confirm(`当前操作字典【${info.name}】，删除后不可恢复，请确认是否删除`, '', {
      cancelButtonText: '取消',
      confirmButtonText: '确认',
      center: false,
      closeOnClickModal: false,
      autofocus: false,
      type: 'warning',
    }).then(() => {
      let params = {id: info.id}
      deleteDictType(params).then(res => {
        if (res.success) {
          ElMessage.success('删除成功')
          getDictTypeListFn() // 刷新列表
        }
      })
    }).catch(() => {
      console.log('catch')
    })
  }
}


// 字典项列表查询
const getDictOptListFn = () => {
  getDictOptList(currentId.value).then(res => {
    if (res.success) {
      dicList.value = res.data
    }
  })
}

// 新增字典项
const handleAddDictOpt = (dictOptObj) => {
  dictOptObj.dictTypeId = currentId.value
  addDictOpt(dictOptObj).then(res => {
    if (res.success) {
      ElMessage.success('新增成功')
      getDictOptListFn() // 刷新列表
    }
  })
}

// 编辑字典项
const handleEditDictOpt = (dictOptObj) => {
  dictOptObj.dictTypeId = currentId.value
  editDictOpt(dictOptObj).then(res => {
    if (res.success) {
      ElMessage.success('编辑成功')
      getDictOptListFn() // 刷新列表
    }
  })
}

// 删除字典项
const handleDelDictOpt = async (info) => {
  // 调用接口判断字典项是否被占用
  let flag
  await isOptOccupied(info.id).then(res => {
    if (res.success) {
      flag = res.data.isUsed
    }
  })
  if (flag) {
    ElMessageBox.confirm(`当前操作字典项【${currentName.value}-${info.name}】，该字典项已被占用，不可删除`, '', {
      showCancelButton: false,
      confirmButtonText: '确认',
      center: false,
      closeOnClickModal: false,
      customClass:"dic-dialog",
      autofocus: false,
      type: 'primary',
      icon: markRaw('WarningFilled'),
    }).then(() => {

    })
  } else {
    ElMessageBox.confirm(`当前操作字典【${currentName.value}-${info.name}】，删除后不可恢复，请确认是否删除`, '', {
      cancelButtonText: '取消',
      confirmButtonText: '确认',
      center: false,
      closeOnClickModal: false,
      autofocus: false,
      type: 'warning',
    }).then(() => {
      let params = {id: info.id}
      delDictOpt(params).then(res => {
        if (res.success) {
          ElMessage.success('删除成功')
          getDictOptListFn() // 刷新列表
        }
      })
    }).catch(() => {
      console.log('catch')
    })
  }
}

// 上移字典类型
const handleMoveUpDictType = (id) => {
  moveUpDictType(id).then(res => {
    if (res.success) {
      getDictTypeListFn() // 刷新列表
    }
  })
}
// 下移字典类型
const handleMoveDownDictType = (id) => {
  moveDownDictType(id).then(res => {
    if (res.success) {
      getDictTypeListFn() // 刷新列表
    }
  })
}

// 上移字典项
const handleMoveUpDictOpt = (id) => {
  moveUpDictOpt(id).then(res => {
    if (res.success) {
      getDictOptListFn() // 刷新列表
    }
  })
}
// 下移字典项
const handleMoveDownDictOpt = (id) => {
  moveDownDictOpt(id).then(res => {
    if (res.success) {
      getDictOptListFn() // 刷新列表
    }
  })
}


onMounted(() => {
  getModuleListFn()
  getDictTypeListFn()
})

</script>
<style src="@/assets/css/dicManage.scss"></style>
<style lang="scss" scoped>
.main-content {
  background: #f6f8fc;
  height: 100%;

  .dic-manage-containe {
    width: 100%;

    .dic-manage-left {
      width: 672px;
      padding: 15px 25px;
      background: #fff;

      .card-search {
        margin-top: 19px;
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

      .card-body {
        height: calc(100vh - 214px);
        padding-right: 13px;
        margin-right: -13px;
        overflow-y: auto;
      }
    }

    .dic-manage-right {
      width: calc(100% - 700px);
      height: calc(100vh - 87px);
      padding: 15px 25px;
      background: #fff;
      //   overflow-y: auto;

      .card-body {
        margin-top: 15px;
        height: calc(100% - 50px);
        overflow-y: auto;
      }
    }

    .card-header {
      .head-opt {
        width: 205px;
      }
    }

    .opt-item {
      width: 16px;
      height: 16px;
      margin-left: 8px;
      text-align: center;
      cursor: pointer;

      img{
        width: 16px;
        height: 16px;
      }

      .el-icon {
        font-size: 14px;
        color: #999;

        svg {
          width: 3em;
          height: 3em;
          margin-bottom: -7px;
        }
      }

      &:hover {
        opacity: 0.8;
      }
    }
  }

  .no-wrap {
    flex-wrap: nowrap;
    align-items: start;
  }

  .val-length {
    width: calc(100% - 60px);
  }
}

.opt-btn {
  height: 28px;
  line-height: 28px;
  padding: 0 12px;

  .btn-icon {
    margin-right: 4px;
  }
}

.group-opt {
  span {
    color: #2173f7;
  }
}

.title-text-bold {
  font-weight: bold;
  margin-left: 4px;
}

.title-icon-1 {
  color: #999;
}

.title-circle-left {
  margin-left: 12px;
  display: inline-block;
  padding: 0 8px;
  font-size: 12px;
  height: 23px;
  line-height: 23px;
  border-radius: 4px 0 0 4px;
  color: #fff;
  background: linear-gradient(270deg, #2173f7 0%, #45abfc 100%);
}

.title-circle-right {
  display: inline-block;
  padding: 0 8px;
  font-size: 12px;
  height: 23px;
  line-height: 23px;
  color: #2173f7;
  background: #e8f1fe;
  border-radius: 0 4px 4px 0;
}

.dict-empty {
  margin-top: 85px;
  text-align: center;
  font-size: 16px;
  color: #999;

  img{
    margin: 0 auto 8px;
    display: block;
    width: 120px;
    height: 120px;
  }
}
</style>
