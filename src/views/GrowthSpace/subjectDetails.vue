<template>
  <div v-if="isShowPage" class="growth-content">
    <div class="growth-container">
      <MenuBreadCom :name="menuPathName"></MenuBreadCom>
      <div class="theme-card">
        <div class="theme-title jus-start-center">
          <div class="title-1">{{ themeDetailInfo.themeName }}</div>
          <div v-if="themeDetailInfo.themeTypeCode" class="theme-type theme-type-com">
            {{
              themeDetailInfo.themeTypeCode == 'share' ? '分享会' : themeDetailInfo.themeTypeCode == 'communication' ? '沟通会' : '-'
            }}
          </div>
          <div v-if="hasChanged" class="change-tip jus-start-center">
            <el-icon>
              <warningFilled/>
            </el-icon>
            <span>提示：主题信息采集字段有变动</span>
          </div>
        </div>
        <div class="line-one jus-start-center">
          <div>
            <span class="info-key">期数：</span>
            <span class="info-val">{{ themeDetailInfo.period || '-' }}</span>
          </div>

          <div class="vertical-line"></div>
          <div>
            <span class="info-key">创建人：</span>
            <span class="info-val">{{ themeDetailInfo.createdBy || '-' }}</span>
          </div>
          <div class="vertical-line"></div>
          <div>
            <span class="info-key">创建时间：</span>
            <span class="info-val">{{ themeDetailInfo.createdAt || '-' }}</span>
          </div>
        </div>
        <div class="line-two jus-flex-start">
          <span class="info-key">描述：</span>
          <span class="info-val info-desc">{{ themeDetailInfo.description || '-' }}</span>
        </div>
        <div class="jus-start-center">
          <div :class="{ 'theme-status-nostart': themeDetailInfo.status == 'not_started', 'theme-status-starting': themeDetailInfo.status == 'starting', 'theme-status-end': themeDetailInfo.status == 'ended' }"
               class="theme-status">
            {{
              themeDetailInfo.status == 'not_started' ? '未开始' : themeDetailInfo.status == 'starting' ? '开放中' : themeDetailInfo.status == 'ended' ? '已结束' : '-'
            }}
          </div>
          <div>
            <span class="info-key">开放周期：</span>
            <span class="info-val">{{ themeDetailInfo.startTime || '-' }} 至 {{ themeDetailInfo.endTime || '-' }}</span>
          </div>
        </div>
      </div>

      <div class="theme-content">
        <div class="tab-line jus-bet-center">
          <div class="tab-content jus-flex-start">
            <div :class="activeTab == 1 ? 'tab-btn-active' : 'tab-btn'" class="tab" @click="activeTab = 1">
              <div class="tab-name">已提交信息</div>
              <div :class="activeTab == 1 ? 'selected-tab-line': 'tab-line'"></div>
            </div>
            <div :class="activeTab == 2 ? 'tab-btn-active' : 'tab-btn'" class="tab" @click="activeTab = 2">
              <div class="tab-name">词云</div>
              <div :class="activeTab == 2 ? 'selected-tab-line': 'tab-line'"></div>
            </div>
          </div>
          <div v-if="themeDetailInfo.status == 'starting'" class="opt-btn jus-center" @click="handleShowAddMeet">
            <el-icon>
              <Plus/>
            </el-icon>
            <span>{{ hasFilled ? '编辑' : '填写' }}</span>
          </div>
        </div>
        <div class="info-content">
          <div v-show="activeTab == 1" class="theme-meet">
            <div v-if="themeMeetList.length > 0" class="meet-list jus-flex-start">
              <MeetCard v-for="item in themeMeetList" :key="item.id" :meetInfo="item" class="meet-item"
                        @optDeleteInfo="handleDeleteInfo" @optLike="handleLikeInfo"
                        @optShowDetail="handleShowMeetDetail"/>
            </div>
            <EmptyDia v-else :type="'zwsj'"></EmptyDia>
          </div>
          <div v-show="activeTab == 2" class="theme-meet bg-white">
            <div v-if="wordData.length > 0" class="tip-text jus-center">
              <div class="hoz-line"></div>
              <div>基于<span class="cloud-keyword">“{{ cloudKeyword }}”</span>数据生成的词云图</div>
              <div class="hoz-line"></div>
            </div>
            <WordCloud v-if="wordData.length > 0" :data="wordData"/>
            <EmptyDia v-else :type="'zwsj'"></EmptyDia>
          </div>
        </div>
      </div>
    </div>

    <AddThemeMeet v-if="isShowAddMeetDia" :customFields="themeDetailInfo.fields" :detailInfo="detailInfo" :isShow="isShowAddMeetDia"
                  :meetingCode="meetingCode"
                  :optType="optionType" @addConfirmFn="handleAddConfirmDia" @closeDiaFn="handleCloseDia"
                  @editConfirmFn="handleEditConfirmDia"/>
  </div>
