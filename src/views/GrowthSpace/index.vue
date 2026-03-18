<template>
  <div class="growth-content">
    <div class="growth-container">
      <div v-show="btnAuthFileter('growth_add_theme')" class="jus-flex-end">
        <div class="btn-add jus-center" @click="handleAddTheme">
          <el-icon color="#fff" size="14px" style="margin-right:3px">
            <Plus/>
          </el-icon>
          <span>创建主题</span>
        </div>
      </div>
      <div class="space-header">
        <div class="header-title">
          欢迎来到<span class="text-color-them">成长空间</span>
        </div>
        <div class="header-info">在这里，您可以参与沟通会和分享会，记录您的学习成长轨迹，与团队成员共同进步。</div>
      </div>
      <div class="space-main">
        <div class="space-main-card-head jus-bet-center">
          <div class="title-bold-20">主题列表</div>
          <div class="jus-end-center">
            <el-form-item style="margin-right:12px">
              <el-select v-model="searchForm.themeTypeCode" clearable placeholder="全部类型"
                         style="width:108px" @change="handleSearch">
                <el-option v-for="item in typeList" :key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="searchForm.status" clearable placeholder="全部状态" style="width:108px"
                         @change="handleSearch">
                <el-option v-for="item in statusList" :key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </div>
        </div>

        <div class="space-list-content" v-if="themeList?.length > 0">
          <div v-for="item in themeList" :key="item.meetingCode" class="theme-card">
            <div class="theme-card-main" @click="goDetail(item.meetingCode)">
              <div class="theme-title jus-start-center">
                <div class="theme-title-text">{{
                    (item.themeName && item.themeName.length > 10 ?
                        item.themeName.substr(0, 10) + '...' :
                        item.themeName) || '-'
                  }}
                </div>
                <div :class="item.themeTypeCode == 'communication' ? 'theme-type-com' : 'theme-type-share'"
                     class="theme-type">
                  {{ item.themeTypeName }}
                </div>
              </div>
              <div class="theme-desc">{{
                  (item.description && item.description.length > 20 ?
                      item.description.substr(0, 20) + '...' : item.description) || ''
                }}
              </div>
              <div class="theme-defult-text">
                期数：{{ item.period }}
              </div>
              <div class="theme-defult-text">
                时间：{{ item.timeRange }}
              </div>
            </div>
            <div class="theme-card-foot jus-bet-center">
              <div :class="{ 'theme-status-nostart': item.status == 'not_started', 'theme-status-starting': item.status == 'starting', 'theme-status-end': item.status == 'ended' }"
                   class="theme-status">
                {{ item.statusName }}
              </div>
              <div class="opt-content jus-end-center">
                <img v-show="btnAuthFileter('growth_edit_theme')" alt=""
                     src="@/assets/images/growthSpace/edit_icon.png" @click="handleEditFn(item.meetingCode)">
                <img v-show="btnAuthFileter('growth_dele_theme')" alt="" src="@/assets/images/growthSpace/dele_icon.png"
                     style="margin-left: 16px;" @click="handleDeleFn(item)">
              </div>
            </div>
          </div>
        </div>
        <EmptyDia v-if="themeList.length <= 0" :type="'zwsj'"></EmptyDia>
        <div class="space-main-card-head title-bold-20">数据可视化</div>
        <div class="visual-content">
          <div class="visual-card jus-flex-start">
            <div class="img-content">
              <img alt="" src="@/assets/images/growthSpace/keh-img1.png">
            </div>
            <div class="visual-card-main">
              <div class="visual-card-title">主题参与热度趋势</div>
              <div class="visual-card-text">查看各期主题的参与人数变化趋势</div>
              <div class="visual-btn jus-center">
                <div class="visual-btn-text">查看详情</div>
                <img alt="" src="@/assets/images/growthSpace/right_icon.png">
              </div>
            </div>
          </div>
          <div class="visual-card jus-flex-start">
            <div class="img-content">
              <img alt="" src="@/assets/images/growthSpace/keh-img2.png">
            </div>
            <div class="visual-card-main">
              <div class="visual-card-title">岗位技能掌握情况</div>
              <div class="visual-card-text">对比不同岗位的技能掌握情况</div>
              <div class="visual-btn jus-center">
                <div class="visual-btn-text">查看详情</div>
                <img alt="" src="@/assets/images/growthSpace/right_icon.png">
              </div>
            </div>
          </div>
          <div class="visual-card jus-flex-start">
            <div class="img-content">
              <img alt="" src="@/assets/images/growthSpace/keh-img3.png">
            </div>
            <div class="visual-card-main">
              <div class="visual-card-title">分享会内容分类</div>
              <div class="visual-card-text">统计分享会内容的分类情况</div>
              <div class="visual-btn jus-center">
                <div class="visual-btn-text">查看详情</div>
                <img alt="" src="@/assets/images/growthSpace/right_icon.png">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ThemeOptDia v-if="optShow" :detailInfo="themDetail" :isShow="optShow" :type="optType" @ConfirmFn="handleAddSave"
                 @closeDiaFn="handleCloseDia" @editConfirmFn="handleEditSave"></ThemeOptDia>
  </div>
