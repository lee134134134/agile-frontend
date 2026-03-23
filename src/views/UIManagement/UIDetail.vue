<template>
  <div class="main-content">
    <!-- <MenuBreadCom :pageName="pageName"></MenuBreadCom> -->
    <div class="jus-bet-center">
      <div class="jus-start-center">
        <div class="title-1">UI管理</div>
        <div class="sel-global-project">当前项目：{{ globalProjectName }} - {{ globalProjectStatus }}</div>
      </div>
    </div>
    <div class="container-view">
      <div v-if="!noData" :style="{ width: leftWidth + 'px' }" class="view-left">
        <el-input ref='inputRef' v-model="modelName" :prefix-icon="Search" autofocus class="tree-search" clearable
                  type="text"/>
        <div class="tree-content">
          <el-tree ref="treeRef" :current-node-key="defaltclick" :data="treeList" :expand-on-click-node="false"
                   :filter-node-method="filterNodes" :props="defaultProps" default-expand-all
                   highlight-current node-key="id" @current-change="handleClickNode">
            <template #default="{ node, data }">
              <div class="custom-tree-node">
                <div>
                                    <span
                                        :class="{ 'icon-pro': data.nodeType == 'project', 'icon-filed': data.nodeType == 'menu', 'icon-page': data.nodeType == 'page' }"></span>
                  <span class="node-text">{{ node.label }}</span>
                </div>
                <img v-show="data.hasProtoGraph" alt="" class="node-has-icon"
                     src="@/assets/images/hasUi.png">
              </div>
            </template>
          </el-tree>
        </div>
      </div>
      <div class="resizer" @mousedown="startResize"></div>
      <div :class="{'view-right-all': noData}" class="view-right">
        <div v-if="selectData == null" class="empty-content jus-clumn-center">
          <img alt="" class="empty-img" src="@/assets/webp/icon-ui.webp">
          <div class="empty-text">
            请选择左侧节点 <br/>
            <div class="empty-text-2">进行详情查看或者其他操作</div>
          </div>

        </div>
        <div v-else class="rigth-main">
          <section v-if="detailInfo?.list && detailInfo.list.length === 0"
                   class="right-main-wapper right-main-wrapper-empty">
            <div v-show="btnAuthFileter('ui_upload')" class="opt-btn opt-button-fix" @click="handleUploadFn">
              <span class="upload-icon"></span>
              上传UI图
            </div>
          </section>
          <section v-else class="right-main-wapper flex">
            <div class="left-plan-item">
              <div v-show="btnAuthFileter('ui_upload')" class="opt-btn opt-button-fix" @click="handleUploadFn">
                <span class="upload-icon"></span>
                上传UI图
              </div>
              <div class="main-header jus-bet-center">
                <div class="info-text">共{{ detailInfo && detailInfo.list.length ? detailInfo.list.length : 0 }}个页面
                </div>
              </div>
              <div v-if="detailInfo?.list && detailInfo.list.length > 0" class="main-list">
                <div v-for="imgInfo in detailInfo.list" :key="imgInfo.id"
                     :class="imgInfoData && imgInfoData.id == imgInfo.id ? 'item-active' : ''" class="list-item"
                     @click="handleImageDetail(imgInfo)">
                  <div class="item-name">
                                <span class="item-name-title">{{imgInfo.title}}</span>
                    <span class="item-ver">{{ imgInfo.version }}</span>
                  </div>
                  <div class="item-text">
                    <div>
                      <span :class="{'pass':imgInfo.status == 'pass'}" class="item-text-content"><span
                          v-show="imgInfo.status == 'pass'" class="status-pass"></span>{{ imgInfo.statusName }}</span>
                    </div>
                    <div class="item-time">{{ imgInfo.createdAt }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="right-plan-item">
              <section v-if="imgInfoData != null" class="page-path-content">
                <div class="page-path">
                  <el-icon class="page-path-icon" color="#999" size="14px">
                    <Location/>
                  </el-icon>
                  <span>{{ detailInfo?.nodePath || '-' }}</span>
                </div>
                <div v-if="imgInfoData != null" class="more-view">
                  <div class="content-title">原型图预览</div>
                  <div class="content-view jus-center">
                    <div class="content-view-left">
                      <div class="img-show">
                        <el-image ref="imgRef" :max-scale="7" :min-scale="0.2"
                                  :preview-src-list="[imgUrl]" :src="imgUrl" :zoom-rate="1.2" class="small-show"
                                  crossorigin="anonymous" fit="scale-down" referrerpolicy="no-referrer"></el-image>
                      </div>
                      <div class="opt-content jus-end-center">
                        <div class="opt-btn" @click="handleShowBigImage">查看原图</div>
                        <div v-show="btnAuthFileter('ui_download')" class="opt-btn" @click="downLoadFn">立即下载</div>
                        <!-- <div class="opt-btn" @click="showDrawer = true">查看详情</div> -->
                      </div>
                    </div>
                    <div class="content-view-right">
                      <div class="content-right-name">{{ imgInfoData.nodeName }}</div>
                      <div class="detail-card-wrapper">
                        <div class="detail-card">
                          <div class="form-item">
                            <div class="form-label">名称</div>
                            <div class="form-val">{{ imgInfoData.title || '-' }}</div>
                          </div>
                          <div class="form-item">
                            <div class="form-label">描述</div>
                            <div class="form-val">{{ imgInfoData.description || '-' }}</div>
                          </div>
                          <div class="form-item">
                            <div class="form-label">版本</div>
                            <div class="form-val">{{ imgInfoData.version || '-' }}</div>
                          </div>
                          <div class="form-item">
                            <div class="form-label">文件大小</div>
                            <div class="form-val">{{ imgInfoData.size || '-' }}kb</div>
                          </div>
                          <div class="form-item">
                            <div class="form-label">文件类型</div>
                            <div class="form-val">{{ imgInfoData.fileType || '-' }}</div>
                          </div>
                          <div class="form-item">
                            <div class="form-label">所属节点</div>
                            <div class="form-val">{{ imgInfoData.nodePath || '-' }}</div>
                          </div>
                          <div class="form-item">
                            <div class="form-label">上传人</div>
                            <div class="form-val">{{ imgInfoData.createdBy || '-' }}</div>
                          </div>
                          <div class="form-item">
                            <div class="form-label">上传时间</div>
                            <div class="form-val">{{ imgInfoData.createdAt || '-' }}</div>
                          </div>
                          <div class="form-item">
                            <div class="form-label">最新更新时间</div>
                            <div class="form-val">{{ imgInfoData.updatedAt || '-' }}</div>
                          </div>
                          <div class="form-item">
                            <div class="form-label">评审状态</div>
                            <div class="form-val">{{ imgInfoData.statusName || '-' }}</div>
                          </div>
                          <div v-if="imgInfoData.status != 'pending'" class="form-item">
                            <div class="form-label">评审意见</div>
                            <div class="form-val">{{ imgInfoData.reviewComment || '-' }}</div>
                          </div>
                          <div v-if="imgInfoData.status != 'pending'" class="form-item">
                            <div class="form-label">评审时间</div>
                            <div class="form-val">{{ imgInfoData.reviewAt || '-' }}</div>
                          </div>
                          <div class="form-item form-item-bottom">
                            <div v-show="btnAuthFileter('ui_edit')" class="btn-edit"
                                 @click="handleEditDia(imgInfoData)">编辑
                            </div>
                            <div v-show="btnAuthFileter('ui_delete')" class="btn-dele" @click="handleDeleFn">删除
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </section>
        </div>
      </div>
    </div>
    <editDia v-if="showDrawer" :detailInfo="imgInfoData" :isShow="showDrawer" :statesList="stateList"
             @closeDiaFn="showDrawer = false" @editConfirmFn="handleEditSave">
    </editDia>
    <addDia v-if="showAdd" :detailInfo="addDiaInfo" :isShow="showAdd" @closeDiaFn="handleCloseAddDia"
            @confirmFn="handleUISave"></addDia>
  </div>
</template>
<script setup>
import {nextTick, onMounted, onUnmounted, ref, watch} from 'vue';
import {ElMessageBox} from 'element-plus';
import {Search} from '@element-plus/icons-vue'
import {useRoute} from 'vue-router';
import {addIsLeaf} from "@/utils/changeTreeData";
import editDia from './components/editDia.vue';
import addDia from './components/addDia.vue';
import {btnAuthFileter} from "@/utils/index.js";
import {addUI, deleUI, downLoadImage, editUI, getImage, getTreeInfoList, getTreeList} from '@/api/UIManagerApi.js'
import {getDicList} from '@/api/api.js';
import {useDicStore} from '@/stores/dic.js';

const dicStore = useDicStore()
const route = useRoute()
const treeRef = ref(null)
const inputRef = ref(null)
const projectCode = ref(route.query.proCode || '')
const projectName = ref('敏捷开发')
const modelName = ref('')
const treeList = ref([])
const baseTree = ref([])
const detailInfo = ref(null)
const defaltclick = ref(undefined)
const defaultProps = ref({
  children: 'children',
  label: 'name'
})
const selectData = ref(null)
const imgInfoData = ref(null)
const imgRef = ref(null)
const showDrawer = ref(false)
const showAdd = ref(false)
const addDiaInfo = ref(null)
const stateList = ref([])
const imgUrl = ref(undefined)
const pageName = ref('')
const noData = ref(false) // 无所有权限项目、整个页面显示无数据
const globalProjectName = ref(localStorage.getItem('global_ProjectName'))
const globalProjectStatus = ref(localStorage.getItem('global_ProjectStatus'))
watch(() => modelName.value, (newVal) => {
  if (newVal && newVal == route.query.modelName) {
    treeRef.value?.filter(newVal)
    defaltclick.value = route.query.model
    treeRef.value?.setCurrentKey(defaltclick.value)
    selectData.value = defaltclick.value
    getDetailInfo(defaltclick.value)
  } else {
    treeRef.value?.filter(newVal)
  }
}, {immediate: true})

watch(() => dicStore.globalProjectCode, (newVal) => {
  globalProjectName.value = localStorage.getItem('global_ProjectName')
  globalProjectStatus.value = localStorage.getItem('global_ProjectStatus')
  localStorage.removeItem('selectNodes')
  selectData.value = null
  getTreeData()
})

const filterNodes = (value, data) => {
  if (!value) return true
  return data.name.includes(value)
}
const handleImageDetail = (data) => {
  imgInfoData.value = data
  getImage({commentId: data.commentId}).then(res => {
    const blob = new Blob([res]);
    imgUrl.value = URL.createObjectURL(blob);
  })
}
const downLoadFn = () => {
  downLoadImage({id: imgInfoData.value.id}).then(res => {
    const blob = new Blob([res]);
    let href = window.URL.createObjectURL(blob);
    const downloadElement = document.createElement('a');
    downloadElement.href = href;
    let name = imgInfoData.value.title + '.' + (imgInfoData.value.originName.split('.')[1] == 'svg' ? 'png' : imgInfoData.value.originName.split('.')[1])
    downloadElement.download = decodeURIComponent(name);
    document.body.appendChild(downloadElement);
    downloadElement.click();
    document.body.removeChild(downloadElement);
    window.URL.revokeObjectURL(href);
    return
  })

}
const handleShowBigImage = () => {
  imgRef.value?.showPreview()
}
//打开编辑弹窗
const handleEditDia = (data) => {
  showDrawer.value = true
}
//详情编辑保存
const handleEditSave = async (data) => {
  await editUI(data).then(res => {
    if (res.success) {
      showDrawer.value = false
      getTreeData(1)
    }
  })
}
//详情删除
const handleDeleFn = () => {
  ElMessageBox.confirm(`删除后不可恢复，请谨慎操作`, '', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    center: false,
    closeOnClickModal: false,
    autofocus: false,
    type: 'warning',
  }).then(() => {
    deleUI({id: imgInfoData.value.id}).then(res => {
      if (res.success) {
        imgInfoData.value = null
        imgRef.value = null
        imgUrl.value = undefined
        getTreeData(1)
      }
    })
  }).catch(() => {
    console.log('catch')
  })
}
//打开上传UI弹窗
const handleUploadFn = () => {
  addDiaInfo.value = {
    path: detailInfo.value.nodePath,
    moduleId: detailInfo.value.moduleId,
  }
  showAdd.value = true
}
const handleUISave = (params) => {
  addUI(params).then(res => {
    if (res.success) {
      showAdd.value = false
      addDiaInfo.value = null
      imgInfoData.value = null
      imgRef.value = null
      imgUrl.value = undefined
      getTreeData(1)
    }
  })
}
//关闭上传ui弹窗
const handleCloseAddDia = () => {
  showAdd.value = false
  addDiaInfo.value = null
}

