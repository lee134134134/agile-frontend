<template>
  <div class="main-content">
    <!--        <div class="menu-title jus-start-center">-->
    <!--            <div class="title-1">迭代回顾</div>-->
    <!--            <div class="sel-global-project">当前项目：{{ globalProjectName }} - {{ globalProjectStatus }}</div>-->
    <!--        </div>-->
    <div class="search-content jus-bet-center border-radius-8">
      <el-form ref="searchFromRef" :model="searchFrom">
        <el-row :gutter="24">
          <!-- <el-col :span="12">
              <el-form-item label="所属项目" prop="projectCode">
                  <el-select v-model="searchFrom.projectCode" placeholder="请选择" clearable style="width: 260px;">
                      <el-option v-for="item in projectList" :key="item.projectId" :label="item.name"
                          :value="item.projectId" />
                  </el-select>
              </el-form-item>
          </el-col> -->
          <el-col :span="24">
            <!-- <el-form-item label="关键词" prop="sprintName">
                <el-input v-model="searchFrom.sprintName" placeholder="请输入" clearable></el-input>
            </el-form-item> -->
            <el-form-item label="迭代名称" prop="sprintName">
              <el-select v-model="searchFrom.sprintName" clearable placeholder="请选择" style="width: 260px;"
                         @change="handleSerach" popper-class="custom-iteration-popper">
                <template v-for="group in curUserProjectIterationList" :key="group.state">
                  <el-option disabled class="group-title-option" :value="`group-${group.state}`">
                    <div class="group-header-content" :class="getGroupClass(group.state)">
                      <el-icon class="status-icon">
                        <img v-if="group.state === '进行中'" class="status-icon-img" src="@/assets/webp/select_todo.webp" alt="">
                        <img v-else-if="group.state === '未开始'" class="status-icon-img" src="@/assets/webp/select_nostart.webp" alt="">
                        <img v-else class="status-icon-img" src="@/assets/webp/select_com.webp" alt="">
                      </el-icon>
                      <span>{{ group.state }}</span>
                    </div>
                  </el-option>
                  <el-option
                      v-for="item in group.list"
                      :key="item.code"
                      :label="item.name"
                      :value="item.name"
                      class="iteration-item-option"
                  />
                </template>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- <div class="search-btn jus-flex-end">
          <div class="btn-primary btn-margin-right" @click="handleSerach">筛选</div>
          <div class="btn-circle" @click="handleReset">重置</div>
      </div> -->
    </div>
    <div class="main-container">
      <div ref="groupContainerRef" class="group-contaner">
        <div v-for="(group, groupName, index) in list" :key="index" class="group-content">
          <div v-if="groupName == 'in_progress' || groupName == 'done'">
            <div class="group-title title-2">
              {{ groupName == 'in_progress' ? '进行中' : groupName == 'done' ? '已完成' : '未开始' }}
            </div>
            <div class="group-item-content jus-start-center">
              <div v-for="item in group" :key="item.sprintId" class="item-card">
                <div class="card-title title-1">{{ item.name }}</div>
                <section class="card-item-fix flex">
                  <img alt="" class="img-item" src="@/assets/webp/itera-icon.webp">
                  <div class="item">
                    <div class="info-item jus-start-center">
                      <div class="info-label">周期：</div>
                      <div class="info-val">{{ item.startDate || '-' }} 至 {{ item.endDate || '-' }}</div>
                    </div>
                    <div class="info-item jus-start-center">
                      <div class="info-label">团队：</div>
                      <div class="info-val">{{ item.teamName || '-' }}（{{ item.teamAll || '-' }}人）</div>
                    </div>
                  </div>
                </section>
                <div class="item-btn jus-bet-center">
                  <div class="btn-line jus-center btn" @click="getLinePage(item)">
                    <el-icon>
                      <img alt="" class="img-icon" src="@/assets/webp/iterat-like.webp">
                    </el-icon>
                    <!-- <div class="btn-val">心情曲线({{ item.moodAll }})</div> -->
                    <div class="btn-val">心情曲线</div>
                  </div>
                  <div class="btn-yj jus-center btn" @click="getFeedbackPage(item)">
                    <el-icon>
                      <img alt="" class="img-icon" src="@/assets/webp/iterat-idea.webp">
                    </el-icon>
                    <div class="btn-val">意见反馈({{ item.opfbAll }})</div>
                  </div>
                  <div class="btn-zj jus-center btn" @click="getSummaryPage(item)">
                    <el-icon>
                      <img alt="" class="img-icon" src="@/assets/webp/iterat-result.webp">
                    </el-icon>
                    <div class="btn-val">迭代总结({{ item.summaryAll }}/{{ item.teamAll }})</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script setup>
import {nextTick, onBeforeMount, reactive, ref, watch} from 'vue';
import {onBeforeRouteLeave, useRouter} from 'vue-router';
import {getUserProjectIterationList, getUserProjectList} from '@/api/api';
import {handleReviewIteraList} from '@/api/iterationReviewApi';
import {useDicStore} from '@/stores/dic.js';

