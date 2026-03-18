<template>
  <div :class="{'status-on-border': configInfo.isEnabled == 1}" class="todoCard-container">
    <div class="todo-header">
      <div class="jus-bet-center">
        <div :class="{'status-on-color': configInfo.isEnabled == 1}" class="header-left jus-start-center">
          <span>{{ configInfo.isEnabled == 1 ? '启用中' : '未启用' }}</span>
        </div>
        <div class="header-right jus-end-center">
          <div class="tag">{{ configInfo.moduleName }}</div>
          <div
              :class="{ 'p0': configInfo.priority == 'P0', 'p1': configInfo.priority == 'P1', 'p2': configInfo.priority == 'P2', 'p3': configInfo.priority == 'P3', 'p4': configInfo.priority == 'P4', 'p5': configInfo.priority == 'P5' }"
              class="tags1">
            {{ configInfo.priority }}
          </div>
        </div>
      </div>
    </div>
    <div class="fields-box">
      <div class="type-name">{{ configInfo.ruleName }}</div>
      <div class="info-item">
        <span class="info-key">标题模板：</span>
        <span class="info-val ellipsis2">{{ configInfo.ruleConfigJson?.reminderTemplate?.title || '-' }}</span>
      </div>
      <div class="info-item ellipsis">
        <span class="info-key">描述模板：</span>
        <span class="info-val">{{ configInfo.ruleConfigJson?.reminderTemplate?.content || '-' }}</span>
      </div>
      <div class="info-item ellipsis">
        <span class="info-key">提醒时间：</span>
        <span class="info-val">{{ configInfo.scheduleConfigJson?.description || '-' }}</span>
      </div>
    </div>
    <div class="card-bottom jus-bet-center">
      <span class="card-text">
          <el-switch v-model="configInfo.isEnabled" :before-change="() => beforeIsEnabledChange()" active-value="1"
                     inactive-value="0" size="small"
                     width="26"></el-switch> {{ configInfo.isEnabled == '1' ? '启用' : '关闭' }}
      </span>
      <div class="jus-end-center gap12">
        <div class="option-btn" @click="handleView('view')">
          <i class="view-btn"></i>
          <span>查看</span>
        </div>
        <div class="option-btn" @click="handleView('edit')">
          <i class="view-btn editor"></i>
          <span>编辑</span>
        </div>
        <div class="option-btn gray" @click="handleDelete">
          <i class="view-btn deleted"></i>
          <span>删除</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {ElMessage} from 'element-plus';
import {enabledByIdStatus} from '@/api/todoConfigApi.js';

const props = defineProps(['configInfo'])
const emits = defineEmits(['viewFn', 'deleteFn'])

const userInfo = ref()
userInfo.value = JSON.parse(localStorage.getItem('agiles_user'))

const handleView = (type) => {
  emits('viewFn', type, props.configInfo)
}

const handleDelete = () => {
  emits('deleteFn', props.configInfo)
}


const beforeIsEnabledChange = () => {
  let params = {
    ...props.configInfo,
    isEnabled: props.configInfo.isEnabled == '0' ? 1 : 0
  }
  return new Promise((resolve, reject) => {
    enabledByIdStatus(params).then(res => {
      let status = res.success
      if (status) {
        if (res.data) {
          ElMessage.info(res.data)
        } else {
          return resolve(status)
        }
      } else {
        ElMessage.error(res.msg)
        return reject(status)
      }
    })
  })
}


</script>

<style lang="scss" scoped>
.todoCard-container {
  min-width: 330px;
  background-color: #FFF;
  padding: 0 16px;
  border-radius: 8px;
  font-family: 'PingFangSC';

  .gap12 {
    gap: 12px;
  }

  .todo-header {
    padding-bottom: 13px;
    margin-top: 13px;
    box-sizing: border-box;
    border-bottom: 1px solid #e2e4e8;

    .header-left {
      gap: 5px;
      color: #999;

      span {
        font-size: 14px;
        font-weight: bold;
      }
    }

    .status-on-color {
      color: #2173F7;
    }

    .header-right {
      gap: 12px;

      .tag {
        padding: 0 7px;
        height: 22px;
        line-height: 22px;
        font-size: 12px;
        color: #10397b;
        background-color: #e4eefe;
        border-radius: 3px;
      }

      .tags1 {
        height: 20px;
        padding: 0;
        border-radius: 2px;
        text-align: center;
        line-height: 20px;
        font-size: 12px;

        &:before {
          display: inline-block;
          position: relative;
          margin-right: 5px;
          vertical-align: 1px;
        }
      }
    }
  }

  .fields-box {
    padding-bottom: 16px;
    margin-top: 16px;
    border-bottom: 1px solid #e2e4e8;

    .type-name {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 12px;
    }
  }

  .fields-box .info-item:last-child {
    margin-bottom: 0;
  }

  .info-item {
    display: flex;
    justify-content: start;
    align-items: start;
    flex-wrap: nowrap;
    margin-bottom: 8px;
    line-height: 20px;

    .info-key {
      color: #666;
      flex-shrink: 0;
    }

    .info-val {
      color: #333;
      font-weight: bold;
    }
  }

  .card-bottom {
    margin-top: 16px;
    margin-bottom: 16px;

    .card-text {
      font-size: 14px;
      color: #666;
    }

    .option-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 3px;
      color: #2173f7;
      cursor: pointer !important;
      box-sizing: border-box;
      width: 68px;
      height: 29px;
      line-height: 29px;
      border: 1px solid #2173f7;
      border-radius: 4px;

      &.gray {
        color: #aaa;
        border: 1px solid #999;
      }
    }

    .option-btn:hover {
      opacity: 0.8;
    }

    .view-btn {
      display: inline-block;
      width: 16px;
      height: 16px;
      background: url(@/assets/webp/btn-view.webp) no-repeat;
      background-size: 100%;
      margin-top: 1px;

      &.editor {
        background: url(@/assets/webp/btn-ed.webp) no-repeat;
        background-size: 100%;
      }

      &.deleted {
        background: url(@/assets/webp/btn-del.webp) no-repeat;
        background-size: 100%;
      }
    }
  }

  .ellipsis {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ellipsis2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>