//type:1=>页面初始化赋值；2：保存后更新赋值
async function getTreeData(type) {
  let proCode = route.query.proCode ? route.query.proCode :
      localStorage.getItem('global_ProjectCode') ? localStorage.getItem('global_ProjectCode') : ''
  if (!proCode) {
    noData.value = true
    return
  }
  getTreeList({projectId: proCode}).then(res => {
    if (res.success) {
      let tree = res?.data?.moduleList ?? []
      pageName.value = res?.data?.projectName ?? '-'
      if (tree && tree.length != 0) {
        addIsLeaf(tree)
        baseTree.value = JSON.parse(JSON.stringify(tree))
        treeList.value = tree
        if (type == 1) {
          defaltclick.value = localStorage.getItem('selectNodes')
          treeRef.value?.setCurrentKey(defaltclick.value)
          selectData.value = defaltclick.value
          getDetailInfo(defaltclick.value)
        } else if (type == 2) {
          detailInfo.value = null
          nextTick(() => {
            modelName.value = route.query.modelName
          })
        }
      } else {
        treeList.value = []
      }
    }

  })


}

function handleClickNode(data) {
  imgInfoData.value = null
  imgRef.value = null
  imgUrl.value = undefined
  if (data.nodeType != 'project') {
    localStorage.setItem('selectNodes', data.id)
    selectData.value = data.id
    getDetailInfo(data.id)
  } else {
    selectData.value = null
  }
  // if (data.children.length <= 0) {
  //     localStorage.setItem('selectNodes', data.id)
  //     selectData.value = data.id
  //     getDetailInfo(data.id)
  // } else {
  //     selectData.value = null
  // }
}

