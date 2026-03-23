<template>
  <el-dialog v-model="addShow" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" class="edit-dia"
             width="996px" @close="handleClose">
    <template #header="{ close }">
      <div class="dia-header">
        <div class="dia-header-title">
          <div class="title-icon"></div>
          <div class="title-text">创建迭代会议</div>
        </div>
        <el-icon class="dia-header-close" size="16px" @click="close">
          <Close/>
        </el-icon>
      </div>
    </template>
    <div class="dia-main">
      <el-form ref="detailFormRef" :model="detailForm" :rules="detailRule" class="dia-main-content"
               label-position="right" label-width="100px">
        <!-- <div class="module-title">基本信息</div> -->
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="会议主题" prop="meetingTopic">
              <el-input v-model="detailForm.meetingTopic" clearable maxlength="50" placeholder="请输入" show-word-limit>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="会议类型" prop="meetingType">
              <el-select v-model="detailForm.meetingType" placeholder="请选择">
                <el-option v-for="item in dicStore.iteraMeetingType" :key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="isReviewType" :gutter="24">
          <el-col :span="24">
            <el-form-item label="评审范围" prop="storyCodeList">
              <el-select v-model="detailForm.storyCodeList" clearable filterable multiple placeholder="请选择">
                <template #header>
                  <el-checkbox v-model="checkAllStory" :indeterminate="indeterminateStory"
                               @change="handleCheckAllStory">全部
                  </el-checkbox>
                </template>
                <el-option v-for="item in dicStore.iteraUserStoryList" :key="item.storyId" :label="item.name"
                           :value="item.storyId"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="时间" prop="meetingTime">
              <el-date-picker v-model="detailForm.meetingTime" date-format="YYYY-MM-DD" end-placeholder="结束时间"
                              format="YYYY-MM-DD HH:mm:ss" start-placeholder="开始时间" style="height: 32px; border-radius: 4px;"
                              time-format="HH:mm:ss" type="datetimerange"
                              value-format="YYYY-MM-DD HH:mm:ss"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="地点" prop="meetingPlace">
              <el-input v-model="detailForm.meetingPlace" clearable maxlength="100" placeholder="请输入"
                        show-word-limit>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="参与人" prop="names">
              <el-select v-model="detailForm.names" clearable multiple placeholder="请选择">
                <el-option v-for="item in dicStore.iteraUserList" :key="item.userAccount" :label="item.userName"
                           :value="item.userAccount"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="会议描述" prop="description">
              <el-input v-model="detailForm.description" clearable maxlength="200" placeholder="请输入" show-word-limit
                        type="textarea">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="dia-footer jus-flex-end">
        <div class="btn-cancel" @click="handleClose">取消</div>
        <div class="btn-submit" @click="handleSubmit">保存</div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import {computed, onMounted, reactive, ref, watch} from 'vue';
import {Close} from '@element-plus/icons-vue';
import {useDicStore} from '@/stores/dic.js';

const dicStore = useDicStore()


const props = defineProps(['isShow']);
const emits = defineEmits(['closeDiaFn', 'confirmFn'])
const addShow = ref(props.isShow ?? false)
const isDisabled = ref(props.type == '查看' ? true : false)
const detailFormRef = ref(null)
const detailForm = reactive({
  meetingTopic: '',
  meetingType: dicStore.defaultIteraMeetingType,
  storyCodeList: [],
  startTime: '',
  endTime: '',
  meetingTime: '',
  meetingPlace: '',
  names: '',
  description: '',
})


const detailRule = {
  meetingTopic: [
    {required: true, message: '请输入会议主题', trigger: 'submit'},
    {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'submit'}
  ],
  meetingType: [{required: true, message: '请选择会议类型', trigger: 'submit'}],
  storyCodeList: [{required: true, message: '请选择评审范围', trigger: 'submit'}],
  meetingTime: [{required: true, message: '请选择会议时间', trigger: 'submit'}],
  meetingPlace: [
    {required: true, message: '请输入会议地点', trigger: 'submit'},
    {min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'submit'}
  ],
  names: [{required: true, message: '请选择参与人', trigger: 'submit'}],
}

const checkAllStory = ref(false)
const indeterminateStory = ref(false)


const handleClose = () => {
  addShow.value = false
  emits('closeDiaFn')
}
const handleSubmit = () => {
  if (detailFormRef.value) {
    detailFormRef.value.validate((valid) => {
      if (valid) {
        detailForm.startTime = detailForm.meetingTime[0]
        detailForm.endTime = detailForm.meetingTime[1]
        // delete detailForm.meetingTime
        console.log('detailForm===', detailForm)
        emits('confirmFn', detailForm)
      }
    })
  }
}

const isReviewType = computed(() => {
  let result = false
  dicStore.iteraMeetingType.forEach(item => {
    if (item.value == detailForm.meetingType) {
      result = item.name.includes('评审')
      if (!result) {
        detailForm.storyCodeList = []
      }
    }
  })
  return result
})

// 选择所有故事
const handleCheckAllStory = (val) => {
  if (val) {
    detailForm.storyCodeList = dicStore.iteraUserStoryList.map(item => item.storyId)
  } else {
    detailForm.storyCodeList = []
  }
}

watch(() => detailForm.storyCodeList, (newvalue, oldvalue) => {
  if (newvalue.length == 0) {
    checkAllStory.value = false
    indeterminateStory.value = false
  } else if (newvalue.length == dicStore.iteraUserStoryList.length) {
    checkAllStory.value = true
    indeterminateStory.value = false
  } else {
    indeterminateStory.value = true
  }
}, {deep: true})

onMounted(() => {

})

</script>
<style lang="scss" scoped>

.mt20 {
  margin-top: 20px;
}

.dia-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 15px 10px;

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
      margin-right: 0;
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
    height: 28px;
    border-radius: 4px;
  }

  :deep(.el-textarea) {
    --el-input-border-color: #DBDDE3;
    --el-input-border-radius: 4px;
    --el-input-padding-left: 10px;
    --el-input-padding-right: 10px;

    .el-textarea__inner {
      min-height: 88px !important;
      max-height: 200px !important;
    }
  }

  :deep(.el-form-item__label) {
    color: #555 !important;
    font-weight: 400 !important;
  }
}

.dia-main .dia-main-content {
  margin-bottom: 0;
}
</style>