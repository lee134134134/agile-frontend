<template>
  <div class="vote-card-container">
    <div class="jus-bet-center">
      <div class="vote-left">
        <div class="jus-bet-center vote-left-title">
          <div class="ellipsis1 vote-title">{{ voteInfo.title }}</div>
          <div class="jus-end-center header-right-box">
            <div class="tag tag-sprint ellipsis1">{{ voteInfo.sprintName }}</div>
            <div :class="{'bg-red': voteInfo.opinionType == 'cons', 'bg-green': voteInfo.opinionType == 'pros',}"
                 class="progress-tag tag-type">
              {{ voteInfo.opinionTypeName ?? '-' }}
            </div>
          </div>
        </div>
        <div class="vote-content ellipsis2">{{ voteInfo.content }}</div>

        <div class="jus-bet-center">
          <div class="vote-time">提交于 {{ voteInfo.createTime }}</div>
          <div class="jus-end-center gap12">
            <div class="jus-center detail-btn" @click="handleView()">
              <el-icon>
                <img class="detail-btn-icon" src="@/assets/webp/summary-view.webp" alt="">
              </el-icon>
              <div class="ml5">查看详情</div>
            </div>
            <div class="jus-center detail-btn" @click="handleEdit()">
              <el-icon>
                <img class="detail-btn-icon" src="@/assets/webp/edit.webp" alt="">
              </el-icon>
              <div class="ml5">编辑</div>
            </div>
            <div class="jus-center detail-btn like-btn" @click="handleChangeVote">
              <img v-if="isVote == '1'" alt="" class="detail-btn-icon" src="@/assets/webp/summary-like-hover.webp">
              <img v-else alt="" class="detail-btn-icon" src="@/assets/webp/summary-like-hover.webp">
              <span class="ml5">{{ votes }}</span>
            </div>
          </div>
        </div>


      </div>

      <div class="vote-right">
        <div v-if="!voteInfo.solutionId" class="no-solution jus-center">
          <div>无解决方案</div>
          <div class="jus-center detail-btn detail-btn-full" @click="handleAddSolution">
            <el-icon>
              <Plus/>
            </el-icon>
            <div class="ml5">添加解决方案</div>
          </div>
        </div>
        <div v-else>
          <div class="jus-bet-center">
            <div :class="{'status-black': voteInfo.status == 'not_started', 'status-blue': voteInfo.status == 'in_progress', 'status-green': voteInfo.status == 'done'}"
                 class="project-tag">
              {{ voteInfo.statusName ?? '-'}}
            </div>
            <div class="jus-center detail-btn" @click="handleEditSolution">
              <el-icon>
                <img class="detail-btn-icon" src="@/assets/webp/summary-view.webp" alt="">
              </el-icon>
              <div class="ml5">编辑</div>
            </div>
          </div>
          <div class="solution ellipsis2" v-html="voteInfo.solutionText"></div>
          <div class="jus-bet-center">
            <div class="solution-text">负责人：{{ voteInfo.personInCharge ?? '-' }}</div>
            <div class="solution-text">预计完成：{{ voteInfo.estimatedTime ?? '-' }}</div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import {ref, watch} from 'vue'

const props = defineProps(['voteInfo']);
const emits = defineEmits(['openAddVote', 'openAddSolution', 'openAddSolutionDiaEdit', 'operateVoteFn'])
const isVote = ref('')
const votes = ref('')

// const solutionText = ref('<h1>一、我参与迭代完成情况</h1><h3>项目名称示例一</h3>')
const solutionText = ref('一、我参与迭代完成情况<h3>项目名称示例一项目名称示例一项目名称示例一项目名称示例一项目名称示例一项目名称示例一</h3>')


const handleEdit = () => {
  emits('openAddVote', 'edit', props.voteInfo)
}
const handleView = () => {
  emits('openAddVote', 'view', props.voteInfo)
}
const handleAddSolution = () => {
  emits('openAddSolution', props.voteInfo)
}
const handleEditSolution = () => {
  emits('openAddSolutionDiaEdit', props.voteInfo)
}

// 点赞
const handleChangeVote = () => {
  emits('operateVoteFn', props.voteInfo)
}

watch(() => props.voteInfo, (nval) => {
  console.log('意见信息更新！！')
  isVote.value = props.voteInfo.isVote
  votes.value = props.voteInfo.votes
}, {immediate: true, deep: true})

</script>

<style lang="scss" scoped>
.vote-card-container {
  width: 100%;
  padding: 24px 0 0;

  .tag {
    padding: 2px 10px;
    // background-color: pink;
    color: #FFF;
    border-radius: 4px;
  }

  .tag-sprint {
    max-width: 220px;
    color: #2173f7;
    height: 22px;
    line-height: 16px;
    background: #fff;
    box-sizing: border-box;
    border: 1px solid #2173f7;
    font-size: 12px;
  }

  .tag-type {
    width: 44px;
    line-height: 18px;
    flex-shrink: 0;
    text-align: center;
    font-size: 12px;
    color: #ff5b02;
    border-image: linear-gradient(270deg, rgba(255, 224, 206, 1), rgba(255, 191, 165, 0)) 1 1;
    box-sizing: border-box;
    border: 1px solid #fff4e7;

    &.bg-green{
      background: #ebf6ff;
      border: 1px solid #b8d5ff;
      color: #2173f7;
    }
  }

  .gap12 {
    gap: 12px;
  }

  .mt10 {
    margin-top: 10px;
  }

  .ml5 {
    margin-left: 5px;
  }

  .detail-btn {
    padding: 0 15px;
    height: 28px;
    line-height: 28px;
    border: 1px solid #2173F7;
    border-radius: 4px;
    font-size: 12px;
    color: #2173F7;
    cursor: pointer;

    &.like-btn{
      background: #2173F7;
      color: #fff;
    }
  }

  .detail-btn:hover {
    opacity: 0.8;
  }

  // .like-btn:hover {
  //     background-color: #2173F7;
  //     color: #FFF;
  // }

  .vote-content {
    height: 56px;
  }

  .vote-left {
    width: calc(100% - 470px);
    position: relative;

    &:after{
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: -20px;
      border-bottom: 1px solid #e2e4e8;
    }

    .vote-left-title{
      margin-top: -20px;
    }

    .vote-title {
      width: calc(100% - 300px);
      font-size: 14px;
      color: #333;
      font-weight: bold;
    }

    .header-right-box {
      max-width: 290px;
      flex-shrink: 0;
      flex-grow: 0;
      gap: 5px;
    }

    .vote-content {
      color: #666;
      height: 48px;
      font-size: 14px;
      margin: 8px 0 16px;
    }

    .input-icon {
      width: 20px;
    }

  }

  .vote-right {
    width: 450px;
    height: 150px;
    border-radius: 8px;
    background: #fafafa;
    padding: 16px;
    box-sizing: border-box;

    .no-solution {
      height: 100%;
      flex-direction: column;
      gap: 10px;

      & > div{
        font-size: 14px;
        color: #666;
      }
    }

    .solution {
      height: 48px;
      margin: 10px 0 15px;
      font-size: 14px;
      color: #666;
    }
  }

  .ellipsis1 {
    width: 100%;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ellipsis2 {
    width: 100%;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.vote-time{
  font-size: 12px;
  color: #999;
}

.detail-btn-icon{
  width: 14px;
  height: 14px;
}

.detail-btn-full{
  color: #fff !important;
  background: #2173f7;
}

.status-black{
  background: #86909c;
  color: #fff;
  font-size: 12px;
}

.solution-text{
  font-size: 12px;
  color: #999;
}
</style>