function getDetailInfo(id) {
  getTreeInfoList({'moduleId': id}).then(res => {
    if (res.success) {
      detailInfo.value = {
        nodePath: res.data.nodePath,
        moduleId: res.data.moduleId,
        list: res.data?.list ?? []
      }
      //编辑保存重新更新数据
      if (imgInfoData.value) {
        detailInfo.value.list.forEach(item => {
          if (imgInfoData.value.id == item.id) {
            imgInfoData.value = null
            imgInfoData.value = item
          }
        });
      }
    }
  })

}

function getStatusListFn() {
  getDicList('REVIEW_STATUS').then(res => {
    if (res.success) {
      stateList.value = res?.data ?? []
    }
  })

}


const leftWidth = ref(300)
let startX = 0
let isResizing = ref(false)

const startResize = (e) => {
  isResizing.value = true
  startX = e.clientX
  document.addEventListener('mousemove', resize)
  document.addEventListener('mouseup', stopResize)
}

const resize = (e) => {
  if (!isResizing.value) return
  const diff = e.clientX - startX
  leftWidth.value = Math.max(300, Math.min(leftWidth.value + diff, window.innerWidth * 0.5)) // 限制宽度范围
  startX = e.clientX
}

const stopResize = () => {
  isResizing.value = false
  document.removeEventListener('mousemove', resize)
  document.removeEventListener('mouseup', stopResize)
}

