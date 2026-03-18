<template>
  <div class="page-detail">
    <MenuBreadCom :page="pageName"></MenuBreadCom>
    <div v-if="!isShowDia">
      <div class="jus-bet-center">
        <div class="title-1">{{ sprintName }} - 迭代总结</div>
        <div v-show="curUserSummary?.isCommit == '2'" class="opt-btn" @click="handleFillSummary">填写总结</div>
        <div v-show="curUserSummary?.isCommit == '1'" class="opt-btn" @click="handleEditSummary">编辑总结</div>
      </div>

      <div class="summary-list-content">
        <div class="inner-content">
          <div v-if="hasSubmitSummaryList.length == 0 && curUserSummary" class="no-data">
            <div class="no-data-text">暂无迭代总结</div>
            <div class="font16">该迭代尚未有成员提交总结报告</div>
            <div class="opt-btn jus-center" @click="handleFillSummary">
              <el-icon>
                <Plus/>
              </el-icon>
              <div class="ml5">创建迭代总结</div>
            </div>
          </div>

          <div v-if="hasSubmitSummaryList.length > 0" class="jus-start-center">
            <div class="title-text">已提交的总结</div>
          </div>
          <div v-if="hasSubmitSummaryList.length > 0" class="summary-box jus-start-center">
            <div v-for="item in hasSubmitSummaryList" :key="item.summaryId" class="summary-item">
              <div class="jus-center gap8">
                <img alt="" class="box-ava" src="@/assets/webp/summary-edit.webp">
              </div>
              <div class="jus-center gap8">
                <div>{{ item.nickName }}</div>
                <el-tag type="primary tag-primary">已提交</el-tag>
                <el-tag v-show="item.comment" type="warning tag-primary">新评论</el-tag>
              </div>
              <div style="height: 35px;">
                <div class="box-time"><span>提交时间：</span>{{ item.createTime || '-' }}</div>
                <div v-if="item.updateTime && item.createTime !== item.updateTime" class="box-time">
                  <span>更新时间：</span>{{
                    item.updateTime || '-'
                  }}
                </div>
              </div>
              <div class="jus-center gap8">
                <div v-if="userInfo.name == item.userName" class="jus-center detail-btn detail-btn-toggle"
                     @click="handleEditSummary">
                  <el-icon>
                    <img alt="" class="icon-summary" src="@/assets/webp/edit_gray.webp">
                    <img alt="" class="icon-summary ico-hover" src="@/assets/webp/edit.webp">
                  </el-icon>
                  <div class="ml5">编辑操作</div>
                </div>
                <!-- todo：配置按钮权限 -->
                <div v-if="canComment" class="jus-center detail-btn comment-btn detail-btn-toggle"
                     @click="handleComment(item)">
                  <el-icon>
                    <img alt="" class="icon-summary" src="@/assets/webp/summary-commit-gray.webp">
                    <img alt="" class="icon-summary ico-hover" src="@/assets/webp/summary-commit.webp">
                  </el-icon>
                  <div class="ml5">添加评论</div>
                </div>
                <div class="jus-center detail-btn detail-btn-toggle" @click="handleViewDetail(item)">
                  <el-icon>
                    <img alt="" class="icon-summary" src="@/assets/webp/summary-view-gray.webp">
                    <img alt="" class="icon-summary ico-hover" src="@/assets/webp/summary-view.webp">
                  </el-icon>
                  <div class="ml5">查看详情</div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="noSubmitSummaryList.length > 0" class="jus-start-center">
            <div class="title-text">尚未提交总结的成员</div>
          </div>
          <div v-if="noSubmitSummaryList.length > 0" class="summary-box jus-start-center">
            <div v-for="item in noSubmitSummaryList" :key="item.summaryId"
                 class="summary-item summary-item-nosubmit">
              <img alt="" class="box-ava" src="@/assets/webp/summary-ava.webp">
              <div class="jus-center gap8">
                <div class="font18">{{ item.nickName }}</div>
                <div class="submit-status no-submit">未提交</div>
              </div>
              <div v-if="userInfo.name == item.userName" class="jus-center gap8" @click="handleFillSummary">
                <div class="jus-center detail-btn">
                  <el-icon>
                    <img alt="" class="icon-summary" src="@/assets/webp/edit.webp">
                  </el-icon>
                  <div class="ml5">填写总结</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>

    <EditSummary v-if="isShowDia" :detailInfo="detailInfo" :endDate="endDate" :isShow="isShowDia"
                 :optionType="optionType"
                 :sprintName="sprintName" :startDate="startDate" class="edit-page" @closeDiaFn="handleCloseDia"
                 @confirmFn="handleSubmitFn" @editConfirmFn="handleEditFn" @editOwnSummary="editOwnSummary"
                 @saveCommentFn="saveCommentFn"/>
  </div>
