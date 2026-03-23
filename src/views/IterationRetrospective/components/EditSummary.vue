<template>
  <div class="dia-main">
    <div class="summary-list-content">
      <div class="header-title jus-bet-center">
        <div class="title-1 title-2 jus-bet-center">{{ detailForm.nickName }}-{{ sprintName }}-迭代总结</div>
        <div class="flex" v-if="isDisabled">
          <div v-show="detailForm.userName == userInfo.name" style="margin-right: 12px" class="btn-submit" @click="handleEditSummary">编辑总结</div>
          <div v-if="isDisabled" class="btn-submit" @click="handleClose">关闭</div>
        </div>
      </div>
      <div :style="{height: type == '查看' ? 'calc(100vh - 155px)' : 'calc(100vh - 300px)'}" class="inner-content">
        <section class="inner-section">
          <template v-if="isDisabled">
            <div class="jus-bet-center info-line">
              <div class="info-item"><span class="info-label">创建人：</span>{{ detailForm.nickName }}</div>
              <div class="info-item"><span class="info-label">创建时间：</span>{{ detailForm.createTime }}</div>
              <div class="info-item"><span class="info-label">最后更新时间：</span>{{ detailForm.updateTime }}</div>
            </div>

            <div class="info-line fix-line jus-bet-center">
              <div class="info-label info-summary">迭代总结内容：</div>
            </div>
          </template>
          <el-form ref="detailFormRef" :model="detailForm" :rules="detailRule" class="dia-main-content" :class="{'fix-dia-main-content': !isDisabled}"
                   label-position="left" label-width="0px">
            <el-row :gutter="24">
              <el-col :span="24">
                <el-form-item label="" prop="summary">
                  <div class="dia-main-editor">
                    <Toolbar
                        v-if="!isDisabled"
                        :defaultConfig="toolbarConfig"
                        :editor="editorRef"
                        style="border-bottom: 1px solid #ccc"
                    />
                    <Editor
                        v-model="detailForm.summary"
                        :defaultConfig="editorConfig"
                        :disabled="isDisabled"
                        :style="{cursor: isDisabled ? 'default' : 'pointer',
                                                    height: !isDisabled ? 'calc(100vh - 510px)' : type == '评论' ? 'calc((100vh - 510px)/2)' : '',
                                                    minHeight: type == '评论' ? '250' : '50px'}"
                        style="width: 100%; overflow-y: hidden;"
                        @customPaste="customPaste"
                        @onBlur="handleBlur"
                        @onCreated="handleCreated"
                    />
                    <!-- :mode="mode" -->
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </section>

        <div v-if="isDisabled" class="info-line fix-line jus-bet-center">
          <div class="info-label info-summary">迭代评论：</div>
        </div>
        <el-form v-if="isDisabled" ref="commentFormRef" :model="commentForm" :rules="commentRule"
                 class="dia-main-content"
                 label-position="left" label-width="0px">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="" prop="comment">
                <div style="border: 1px solid #ccc;width: 100%;">
                  <Toolbar
                      v-if="type == '评论'"
                      :defaultConfig="toolbarConfig"
                      :editor="editorRefComment"
                      style="border-bottom: 1px solid #ccc"
                  />
                  <Editor
                      v-model="commentForm.comment"
                      :defaultConfig="editorConfigComment"
                      :disabled="type !== '评论'"
                      :style="{cursor: type !== '评论' ? 'default' : 'pointer',
                                                    height: type == '评论' ? 'calc((100vh - 510px)/2)' : '',
                                                    minHeight: type=='评论' ? '250px' : '50px' }"
                      style="width: 100%; overflow-y: hidden;"
                      @customPaste="customPasteComment"
                      @onBlur="handleBlurComment"
                      @onCreated="handleCreatedComment"
                  />
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="dia-footer jus-center">
      <div v-if="!isDisabled" class="btn-cancel" @click="handleClose">取消</div>
      <div v-if="!isDisabled" class="btn-submit" @click="handleSubmit">确认</div>
      <div v-if="type == '评论'" class="btn-submit" @click="handleSaveComment">保存评论</div>
    </div>
  </div>
</template>

<script setup>
import {onBeforeMount, onBeforeUnmount, reactive, ref, shallowRef, watch} from 'vue';
import {useDicStore} from '@/stores/dic.js';
import {moduleText} from '@/utils/reviewModule.js';
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'

const dicStore = useDicStore()
const props = defineProps(['optionType', 'isShow', 'detailInfo', 'startDate', 'endDate', 'sprintName']);
const emits = defineEmits([
  'closeDiaFn',
  'confirmFn',
  'editConfirmFn',
  'editOwnSummary',
  'saveCommentFn'
])
const userInfo = ref()
userInfo.value = JSON.parse(localStorage.getItem('agiles_user'))
const addShow = ref(props.isShow ?? false)
const title = ref('')
const isDisabled = ref(false)
const type = ref('')
const detailFormRef = ref(null)
const detailForm = reactive({
  summary: ''
})
const commentFormRef = ref(null)
const commentForm = reactive({
  comment: ''
})