onUnmounted(() => {
  document.removeEventListener('mousemove', resize)
  document.removeEventListener('mouseup', stopResize)
})

onMounted(async () => {
  getStatusListFn()
  if (route.query.modelName) {
    await getTreeData(2)
  } else {
    getTreeData()
  }

})

</script>
<style lang="scss" scoped>
.main-content {
  background: #f6f8fc;
  height: 100%;
}

.container-view {
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .view-left {
    width: 300px;
    height: 100%;
    // margin-right: 10px;
    background: #fff;
    padding: 20px;
    border-radius: 4px;

    .tree-search {
      margin-bottom: 10px;
    }

    .tree-content {
      height: calc(100vh - 226px);
      overflow-y: hidden;

      :deep(.el-tree > .el-tree-node > .el-tree-node__children){
        overflow-y: auto;
        height: calc(100vh - 254px);
      }
    }

    .custom-tree-node {
      width: 100%;
      display: inline-flex;
      justify-content: space-between;
      align-items: center;

      .tree-opt-btn {
        cursor: pointer;
      }
    }
  }

  .resizer {
    width: 2px;
    height: calc(100vh - 146px);
    background: #FFF;
    cursor: col-resize;
    margin-right: 10px;
  }

  .view-right {
    // width: calc(100% - 324px);
    flex: 1;
    height: calc(100vh - 146px);
    overflow-y: auto;

    .empty-content {
      margin-top: 100px;

      .empty-text {
        margin-top: 24px;
        font-size: 14px;
        color: #333;
        font-weight: 400;

        .empty-text-2 {
          font-weight: 400;
          color: #999999;
          font-size: 12px;
        }
      }


    }

    .rigth-main {
      height: 100%;

      .page-path {
        font-size: 12px;
        color: #333;
        padding-bottom: 14px;
        border-bottom: 1px solid #e2e4e8;
      }

      .main-header {
        margin-top: 12px;
        margin-bottom: 12px;

        .info-text {
          font-size: 14px;
          color: #666;
          font-weight: 400;
          font-family: PingFang SC;
        }

        .opt-btn {
          padding: 0 12px;
          height: 32px;
          line-height: 32px;
          border-radius: 4px;

          .upload-icon {
            display: inline-block;
            margin-right: 3px;
            width: 12px;
            height: 12px;
            margin-right: 2px;
            background: url(@/assets/images/ui/upload-icon.png) no-repeat center;
            background-size: content;
            vertical-align: middle;
          }
        }
      }

      .main-list {
        width: 100%;

        .list-item {
          width: 250px;
          height: 78px;
          box-sizing: border-box;
          border-radius: 8px;
          padding: 16px;
          background: #fff;
          border: 1px solid #fff;
          cursor: pointer;
          margin-bottom: 8px;

          .item-name {
            font-weight: 500;
            color: #333;
            font-size: 14px;
            height: 20px;
            line-height: 20px;
            display: flex;
            margin-bottom: 9px;
            justify-content: space-between;

            .item-ver {
              font-size: 12px;
              color: #666;
              display: inline-block;
              padding-left: 5px;
            }
          }

          .item-text {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            font-weight: 400;

            .item-text-content {
              font-size: 12px;
              color: #007aff;
              height: 22px;
              line-height: 22px;
              padding: 0 8px;
              border-radius: 4px;
              display: inline-block;
              background: #e5f1ff;

              &.pass {
                color: #04b42a;
                background: #d9fce1;
              }
            }

            .status-pass {
              display: inline-block;
              width: 12px;
              height: 12px;
              margin-right: 3px;
              background: url(@/assets/webp/ico-pass.webp) no-repeat center;
              background-size: cover;
              vertical-align: -1px;
            }
          }

          .item-time {
            font-weight: 400;
            font-size: 12px;
            color: #999;
          }
        }
      }

      .list-item:hover {
        //background: linear-gradient(180deg, #e9f2ff 0%, #ffffff 100%);
        border: 1px solid rgba(33, 115, 247, 0.5);
      }

      .item-active {
        //background: linear-gradient(180deg, #e9f2ff 0%, #ffffff 100%) !important;
        border: 1px solid rgba(33, 115, 247, 0.5) !important;
      }

      .more-view {
        width: 100%;
        margin-top: 20px;
        height: calc(100% - 234px);

        .content-title {
          margin-bottom: 16px;
          font-size: 16px;
          color: #333333;
          font-weight: 500;
          font-family: PingFang SC;
        }

        .content-view {
          width: 100%;
          height: calc(100% - 37px);
          background: #fff;
          align-items: flex-start;
          column-gap: 16px;

          .content-view-left {
            flex: 1;

            .img-show {
              margin-bottom: 16px;
              background: #f6f7f9;
              border-radius: 8px;
              width: 100%;
              height: 450px;
              border-radius: 8px;

              .small-show {
                width: 100%;
                height: 100%;
              }
            }
          }

          .content-view-right {
            height: 100%;

            .content-right-name {
              margin-bottom: 9px;
              font-size: 16px;
              color: #333;
              font-weight: 400;
              font-family: 'Microsoft YaHei', 'PingFang SC';
            }

            .detail-card-wrapper {
              position: relative;
            }

            .detail-card {
              width: 300px;
              height: 440px;
              padding: 12px 12px 0;
              border: 1px solid #ececec;
              border-radius: 8px;
              overflow-y: auto;
              overflow-x: hidden;
              padding-bottom: 40px;

              &::-webkit-scrollbar {
                width: 4px;
              }

              .form-item {
                width: 100%;
                margin-bottom: 8px;
                display: flex;
                justify-content: flex-start;
                align-items: flex-start;

                .form-label {
                  width: 90px;
                  margin-right: 28px;
                  color: #666;
                  font-size: 14px;
                  flex-shrink: 0;
                }

                .form-val {
                  width: calc(100% - 85px);
                  font-weight: 400;
                  color: #333;
                  font-size: 14px;
                }

                .btn-edit {
                  margin-right: 12px;
                  width: 76px;
                  height: 30px;
                  line-height: 28px;
                  background: #fff;
                  border-radius: 4px;
                  border: 1px solid #2173f7;
                  color: #2173f7;
                  text-align: center;
                  font-size: 14px;
                  font-weight: 400;
                  cursor: pointer;
                }

                .btn-dele {
                  width: 76px;
                  height: 30px;
                  line-height: 28px;
                  background: #fff;
                  border-radius: 4px;
                  border: 1px solid #999;
                  color: #333;
                  text-align: center;
                  font-size: 14px;
                  font-weight: 400;
                  cursor: pointer;
                }
              }

              .form-item-bottom {
                position: absolute;
                bottom: 1px;
                padding-top: 8px;
                padding-bottom: 8px;
                margin-bottom: 0;
                width: 90%;
                background: #fff;
              }
            }
          }
        }


        // .small-show {
        //     margin: 20px auto
        // }
      }
    }
  }

  .view-right-all {
    width: 100%;
  }
}

