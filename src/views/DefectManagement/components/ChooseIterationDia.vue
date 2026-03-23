<template>
  <el-dialog v-model="diaShow" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" class="edit-dia"
             width="500px" @close="handleClose">
    <template #header="{ close }">
      <div class="dia-header">
        <div class="dia-header-title">
          <div class="title-icon"></div>
          <div class="title-text">生成缺陷报告</div>
        </div>
        <el-icon class="dia-header-close" size="16px" @click="close">
          <Close/>
        </el-icon>
      </div>
    </template>
    <div class="dia-main">
      <el-form ref="dataFormRef" :model="dataForm" class="dia-main-content">
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="选择迭代" prop="sprintId">
              <el-select v-model="dataForm.sprintId" clearable placeholder="请选择" popper-class="custom-iteration-popper">
                <template v-for="group in props.currentData" :key="group.state">

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
                      :value="item.code"
                      class="iteration-item-option"
                  />
                </template>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="dia-footer jus-flex-end">
        <div class="opt-btn" @click="handleSubmit">查看缺陷报告</div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import {reactive, ref} from 'vue';
import {Close} from '@element-plus/icons-vue';
import {ElMessage} from 'element-plus';
import {useDicStore} from '@/stores/dic.js';

const dicStore = useDicStore()

const props = defineProps(['isShow', 'currentData']);
const emits = defineEmits(['closeDiaFn', 'confirmFn'])
const diaShow = ref(props.isShow ?? false)

const dataFormRef = ref(null)
const dataForm = reactive({
  exeStatus: '',
  testResult: '',
})

const handleSubmit = () => {
  if (dataFormRef.value) {
    dataFormRef.value.validate((valid) => {
      if (valid) {
        if (!dataForm.sprintId) {
          ElMessage.error('请选择迭代')
          return
        }
        emits('confirmFn', dataForm.sprintId)
      }
    })
  }
}

const handleClose = () => {
  diaShow.value = false
  emits('closeDiaFn')
}

// 状态对应的样式类
const getGroupClass = (state) => {
  if (state === '进行中') return 'is-ongoing';
  if (state === '已完成') return 'is-completed';
  return 'is-default';
}
</script>

<style lang="scss" scoped>
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
      font-size: 16px;
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
       margin-bottom: 0;
   }

  .dia-footer {
    .opt-btn{
      padding: 0 12px;
      height: 32px;
      line-height: 32px;
    }

    .btn-cancel {
      margin-left: 12px;
    }
  }

  .module-title {
    width: 100%;
    height: 32px;
    padding-left: 10px;
    box-sizing: border-box;
    line-height: 32px;
    background-color: #EFF7FF;
    font-size: 14px;
    color: #2173F7;
    font-weight: 600;
    margin-bottom: 16px;
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

  :deep(.el-textarea) {
    --el-input-border-color: #DBDDE3;
    --el-input-border-radius: 4px;
    --el-input-padding-left: 10px;
    --el-input-padding-right: 10px;

    .el-textarea__inner {
      height: 88px !important;
    }
  }

  :deep(.el-form-item__label) {
    color: #555 !important;
    font-weight: 400 !important;
  }
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

.status-icon-img{
  width: 14px;
  height: 14px;
}
</style>