</template>

<script setup>
import {onBeforeMount, ref} from 'vue';
import MenuBreadCom from './components/MenuBreadCom.vue';
import MeetCard from './components/MeetCard.vue';
import AddThemeMeet from './components/AddThemeMeet.vue'
import WordCloud from './components/WordCloud.vue'
import EmptyDia from '@/components/EmptyDia.vue'
import {useRoute} from 'vue-router'
import {deleteInfo, getInfoList, getWordCloud, growthSpaceDetail, saveInfo, saveLikeInfo} from '@/api/growthSpaceApi.js'

const route = useRoute()

const userInfo = ref()
userInfo.value = JSON.parse(localStorage.getItem('agiles_user'))
const isShowPage = ref(false)
const meetingCode = ref('')
const menuPathName = ref('主题详情')
const activeTab = ref('1')
const isShowAddMeetDia = ref(false) // 是否展示会议弹窗
const detailInfo = ref()
const optionType = ref('')
const themeDetailInfo = ref()
const themeMeetList = ref([])
const hasFilled = ref(false)
const wordData = ref([
  // {
  // "value": 11.7392043070835,
  // "name": "体外循环"
  // },
  // {
  // "value": 9.23723855786,
  // "name": "偏好现金"
  // },
  // {
  // "value": 7.75434839431,
  // "name": "新成立公司"
  // },
  // {
  // "value": 11.3865516372,
  // "name": "相同董监高"
  // },
  // {
  // "value": 7.75434839431,
  // "name": "司法风险"
  // },
  // {
  // "value": 5.83541244308,
  // "name": "小微企业"
  // },
  // {
  // "value": 15.83541244308,
  // "name": "同名称交易"
  // },
  // {
  // "value": 2.83541244308,
  // "name": "高频交易"
  // },
  // {
  // "value": 5.83541244308,
  // "name": "大额交易"
  // },
  // {
  // "value": 10.83541244308,
  // "name": "贸易公司"
  // },
  // {
  // "value": 5.83541244308,
  // "name": "票据偏好"
  // },
  // {
  // "value": 5.83541244308,
  // "name": "空转走单"
  // }
])
const hasChanged = ref(false) // 是否有变动提示
const cloudKeyword = ref('') // 词云配置项


const handleShowAddMeet = () => {
  if (!hasFilled.value) {
    optionType.value = '添加'
    isShowAddMeetDia.value = true
  } else {
    optionType.value = '编辑'
    let arr = themeMeetList.value.filter(item => item.createdBy == userInfo.value.name)[0]
    detailInfo.value = JSON.parse(JSON.stringify(arr))
    isShowAddMeetDia.value = true
  }
}

const handleShowMeetDetail = (row) => {
  optionType.value = '查看'
  detailInfo.value = row
  isShowAddMeetDia.value = true
}

const handleAddConfirmDia = (form) => {
  let params = JSON.parse(JSON.stringify(form))
  delete params.fileInfo

  saveInfo(params).then(res => {
    if (res.success) {
      handleCloseDia()
      getThemeMeetListFn()
    }
  })

}

const handleCloseDia = () => {
  isShowAddMeetDia.value = false
}

const handleLikeInfo = (info) => {
  let params = {
    registrationId: info.id,
    type: info.liked == 1 ? 0 : 1,
  }
  saveLikeInfo(params).then(res => {
    if (res.success) {
      getThemeMeetListFn()
    }
  })
}

// 删除主题信息
const handleDeleteInfo = (info) => {
  let params = {
    registrationId: info.id
  }
  deleteInfo(params).then(res => {
    if (res.success) {
      getThemeMeetListFn()
    }
  })
}