.icon-pro {
  display: inline-block;
  margin-right: 11px;
  width: 16px;
  height: 16px;
  background: url('@/assets/images/ui/tree-project-icon.png') no-repeat center;
  background-size: cover;
  vertical-align: text-top;
}

.icon-filed {
  display: inline-block;
  margin-right: 11px;
  width: 16px;
  height: 16px;
  background: url('@/assets/images/ui/tree-menu-icon.png') no-repeat center;
  background-size: cover;
  vertical-align: text-top;
}

.icon-page {
  display: inline-block;
  margin-right: 11px;
  width: 16px;
  height: 16px;
  background: url('@/assets/images/ui/tree-page-icon.png') no-repeat center;
  background-size: cover;
  vertical-align: text-top;
}

.node-text {
  font-size: 14px;
  color: #333;
  line-height: 16px;
}

.node-has-icon {
  width: 14px;
  height: 14px;
  display: inline-block;
  margin-right: 10px;
}

:deep(.el-input) {
  --el-input-height: 28px;
  --el-input-border-color: #DBDDE3;
  --el-input-border-radius: 4px;
  --el-input-padding-left: 10px;
  --el-input-padding-right: 10px;
}

:deep(.el-textarea__inner) {
  min-height: 146px !important;
}

:deep(.el-tree--highlight-current) {
  .el-tree-node.is-current > .el-tree-node__content {
    background: #eef0f3;
  }
}

