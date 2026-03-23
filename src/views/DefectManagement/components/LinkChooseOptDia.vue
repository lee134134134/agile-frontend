<template>
  <el-dialog v-model="diaShow" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" class="edit-dia"
             width="500px" @close="handleClose">
    <template #header="{ close }">
      <div class="dia-header">
        <div class="dia-header-title">
          <div class="title-icon"></div>
          <div class="title-text">选择关联信息</div>
        </div>
        <el-icon class="dia-header-close" size="16px" @click="close">
          <Close/>
        </el-icon>
      </div>
    </template>
    <div class="dia-main">
      <el-form ref="dataFormRef" :model="dataForm" :rules="dataFormRule" class="dia-main-content" label-position="right"
               label-width="140px">
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="请选择关联迭代" prop="sprintId">
              <el-select v-model="dataForm.sprintId" clearable placeholder="请选择" @change="handleChangeSprint">
                <el-option-group v-for="group in props.currentData" :key="group.state" :label="group.state">
                  <el-option v-for="item in group.list" :key="item.code" :label="item.name"
                             :value="item.code"/>
                </el-option-group>
              </el-select>
            </el-form-item>
            <el-form-item label="请选择关联用户故事" prop="storyId">
              <el-select v-model="dataForm.storyId" clearable placeholder="请选择">
                <el-option v-for="item in iterUserStoryList" :key="item.storyId" :label="item.name"
                           :value="item.storyId"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="dia-footer jus-flex-end">
        <div class="opt-btn" @click="handleClose">取消</div>
        <div class="opt-btn" @click="handleSubmit">确认</div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import {onMounted, reactive, ref} from 'vue';
import {Close} from '@element-plus/icons-vue';
import {getIterUserStoryList} from '@/api/api';

const props = defineProps(['isShow', 'defectId', 'currentData']);
const emits = defineEmits(['closeDiaFn', 'confirmFn'])
const diaShow = ref(props.isShow ?? false)
const iterUserStoryList = ref([])

const dataFormRef = ref(null)
const dataForm = reactive({
  sprintId: '',
  storyId: '',
})

const dataFormRule = {
  sprintId: [{required: true, message: '请选择关联迭代', trigger: 'submit'}],
  storyId: [{required: true, message: '请选择关联用户故事', trigger: 'submit'}],
}

const handleSubmit = () => {
  if (dataFormRef.value) {
    dataFormRef.value.validate((valid) => {
      if (valid) {
        emits('confirmFn', dataForm, props.defectId)
      }
    })
  }
}

const handleClose = () => {
  diaShow.value = false
  emits('closeDiaFn')
}


// 获取迭代下的用户故事
const getIterUserStoryListFn = async () => {
  let params = {
    sprintId: dataForm.sprintId || undefined
  }
  await getIterUserStoryList(params).then(res => {
    if (res.success) {
      iterUserStoryList.value = res?.data ?? []
      if (!dataForm.sprintId || !dataForm.storyId) return
      if (!iterUserStoryList.value.some(item => item.storyId == dataForm.storyId)) {
        dataForm.storyId = ''
      }
    }
  })
}

const handleChangeSprint = () => {
  if (dataForm.sprintId) {
    getIterUserStoryListFn()
  } else {
    iterUserStoryList.value = []
  }
}

onMounted(async () => {
  // await getIterUserStoryListFn() // 迭代下的用户故事
})

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

  // .dia-main-content {
  //     margin-bottom: 30px;
  // }

  .dia-footer {
    gap: 12px;

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
</style>