</template>

<script setup>
import {onBeforeMount, ref} from 'vue';
import MenuBreadCom from './components/MenuBreadCom.vue';
import EditSummary from './components/EditSummary.vue';
import {getSummaryList, handleAddSummary, saveComment} from '@/api/iterationReviewApi.js';
import {btnAuthFileter} from "@/utils/index.js";
import {useRoute} from 'vue-router'
import {ElMessage} from 'element-plus';

const route = useRoute();

const userInfo = ref()
userInfo.value = JSON.parse(localStorage.getItem('agiles_user'))
const curSprintId = ref('')
const sprintName = ref('')
const startDate = ref('')
const endDate = ref('')
const pageName = ref('迭代总结')
const btnType = ref('add') // add: 填写 edit: 编辑 view:查看
const optionType = ref('')
const isShowDia = ref(false)
const summaryList = ref([])
const hasSubmitSummaryList = ref([])
const noSubmitSummaryList = ref([])
const curUserSummary = ref()
const detailInfo = ref()
const canComment = ref()
canComment.value = btnAuthFileter('summary_comment')

const handleFillSummary = () => {
  btnType.value = 'add'
  optionType.value = '创建'
  isShowDia.value = true
}

const editOwnSummary = () => {
  isShowDia.value = false
  setTimeout(() => {
    handleEditSummary()
  }, 0);
}

const handleEditSummary = () => {
  btnType.value = 'edit'
  optionType.value = '编辑'
  // 查询个人总结详情
  detailInfo.value = curUserSummary.value
  isShowDia.value = true
}

const handleViewDetail = (item) => {
  btnType.value == 'view'
  optionType.value = '查看'
  // 根据id查详情
  detailInfo.value = item
  isShowDia.value = true
}

// 评论
const handleComment = (item) => {
  optionType.value = '评论'
  detailInfo.value = item
  isShowDia.value = true
}

const handleCloseDia = () => {
  isShowDia.value = false
}

const handleSubmitFn = (form) => {
  form.sprintId = curSprintId.value
  // 调用提交总结接口
  handleAddSummary(form).then(res => {
    if (res.success) {
      ElMessage.success('保存成功')
      handleCloseDia()
      getDataList()
    }
  })


}

const handleEditFn = () => {

}

// 保存评论
const saveCommentFn = (form, summaryId) => {
  let params = {
    summaryId: summaryId,
    comment: form.comment,
    commentId: form.commentId || undefined
  }
  saveComment(params).then(res => {
    if (res.success) {
      handleCloseDia()
      getDataList()
    }
  })

}

const getDataList = () => {
  getSummaryList(curSprintId.value).then(res => {
    if (res.success) {
      summaryList.value = res.data
      hasSubmitSummaryList.value = res.data.filter(item => item.isCommit == '1')
      noSubmitSummaryList.value = res.data.filter(item => item.isCommit == '2')
      console.log('hasSubmitSummaryList==', hasSubmitSummaryList.value)
      console.log('noSubmitSummaryList==', noSubmitSummaryList.value)
      res.data.forEach(item => {
        if (userInfo.value.name == item.userName) {
          curUserSummary.value = item
        }
      });
    }
  })
}