:deep(.el-tree-node__content) {
  height: 36px !important;
}

/* 整个滚动条 */
::-webkit-scrollbar {
  width: 8px;
  /* 宽度 */
  height: 8px;
  /* 高度 */
}

/* 滚动条轨道 */
::-webkit-scrollbar-track {
  background: none;
  /* 颜色 */
}

/* 滚动条的滑块 */
::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  /* 颜色 */
  border-radius: 4px;
}

/* 滚动条的滑块：鼠标悬停时 */
::-webkit-scrollbar-thumb:hover {
  background: #e9e9e9;
  /* 颜色 */
}

.empty-img {
  width: 80px;
}

.opt-button-fix {
  display: inline-block;
  padding: 0;
  width: 250px;
  height: 36px;
  line-height: 36px;
  text-align: center;

  .upload-icon {
    display: inline-block;
    margin-right: 3px;
    width: 12px;
    height: 12px;
    background: url(@/assets/images/ui/upload-icon.png) no-repeat center;
    background-size: contain;
    vertical-align: middle;
  }
}

.right-main-wrapper-empty {
  margin: 82px 0 0;
  text-align: center;
}

.right-main-wapper {
  gap: 12px;

  .left-plan-item {
    width: 250px;
  }
}

.page-path-content {
  background: #fff;
  padding: 16px;

  .page-path-icon {
    margin-right: 3px;
    vertical-align: -2px;
  }

  .opt-content {
    margin-top: 16px;
    gap: 12px;

    .opt-btn {
      height: 36px;
      line-height: 36px;
      padding: 0;
      width: 128px;
      text-align: center;
    }
  }
}

.right-plan-item {
  flex: 1;
}

.opt-content {
  margin-bottom: 20px;

  .opt-btn {
    padding: 10px 48px;
    border-radius: 4px;
    color: #f2f8fb;
    font-size: 16px;
    font-weight: 400;
  }
}

.item-name-title{
  width: 160px;
  flex-shrink: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>