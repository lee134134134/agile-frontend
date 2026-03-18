<template>
  <el-dialog v-model="addShow" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" class="edit-dia"
             width="996px" @close="handleClose">
    <template #header="{ close }">
      <div class="dia-header">
        <div class="dia-header-title">
          <div class="title-icon"></div>
          <div class="title-text">{{ title }}迭代会议</div>
        </div>
        <el-icon class="dia-header-close" size="16px" @click="close">
          <Close/>
        </el-icon>
      </div>
    </template>
    <div class="dia-main">
      <el-form ref="detailFormRef" :model="detailForm" :rules="detailRule" class="dia-main-content"
               label-position="right" label-width="100px">
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="会议主题" prop="meetingTopic">
              <el-input v-model="detailForm.meetingTopic" :disabled="isDisabled" clearable maxlength="50" placeholder="请输入"
                        show-word-limit>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="会议类型" prop="meetingType">
              <el-select v-model="detailForm.meetingType" :disabled="isDisabled || props.detailInfo.meetingStatus == 'completed'"
                         placeholder="请选择">
                <el-option v-for="item in dicStore.iteraMeetingType" :key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="isReviewType" :gutter="24">
          <el-col :span="24">
            <el-form-item label="评审范围" prop="storyCodeList">
              <el-select v-if="type == '编辑'" v-model="detailForm.storyCodeList" :disabled="isDisabled || props.detailInfo.meetingStatus == 'completed'" clearable
                         filterable multiple placeholder="请选择">
                <template #header>
                  <el-checkbox v-model="checkAllStory" :indeterminate="indeterminateStory"
                               @change="handleCheckAllStory">全部
                  </el-checkbox>
                </template>
                <el-option v-for="item in dicStore.iteraUserStoryList" :key="item.storyId" :label="item.name"
                           :value="item.storyId"/>
              </el-select>
              <div v-else class="storyList">
                <div v-for="item in detailForm.storyCodeList" :key="item.code" class="storyItem">{{ item }}</div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="时间" prop="meetingTime">
              <el-date-picker v-model="detailForm.meetingTime" :disabled="isDisabled" date-format="YYYY-MM-DD"
                              end-placeholder="结束时间" format="YYYY-MM-DD HH:mm:ss" start-placeholder="开始时间"
                              style="height: 32px; border-radius: 4px;" time-format="HH:mm:ss" type="datetimerange"
                              value-format="YYYY-MM-DD HH:mm:ss"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="地点" prop="meetingPlace">
              <el-input v-model="detailForm.meetingPlace" :disabled="isDisabled" clearable maxlength="100" placeholder="请输入"
                        show-word-limit>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="参与人" prop="names">
              <el-select v-model="detailForm.names" :disabled="isDisabled" clearable multiple placeholder="请选择">
                <el-option v-for="item in dicStore.iteraUserList" :key="item.userAccount" :label="item.userName"
                           :value="item.userAccount"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="会议描述" prop="description">
              <el-input v-model="detailForm.description" :disabled="isDisabled" clearable maxlength="200" placeholder="请输入"
                        show-word-limit type="textarea">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="会议纪要" prop="summary">
              <div style="border: 1px solid #ccc">
                <Toolbar
                    :defaultConfig="toolbarConfig"
                    :disabled="isDisabled"
                    :editor="editorRef"
                    style="border-bottom: 1px solid #ccc"
                />
                <Editor
                    v-model="detailForm.summary"
                    :defaultConfig="editorConfig"
                    :disabled="isDisabled"
                    :style="{cursor: isDisabled ? 'default' : 'pointer'}"
                    style="height: 400px; overflow-y: hidden;"
                    @customPaste="customPaste"
                    @onBlur="handleBlur"
                    @onCreated="handleCreated"
                />
              </div>

            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="会议状态" prop="meetingStatus">
              <el-select v-model="detailForm.meetingStatus" :disabled="isDisabled || props.detailInfo.meetingStatus == 'completed'" clearable
                         placeholder="请选择">
                <el-option v-for="item in dicStore.iteraMeetingStatus" :key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>


      </el-form>
      <div v-if="!isDisabled" class="dia-footer jus-flex-end">
        <div class="btn-cancel" @click="handleClose">取消</div>
        <div class="btn-submit" @click="handleSubmit">保存</div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import {computed, onBeforeUnmount, onMounted, reactive, ref, shallowRef, watch} from 'vue';
import {Close} from '@element-plus/icons-vue';
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import {useDicStore} from '@/stores/dic.js';

const dicStore = useDicStore()


const props = defineProps(['isShow', 'type', 'detailInfo']);
const emits = defineEmits(['closeDiaFn', 'confirmFn'])
const addShow = ref(props.isShow ?? false)
const title = ref(props.type || '编辑')
const isDisabled = ref(props.type == '查看' ? true : false)
const detailFormRef = ref(null)
const detailForm = reactive({
  meetingTopic: '',
  meetingType: '',
  storyCodeList: [],
  startTime: '',
  endTime: '',
  meetingTime: '',
  meetingPlace: '',
  names: '',
  description: '',
  summary: '',
  meetingStatus: '',
})