const dicStore = useDicStore()
const router = useRouter();
const searchFromRef = ref(null)
const groupContainerRef = ref(null)
const searchFrom = reactive({
  projectCode: '',
  sprintName: ''
})
const projectList = ref([])
const curUserProjectIterationList = ref([])
const list = ref([
  {
    id: 1,
    type: '进行中迭代',
    child: [
      {
        id: 'SPRINT_2025_00001',
        name: 'SPRINT_2025_00001',
        time: '2025-11-10至2025-11-28',
        team: '敏捷开发团队（9人）',
        line: 9,
        yj: 9,
        zj: 9
      }, {
        id: '1-2',
        name: '敏捷开发平台-java',
        time: '2025-11-10至2025-11-28',
        team: '敏捷开发团队（9人）',
        line: 9,
        yj: 9,
        zj: 9
      }
    ]
  }, {
    id: 2,
    type: '已完成迭代',
    child: [
      {
        id: '2-1',
        name: '敏捷开发平台-java',
        time: '2025-11-10至2025-11-28',
        team: '敏捷开发团队（9人）',
        line: 9,
        yj: 9,
        zj: 9
      }, {
        id: '2-2',
        name: '敏捷开发平台-java',
        time: '2025-11-10至2025-11-28',
        team: '敏捷开发团队（9人）',
        line: 9,
        yj: 9,
        zj: 9
      }, {
        id: '2-3',
        name: '敏捷开发平台-java',
        time: '2025-11-10至2025-11-28',
        team: '敏捷开发团队（9人）',
        line: 9,
        yj: 9,
        zj: 9
      }
    ]
  }
])
const globalProjectName = ref(localStorage.getItem('global_ProjectName'))
const globalProjectStatus = ref(localStorage.getItem('global_ProjectStatus'))
const getLinePage = (data) => {
  router.push({
    path: '/iterationRetrospective/moodCurve', query: {
      id: data.sprintId,
      name: data.name,
      status: data.status
    }
  })
}
// 状态对应的样式类
const getGroupClass = (state) => {
  if (state === '进行中') return 'is-ongoing';
  if (state === '已完成') return 'is-completed';
  return 'is-default';
}
const getFeedbackPage = (data) => {
  router.push({
    path: '/iterationRetrospective/feedbackPage', query: {
      id: data.sprintId,
      name: data.name
    }
  })
}
const getSummaryPage = (data) => {
  router.push({
    path: '/iterationRetrospective/iterationSummary', query: {
      id: data.sprintId,
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
    }
  })
}
const getUserProjectFn = () => {
  getUserProjectList().then(res => {
    if (res.success) {
      projectList.value = res?.data ?? []
    }
  })
}
const handleSerach = () => {
  getList()
}
const handleReset = () => {
  searchFromRef.value.resetFields();
  getList()
}

function getList() {
  searchFrom.projectCode = searchFrom.projectCode || ''
  searchFrom.sprintName = searchFrom.sprintName || ''
  //获取列表
  handleReviewIteraList(searchFrom).then(res => {
    if (res.success) {
      list.value = res.data
      nextTick(() => {
        const scrollTop = localStorage.getItem('ITERATION_RETRO_SCROLL_TOP')
        if (scrollTop && groupContainerRef.value) {
          groupContainerRef.value.scrollTop = Number(scrollTop)
          localStorage.removeItem('ITERATION_RETRO_SCROLL_TOP')
        }
      })
    }
  })
}

onBeforeRouteLeave((to, from, next) => {
  const validPaths = [
    '/iterationRetrospective/moodCurve',
    '/iterationRetrospective/feedbackPage',
    '/iterationRetrospective/iterationSummary'
  ]
  if (validPaths.some(path => to.path.includes(path))) {
    if (groupContainerRef.value) {
      localStorage.setItem('ITERATION_RETRO_SCROLL_TOP', groupContainerRef.value.scrollTop)
    }
  } else {
    localStorage.removeItem('ITERATION_RETRO_SCROLL_TOP')
  }
  next()
})


// 获取项目下的迭代
const getProjectIterationListFn = () => {
  let params = {
    projectId: searchFrom.projectCode || undefined
  }
  getUserProjectIterationList(params).then(res => {
    if (res.success) {
      curUserProjectIterationList.value = res?.data ?? []
      if (!curUserProjectIterationList.value.some(item => item.code == searchFrom.sprintId)) {
        searchFrom.sprintId = ''
      }
    }
  })
}

// 所属项目 -->  迭代  
watch(() => searchFrom.projectCode, (newvalue, oldvalue) => {
  getProjectIterationListFn()
}, {deep: true})

watch(() => dicStore.globalProjectCode, (newVal) => {
  globalProjectName.value = localStorage.getItem('global_ProjectName')
  globalProjectStatus.value = localStorage.getItem('global_ProjectStatus')
  searchFrom.projectCode = newVal
  handleSerach()
})