</template>
<script setup>
import {onBeforeMount, reactive, ref} from 'vue';
import {ElMessageBox} from 'element-plus';
import ThemeOptDia from './components/ThemeOptDia.vue';
import EmptyDia from '@/components/EmptyDia.vue';
import {btnAuthFileter} from "@/utils/index.js";
import {
  growthSpaceCreate,
  growthSpaceDele,
  growthSpaceDetail,
  growthSpaceList,
  growthSpaceUpdata
} from '@/api/growthSpaceApi.js'
import {useRouter} from 'vue-router';

const router = useRouter()
const searchForm = reactive({
  themeTypeCode: '',
  status: ''
})
const statusList = ref([
  {
    name: '未开始',
    value: 'not_started'
  }, {
    name: '开放中',
    value: 'starting'
  }, {
    name: '已结束',
    value: 'ended'
  }
])
const typeList = ref([
  {
    name: '沟通会',
    value: 'communication'
  }, {
    name: '分享会',
    value: 'share'
  }
])
const themeList = ref([])
const optShow = ref(false)
const optType = ref('')
const themDetail = ref(null)

const handleAddTheme = (data) => {
  optShow.value = true
  optType.value = '创建'
  themDetail.value = null
}
const handleCloseDia = () => {
  optShow.value = false
  optType.value = ''
  themDetail.value = null
}
const handleAddSave = (data) => {
  //创建主题
  growthSpaceCreate(data).then(res => {
    if (res.success) {
      optShow.value = false
      optType.value = ''
      themDetail.value = null
      handleSearch()
    }
  })
}
const handleEditSave = (data) => {
  //编辑主题
  growthSpaceUpdata(data).then(res => {
    if (res.success) {
      optShow.value = false
      optType.value = ''
      themDetail.value = null
      handleSearch()
    }
  })
}
const handleEditFn = (code) => {
  growthSpaceDetail({'meetingCode': code}).then(res => {
    if (res.success) {
      optShow.value = true
      optType.value = '编辑'
      themDetail.value = res.data
    }
  })

}
const handleDeleFn = (data) => {
  if (data.status != 'ended') {
    let infoText = data.status == 'not_started' ? '主题删除后不可恢复，请谨慎操作，是否确认删除？' : '当前主题已开放，删除后已登记信息即将清空，请谨慎操作，是否确认删除？'
    ElMessageBox.confirm(infoText, '', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      center: false,
      closeOnClickModal: false,
      autofocus: false,
      type: 'warning',
    }).then(() => {
      //删除接口调用
      growthSpaceDele({'meetingCode': data.meetingCode}).then(res => {
        if (res.success) {
          handleSearch()
        }
      })
    }).catch(() => {
      console.log('catch')
    })
  } else {
    ElMessageBox.alert('当前主题已结束，不允许删除', '', {
      confirmButtonText: '确认',
      center: false,
      closeOnClickModal: false,
      autofocus: false,
      type: 'warning',
      callback: () => {
        console.log('取消删除！')
      }
    })
  }
}
const goDetail = (code) => {
  router.push({path: '/growthSpace/subjectDetails', query: {'code': code}})
}