// 获取主题详情
const getThemeDetailInfoFn = () => {
  let params = {
    meetingCode: meetingCode.value
  }
  growthSpaceDetail(params).then(res => {
    if (res.success) {
      themeDetailInfo.value = res.data
      themeDetailInfo.value.fields.forEach(item => {
        item.fieldValue = ''
        if (item.isWordCloud == 1) {
          cloudKeyword.value = item.fieldName
        }
      })
      isShowPage.value = true
      if (res.data.hasUpdated == 1) {
        hasChanged.value = true
      }
    }
  })
}

// 会议列表
const getThemeMeetListFn = () => {
  let params = {
    meetingCode: meetingCode.value
  }
  getInfoList(params).then(res => {
    if (res.success) {
      themeMeetList.value = res.data
      hasFilled.value = themeMeetList.value.some(item => item.createdBy == userInfo.value.name)
    }
  })
}

const getWordCloudFn = () => {
  let params = {
    meetingCode: meetingCode.value
  }
  getWordCloud(params).then(res => {
    if (res.success) {
      wordData.value = res.data
    }
  })
}

onBeforeMount(() => {
  meetingCode.value = route.query.code
  getThemeDetailInfoFn()
  getThemeMeetListFn()
  getWordCloudFn()
})


</script>

<style lang="scss" scoped>
.growth-container {
  padding: 20px 0;
  background-color: transparent;
  font-family: 'PingFangSC';

  .theme-card {
    margin: 16px 0 24px;
    padding: 16px 16px 12px;
    background-color: #FFF;
    border-radius: 8px;

    .title-1 {
      color: #333;
    }

    .change-tip {
      gap: 4px;
      margin-left: 12px;
      height: 20px;
      line-height: 20px;
      padding: 0 10px;
      background-color: #FDF6EC;
      border: 1px solid #F5F0DC;
      border-radius: 4px;
      font-size: 12px;
      color: #E6A23C;

      span {
        color: #E6A23C;
      }
    }

    .line-one {
      gap: 30px;
      margin-top: 20px;
    }

    .line-two {
      margin: 12px 0 8px;
      flex-wrap: wrap;

      .info-desc {
        display: block;
        width: calc(100% - 50px);
        height: 44px;
      }
    }

    .info-key {
      color: #999;
    }

    .info-val {
      color: #666;
      flex-shrink: 0;
    }


    .vertical-line {
      width: 1px;
      height: 16px;
      background-color: #D6D6D6;
    }
  }

  .theme-content {
    .tab-content {

      .tab {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 5px;
        margin-right: 24px;
        user-select: none;
        cursor: pointer;
      }

      .tab-btn .tab-name {
        font-size: 16px;
        color: #666;
        font-family: 'Microsoft YaHei', 'PingFang SC';
      }

      .tab-btn-active .tab-name {
        font-size: 16px;
        color: #111;
        font-weight: bold !important;
        font-family: 'Microsoft YaHei', 'PingFang SC';
      }

      .tab-line {
        width: 32px;
        height: 3px;
        border-radius: 2px;
        background-color: transparent;
      }

      .selected-tab-line {
        width: 32px;
        height: 3px;
        border-radius: 2px;
        background-color: var(--el-color-primary);
      }

    }

    .opt-btn {
      gap: 5px;
      height: 32px;
      line-height: 32px;
      padding: 0 12px;
      border-radius: 4px;
    }

    .info-content {
      position: relative;
      margin-top: 16px;

      .tip-text {
        position: absolute;
        top: 0;
        width: 100%;
        gap: 8px;
        height: 80px;
        line-height: 80px;
        text-align: center;
        color: #666;
        background: #fff;
        z-index: 999;

        .cloud-keyword {
          color: #333;
          font-weight: bold;
        }

        .hoz-line {
          width: 10px;
          height: 1px;
          background-color: #666;
        }
      }

      .theme-meet {
        height: calc(100vh - 414px);
        overflow-y: auto;
        overflow-x: hidden;

        .meet-list {
          flex-wrap: wrap;
          gap: 16px;

          .meet-item {
            width: calc((100% - 32px) / 3);
            box-shadow: 0 0px 5px #e5ebff;
          }
        }
      }

      .bg-white {
        background-color: #FFF;
        border-radius: 8px;
      }
    }
  }
}
</style>