const checkValue = (rule, value, callback) => {
  if (!value || value == '<p><br></p>') {
    return callback(new Error('请输入迭代总结'))
  } else {
    return callback()
  }
}

const checkCommentValue = (rule, value, callback) => {
  if (!value || value == '<p><br></p>') {
    return callback(new Error('请输入评论'))
  } else {
    return callback()
  }
}

const detailRule = {
  summary: [
    {required: true, validator: checkValue, trigger: 'blur'},
  ],
}
const commentRule = {
  comment: [
    // { required: true, validator: checkCommentValue, trigger: 'blur' },
  ],
}

watch(() => props.optionType, (newVal) => {
  title.value = newVal
  type.value = newVal
  isDisabled.value = (newVal == '查看' || newVal == '评论') ? true : false
}, {immediate: true});

const handleClose = () => {
  addShow.value = false
  emits('closeDiaFn')
}
const handleSubmit = () => {
  if (detailFormRef.value) {
    detailFormRef.value.validate((valid) => {
      if (valid) {
        if (props.optionType == '创建') {
          emits('confirmFn', detailForm)
          return
        }
        if (props.optionType == '编辑') {
          detailForm.summaryId = props.detailInfo.summaryId
          emits('confirmFn', detailForm)
        }
      }
    })
  }
}

// 保存评论
const handleSaveComment = () => {
  if (commentFormRef.value) {
    commentFormRef.value.validate((valid) => {
      if (valid) {
        commentForm.commentId = props.detailInfo.commentId || undefined
        emits('saveCommentFn', commentForm, props.detailInfo.summaryId)
        return
      }
    })
  }
}


const handleEditSummary = () => {
  emits('editOwnSummary')
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
  const editorComment = editorRefComment.value
  if (editor != null) {
    editor.destroy()
  }
  if (editorComment != null) {
    editorComment.destroy()
  }

})

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}


// 编辑器实例，必须用 shallowRef
const editorRefComment = shallowRef()

const editorConfigComment = {
  placeholder: type.value == '查看' ? '' : '请输入内容...',
  readOnly: type.value == '查看' ? true : false,
  MENU_CONF: {
    server: '/api/api/upload',
    fieldName: 'custom-field-name',
  },
}

// 修改后的 customPaste 函数，只允许粘贴图片
const customPasteComment = (editor, event, callback) => {
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

const handleBlurComment = () => {
  // console.log('失去焦点==', detailForm.summary)
}

const handleCreatedComment = (editor) => {
  editorRefComment.value = editor // 记录 editor 实例，重要！
}


onBeforeMount(async () => {
  if (type.value != '创建') {
    detailForm.summary = props.detailInfo.summary
    detailForm.nickName = props.detailInfo.nickName
    detailForm.userName = props.detailInfo.userName
    detailForm.createTime = props.detailInfo.createTime
    detailForm.updateTime = props.detailInfo.updateTime
    commentForm.comment = props.detailInfo.comment
  } else {
    if (type.value == '创建' || props.detailInfo.summary == '' || props.detailInfo.summary == '<p><br></p>') {
      let text = moduleText
      text = text.replaceAll('<p>迭代周期：开始时间 至 结束时间</p>', `<p>迭代周期：${props.startDate} 至 ${props.endDate}</p>`)
      // console.log('text===', text)
      detailForm.summary = text
      detailForm.nickName = userInfo.value.nickname
    }
  }
})

</script>
<style lang="scss" scoped>
.dia-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 15px;


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
  padding-bottom: 10px;

  .summary-list-content {
    margin-top: 15px;
    border-radius: 8px;
    overflow: hidden;

    .header-title {
      padding-right: 15px;
    }

    .title-1 {
      margin: 20px 0;

    }

    .title-2 {
      margin: 0;
      padding: 15px;
      font-size: 16px;
    }

    .inner-content {
      padding: 12px 16px;
      overflow: auto;

      .info-line {
        padding-bottom: 12px;
        border-bottom: 1px solid #e2e4e8;

        &.fix-line{
          border-bottom: 0;
        }
      }

      .info-item {
        width: 50%;
        font-size: 12px;
      }

      .info-label {
        font-size: 12px;
        color: #999;
      }
    }
  }

  .dia-footer {
    padding: 12px 0;
    width: 100%;
    background: #f6f8fc;

    .btn-cancel {
      margin-right: 12px;
    }
  }

  .info-text {
    font-family: 'PingFangSC';
    color: #000;
    font-size: 10px;
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
      min-height: 88px !important;
      max-height: 200px !important;
    }
  }

  :deep(.el-form-item__label) {
    color: #555 !important;
    font-weight: 400 !important;
  }

  .no-rquired {
    :deep(.el-form-item__label) {
      padding-left: 12px !important;
    }
  }
}

.inner-section{
  background: #fff;
  padding: 12px 16px;
  border-radius: 8px;
}

.info-summary{
  font-size: 14px !important;
  font-weight: bold;
  color: #333 !important;
  margin-top: 12px;
}

.btn-submit{
  border-radius: 4px;
}
</style>