onBeforeMount(() => {
  curSprintId.value = route.query.id
  sprintName.value = route.query.name
  startDate.value = route.query.startDate
  endDate.value = route.query.endDate
  getDataList()
})

</script>

<style lang="scss" scoped>
.page-detail {
  padding: 12px 20px 20px;
  height: 100%;
  background: #f6f8fc;

  .font16 {
    font-size: 12px;
    color: #727682;
  }

  .font18 {
    font-size: 16px;
    font-weight: bold;
  }

  .ml5 {
    margin-left: 5px;
  }

  .mt20 {
    margin-top: 20px;
  }

  .gap8 {
    gap: 5px;
  }

  .title-1 {
    margin: 16px 0;

  }

  .title-2 {
    margin: 0;
    padding: 15px;
    border-bottom: 1px solid #ccc;
  }

  .title-icon {
    margin-right: 8px;
    width: 4px;
    height: 16px;
    background: #2173F7;
    border-radius: 2px 2px 2px 2px;
  }

  .title-text {
    font-size: 14px;
    font-weight: 600;
    margin: 16px 0 12px;

    &:before {
      content: '';
      display: inline-block;
      width: 3px;
      height: 14px;
      background: #2173F7;
      margin-right: 6px;
      vertical-align: -1px;
    }
  }


  .summary-list-content {
    // padding: 0 0 15px;
    border-radius: 8px;

    .inner-content {
      overflow-y: auto;
      padding: 15px;
      height: calc(100vh - 150px);
    }

    .summary-box {
      flex-wrap: wrap;
      gap: 12px;
      width: 100%;
      // height: 200px;
      // background-color: pink;
      border-radius: 8px;
    }

    .no-data {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 8px;
      background-color: #fff;
      border-radius: 8px;
      height: 142px;

      .no-data-text {
        font-size: 14px;
        font-weight: 600;
        color: #333;
      }
    }

    .summary-item {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      width: calc((100% - 45px) / 4);
      border-radius: 8px;
      border: 1px solid #fff;
      background: #fff;
      padding: 16px;
    }

    .summary-item-nosubmit {
      justify-content: center;
      height: 160px;
    }

    .summary-item:hover {
      border: 1px solid #2173f7;
      box-shadow: 0px 0px 4px 4px #DCECFF;
    }

    .submit-status {
      height: 24px;
      line-height: 24px;
      padding: 0 8px;
      border-radius: 4px;
      font-size: 12px;
      transform: scale(0.85);
      margin-top: 2px;
    }

    .has-submit {
      color: #00993f;
      background: #dff6e8;
    }

    .no-submit {
      background: #fff1e0;
      color: #ff7d00;
    }

    .detail-btn {
      width: 88px;
      height: 28px;
      text-align: center;
      border: 1px solid #ccc;
      border-radius: 4px;
      color: #333;
      cursor: pointer;
      font-size: 12px;

      &.detail-btn-toggle {
        .icon-summary {
          display: block;
        }

        .ico-hover {
          display: none;
        }

        &:hover {
          border: 1px solid #2173F7;
          color: #2173F7;

          .icon-summary {
            display: none;
          }

          .ico-hover {
            display: block;
          }
        }
      }

      .ml5 {
        font-size: 12px;
      }
    }

    .edit-btn {
      border: 1px solid #2173F7;
      color: #2173F7;
    }
  }


  .edit-page {
    margin-top: 15px;
  }
}

.box-ava {
  width: 48px;
  height: 48px;
}

.tag-primary {
  transform: scale(0.8);
  font-size: 12px;
  height: 24px;
  line-height: 24px;
  padding: 0 10px;
  color: #00993f;
  background: #dff6e8;
  border-radius: 4px;
  margin-top: 2px;

  &.el-tag--warning {
    color: #ff7d00;
    background: #fff1e0;
  }
}

.box-time {
  font-size: 12px;
  color: #999;

  span {
    font-size: 12px;
    color: #999;
  }
}

.icon-summary {
  width: 14px;
  height: 14px;
}
</style>