function handleSearch() {
  growthSpaceList(searchForm).then(res => {
    if (res.success) {
      themeList.value = res?.data ?? []
    }
  })
}

onBeforeMount(() => {
  handleSearch()
})
</script>
<style lang="scss" scoped>
.growth-container {
  font-family: 'PingFangSC';

  .btn-add {
    margin: 20px 0;
    width: 98px;
    height: 32px;
    line-height: 32px;
    background: #2173f7;
    border-radius: 4px;
    cursor: pointer;
    color: #fff;
    font-size: 14px;
  }

  .space-header {
    width: 100%;
    height: 160px;
    background: url('@/assets/images/growthSpace/banner.png') no-repeat center;
    background-size: 100% 100%;
    padding-top: 40px;
    padding-left: 40px;

    .header-title {
      margin-bottom: 12px;
      font-family: 'PingFangSC';
      font-weight: 600;
      color: #0e0e0e;
      font-size: 32px;

      .text-color-them {
        font-family: 'PingFangSC';
        font-weight: 600;
        font-size: 32px;
        color: transparent;
        background-image: linear-gradient(0deg, #0d78fe 0%, #0055ec 100%);
        -webkit-background-clip: text;
      }
    }

    .header-info {
      font-family: 'PingFangSC';
      font-weight: 400;
      font-size: 16px;
      color: #666666;
    }
  }

  .space-main {
    width: 100%;

    .space-main-card-head {
      margin-top: 32px;
      margin-bottom: 14px;
    }

    .space-list-content {
      width: 100%;
      height: calc(100vh - 620px);
      overflow-y: auto;
      display: flex;
      flex-wrap: wrap;
      gap: 2px;
      flex-shrink: 0;

      .theme-card {
        padding: 16px;
        height: 171px;
        margin: 5px 5px 10px;
        width: calc((100% - 46px) / 4);
        min-width: 258px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 0px 5px #e5ebff;

        .theme-card-main {
          width: 100%;
          border-bottom: 1px solid #eeeeee;
          padding-bottom: 16px;
          margin-bottom: 12px;
          cursor: pointer;

          .theme-title {
            .theme-title-text {
              font-weight: 500;
              font-size: 16px;
              color: #333;
            }
          }

          .theme-desc {
            margin-bottom: 12px;
            max-width: 90%;
            height: 17px;
            line-height: 22px;
            color: #999;
            font-weight: 400;
            font-size: 12px;
            text-align: left;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .theme-defult-text {
            height: 17px;
            line-height: 22px;
            color: #666;
            font-weight: 400;
            font-size: 12px;

          }
        }

        .opt-content {
          img {
            display: block;
            cursor: pointer;
          }
        }
      }
    }

    .visual-content {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      flex-shrink: 0;

      .visual-card {
        padding: 22px 28px;
        height: 135px;
        width: calc((100% - 36px) / 3);
        min-width: 345px;
        background: #f3f8ff;
        border-radius: 8px;
      }

      .img-content {
        width: 160px;
        height: 91px;

        img {
          display: block;
        }
      }

      .visual-card-main {
        width: calc(100% - 160px);

        .visual-card-title {
          font-weight: 500;
          font-size: 16px;
          color: #333;
        }

        .visual-card-text {
          margin-bottom: 22px;
          max-width: 90%;
          height: 17px;
          line-height: 22px;
          color: #999;
          font-weight: 400;
          font-size: 12px;
          text-align: left;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .visual-btn {
          width: 88px;
          height: 28px;
          line-height: 28px;
          background: #fff;
          border-radius: 4px;

          .visual-btn-text {
            color: #2173f7;
            font-size: 12px;
            font-weight: 400;
            margin-right: 5px;
          }
        }
      }
    }
  }

  :deep(.el-input) {
    --el-input-height: 28px;
    --el-input-border-color: #DBDDE3;
    --el-input-border-radius: 4px;
    --el-input-padding-left: 10px;
    --el-input-padding-right: 10px;
  }

  :deep(.el-select__wrapper) {
    height: 28px;
    border-radius: 4px;
  }
}
</style>