const checkValue = (rule, value, callback) => {
  if (!value || value == '<p><br></p>') {
    return callback(new Error('请输入会议纪要'))
  } else {
    return callback()
  }
}

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
  summary: [
    {required: true, validator: checkValue, trigger: 'submit'},
  ],
  meetingStatus: [{required: true, message: '请选择会议状态', trigger: 'submit'}],
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
        detailForm.sprintId = props.detailInfo.sprintId
        detailForm.id = props.detailInfo.id
        // console.log('detailForm===', detailForm)
        emits('confirmFn', detailForm)
      }
    })
  }
}


// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('<p>hello</p>')

const toolbarConfig = {}
const editorConfig = {
  placeholder: '请输入内容...',
  readOnly: isDisabled.value ? true : false,
  MENU_CONF: {
    server: '/api/api/upload',
    fieldName: 'custom-field-name',
  },
}

// 修改后的 customPaste 函数，只允许粘贴图片
const customPaste = (editor, event, callback) => {
  // console.log("ClipboardEvent 粘贴事件对象", event);

  // if (hasImageInContent(editor)) {
  //     ElMessage({
  //     message: '编辑器中已存在图片,不允许再粘贴图片',
  //     type: 'success',
  //     })
  //     callback(false)
  //     return
  // }

  // 获取剪贴板数据
  const clipboardData = event.clipboardData;
  let hasImage = false;

  // 检查是否有文件（图片）
  if (clipboardData.files && clipboardData.files.length > 0) {
    const file = clipboardData.files[0];

    // 检查文件类型是否为图片
    if (file.type.startsWith("image/")) {
      // console.log("检测到图片粘贴", file);
      hasImage = true;

      // 使用 wangEditor 的 API 插入图片
      const reader = new FileReader();
      reader.onload = e => {
        const imageSrc = e.target.result;

        // 使用命令插入图片
        editor.dangerouslyInsertHtml(
            `<img src="${imageSrc}" alt="粘贴的图片" style="max-width: 100%;" />`
        );
      };
      reader.readAsDataURL(file);

      // 阻止默认粘贴行为
      callback(false);
      return;
    }
  }

  // 检查是否有 HTML 内容，尝试从中提取图片
  if (clipboardData.types.includes("text/html")) {
    const html = clipboardData.getData("text/html");
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const images = doc.querySelectorAll("img");

    if (images.length > 0) {
      // console.log("检测到HTML中的图片", images);
      hasImage = true;

      // 插入所有图片
      let imagesHtml = "";
      images.forEach(img => {
        imagesHtml += `<img src="${img.src}" alt="${img.alt || "粘贴的图片"
        }" style="max-width: 100%; margin: 10px 0;" />`;
      });

      editor.dangerouslyInsertHtml(imagesHtml);

      // 阻止默认粘贴行为
      callback(false);
      return;
    }
  }

  // 检查是否有纯文本内容，如果是图片URL也允许粘贴
  if (clipboardData.types.includes("text/plain")) {
    const text = clipboardData.getData("text/plain").trim();
    // 简单的URL检测
    if (text.match(/\.(jpg|jpeg|png|gif|bmp|webp)(\?.*)?$/i)) {
      // console.log("检测到图片URL", text);
      hasImage = true;

      editor.dangerouslyInsertHtml(
          `<img src="${text}" alt="粘贴的图片" style="max-width: 100%;" />`
      );

      callback(false);
      return;
    }
  }

  // 如果没有检测到图片，显示提示并阻止粘贴
//   if (!hasImage) {
//     ElMessage({
//       message: '只允许粘贴图片内容！',
//       type: 'success',
//     })
//     callback(false);
//   }
};

const handleBlur = () => {
  // console.log('失去焦点==', detailForm.summary)
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}


watch(() => props.type, (newName) => {
  title.value = newName
});

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
  if (!newvalue) return
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
  if (props.type == '编辑' || props.type == '查看') {
    detailForm.meetingTopic = props.detailInfo.meetingTopic
    detailForm.meetingType = props.detailInfo.meetingType
    // 评审范围
    props.detailInfo.storyInfoList.forEach(item => {
      if (props.type == '编辑') {
        detailForm.storyCodeList.push(item.code)
      } else {
        detailForm.storyCodeList.push(item.name)
      }
    })

    detailForm.meetingTime = [props.detailInfo.startTime, props.detailInfo.endTime]
    detailForm.meetingPlace = props.detailInfo.meetingPlace
    let arr = []
    props.detailInfo.participants.forEach(item => {
      arr.push(item.code)
    })
    detailForm.names = arr
    detailForm.description = props.detailInfo.description
    detailForm.summary = props.detailInfo.summary
    detailForm.meetingStatus = props.detailInfo.meetingStatus || dicStore.defaultIteraMeetingStatus
  }
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
      font-size: 18px;
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
  //     max-height: calc(90vh - 200px);
  //     overflow-y: scroll;
  //     margin-bottom: 30px;
  //     padding-right: 20px;
  // }

  .storyList {
    width: 100%;
    max-height: 300px;
    overflow-y: auto;
  }

  .storyItem {
    width: 100%;
    height: 30px;
    line-height: 30px;
    padding: 0 10px 10px;
    font-size: 12px;

    &:last-child{
      padding-bottom: 0;
    }
  }

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

  // :deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper) {
  //     height: 32px!important;
  // }
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
</style>