onBeforeMount(() => {
  searchFrom.projectCode = localStorage.getItem('global_ProjectCode') // 初始赋值：从缓存中取
  getUserProjectFn()
  getProjectIterationListFn() // 项目下的迭代
  getList()
})
</script>
<style lang="scss" scoped>
.main-content {
  padding-bottom: 0;
  height: 100%;

  .menu-title {
    margin-bottom: 15px;
  }

  .search-content {
    padding: 0 20px 8px;

    .search-btn {
      margin-left: 20px;
      padding-right: 20px;
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
      height: 28px;
      border-radius: 4px;
    }

  }

  .main-container {
    // border: 1px solid #ddd;
    border-bottom: none;
    border-radius: 8px 8px 0 0;

    .container-title {
      height: 40px;
      line-height: 40px;
      // background-color: #E6EEFF;
      padding-left: 15px;
      border-radius: 8px 8px 0 0;
    }

    .group-contaner {
      padding: 10px 0;
      // margin-right: -15px;
      height: calc(100vh - 150px);
      overflow-y: auto;
    }

    .group-content {
      margin-bottom: 16px;

      .group-title {
        margin-bottom: 12px;
        font-size: 14px;
        color: #666;
      }

      .group-item-content {
        flex-wrap: wrap;
        gap: 16px;

        .item-card {
          padding: 24px;
          width: 32.5%;
          background: #fff;
          border-radius: 8px;
          border: 1px solid #fff;

          .card-title {
            height: 22px;
            line-height: 22px;
            font-size: 16px;
            color: #333;
            font-weight: bold;
            margin-bottom: 15px;
          }

          .info-item {
            margin: 5px 0;

            .info-label {
              font-size: 14px;
              color: #666;
            }

            .info-val {
              font-size: 14px;
              color: #333;
            }
          }

          .item-btn {
            margin-top: 10px;
            gap: 12px;

            .btn {
              border-radius: 4px;
              flex: 1;
              height: 30px;
              line-height: 30px;
              font-size: 12px;
              cursor: pointer;

              .btn-icon {
                width: 14px;
                height: 14px;

              }
            }

            .btn-val {
              margin-left: 5px;
            }

            .btn-line {
              border: 1px solid rgba(33, 115, 247, 0.1);
              background: rgba(33, 115, 247, 0.1);
              color: #2173f7;

              .btn-icon {
                background: url(@/assets/images/iteration/qx-icon.png) no-repeat center;
                background-size: cover;
              }

            }

            .btn-yj {
              border: 1px solid rgba(33, 115, 247, 0.1);
              background: rgba(33, 115, 247, 0.1);
              color: #2173f7;

              .btn-icon {
                background: url(@/assets/images/iteration/yj-icon.png) no-repeat center;
                background-size: cover;
              }
            }

            .btn-zj {
              border: 1px solid rgba(33, 115, 247, 0.1);
              background: rgba(33, 115, 247, 0.1);
              color: #2173f7;

              .btn-icon {
                background: url(@/assets/images/iteration/zj-icon.png) no-repeat center;
                background-size: contain;
              }
            }

            .btn:hover {
              background: #fff;
              border: 1px solid #2173f7;
              box-shadow: 0 4px 6px 0 #cfe2ff;
            }
          }
        }

        .item-card:hover {
          box-shadow: 0px 4px 12px 0px rgba(127, 181, 255, 0.5);
          border: 1px solid rgba(33, 115, 247, 0.5);
        }
      }
    }
  }
}

.card-item-fix {

  .img-item {
    width: 42px;
    height: 42px;
    margin-right: 12px;
    margin-top: 8px;
  }
}

.img-icon {
  width: 14px;
  height: 14px;
}

/* 关键：伪装标题的容器样式 */
.group-header-content {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 12px;
  margin: 0 -20px; /* 填满整行 */
  font-weight: bold;
  font-size: 13px;

  .status-icon {
    margin-right: 6px;
    font-size: 14px;
  }

  &.is-ongoing {
    background-color: #f5faff;
    width: 130%;
    color: #409eff;
    font-size: 12px;
    line-height: 28px;
    height: 28px;
  }

  &.is-completed {
    background-color: #eefaf9;
    width: 130%;
    color: #67c23a;
    font-size: 12px;
    line-height: 28px;
    height: 28px;
  }

  &.is-default {
    background-color: #f6f8fa;
    width: 130%;
    color: #333333;
    font-size: 12px;
    line-height: 28px;
    height: 28px;
  }
}

.status-icon-img{
  width: 14px;
  height: 14px;
}


/* 强制清除 el-option 作为标题时的默认样式 */
:deep(.custom-iteration-popper) {
  .el-select-dropdown__item.is-disabled.group-title-option {
    cursor: default;
    opacity: 1; /* 防止置灰透明度 */
    height: 34px;
    line-height: 34px;
    padding: 0 20px;
    color: inherit;

    &:hover {
      background-color: transparent; /* 禁止标题行 hover 变色 */
    }
  }

  /* 正常的选项稍微缩进，模拟分组感 */
  .iteration-item-option {
    padding-left: 30px;
  }
}
</style>