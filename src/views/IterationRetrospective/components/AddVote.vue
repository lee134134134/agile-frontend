<template>
  <el-dialog v-model="addShow" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" class="edit-dia"
             width="1000px" @close="handleClose">
    <template #header="{ close }">
      <div class="dia-header">
        <div class="dia-header-title">
          <div class="title-icon"></div>
          <div class="title-text">{{ title }}迭代意见</div>
        </div>
        <el-icon class="dia-header-close" size="16px" @click="close">
          <Close/>
        </el-icon>
      </div>
    </template>
    <div v-if="type !== '查看'" class="dia-main">
      <el-form ref="detailFormRef" :model="detailForm" :rules="detailRule" class="dia-main-content"
               label-position="right" label-width="80px">
        <el-row :gutter="24">
          <el-col :span="16">
            <el-form-item label="意见标题" prop="title">
              <el-input v-model="detailForm.title" :disabled="isDisabled" clearable maxlength="50"
                        placeholder="请输入意见标题"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="意见类型" prop="opinionType">
              <el-select v-model="detailForm.opinionType" :disabled="isDisabled" clearable placeholder="请选择意见类型">
                <el-option v-for="item in dicStore.prosConsList" :key="item.value" :label="item.name"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="意见内容" prop="content">
              <el-input v-model="detailForm.content" :disabled="isDisabled" clearable maxlength="1000"
                        placeholder="请输入意见内容" show-word-limit type="textarea"/>
            </el-form-item>

          </el-col>
        </el-row>
      </el-form>
      <div class="dia-footer jus-flex-end">
        <div class="btn-cancel" @click="handleClose">取消</div>
        <div class="btn-submit" @click="handleSubmit">确认</div>
      </div>
    </div>

    <div v-else class="dia-main">
      <div class="vote-title">{{ detailInfo.title }}</div>
      <div class="jus-start-center gap12">
        <div class="tag tag-sprint">{{ detailInfo.sprintName }}</div>
        <div :class="{'bg-red': detailInfo.opinionType == 'cons', 'bg-green': detailInfo.opinionType == 'pros',}"
             class="progress-tag tag-type">
          {{ detailInfo.opinionTypeName }}
        </div>
        <div>提交于 {{ detailInfo.createTime }}</div>
      </div>
      <div class="content-title">意见内容</div>
      <div class="content-value">{{ detailInfo.content }}</div>
      <div class="content-title jus-start-center">
        解决方案
        <div v-if="detailInfo.estimatedTime" style="margin-left: 30px;">
          预计完成时间：{{ detailInfo.estimatedTime }}
        </div>
      </div>
      <!-- <div class="content-value">{{ detailInfo.solutionText }}</div> -->
      <div style="border: 1px solid #ccc;border-radius:8px;padding: 8px;width: 100%;">

        <Editor
            v-model="detailInfo.solutionText"
            :defaultConfig="editorConfig"
            :disabled="isDisabled"
            :mode="mode"
            style="width: 100%; max-height: 500px; overflow-y: hidden;cursor: default;"
            @customPaste="customPaste"
            @onBlur="handleBlur"
            @onCreated="handleCreated"
        />

      </div>
      <div class="jus-start-center status-line">
        <div><span>状态：</span>{{ detailInfo.statusName }}</div>
        <div><span>负责人：</span>{{ detailInfo.personInCharge }}</div>
      </div>

      <div class="dia-footer jus-bet-center">
        <div class="btn-cancel jus-center detail-btn like-btn" @click="handleChangeVote">
          <img v-if="isVote == '1'" alt="" class="input-icon" src="@/assets/webp/summary-like.webp">
          <img v-else alt="" class="input-icon" src="@/assets/webp/summary-like.webp">
          <span class="ml5">{{ votes }}</span>
        </div>
        <div class="btn-cancel" @click="handleClose">关闭</div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import {onBeforeMount, onBeforeUnmount, reactive, ref, shallowRef, watch} from 'vue';
import {Close} from '@element-plus/icons-vue';
import {useDicStore} from '@/stores/dic.js';
import {handleVote} from '@/api/iterationReviewApi.js';
import {Editor} from '@wangeditor/editor-for-vue'

const dicStore = useDicStore()
const props = defineProps(['type', 'isShow', 'detailInfo', 'operateVoteFn']);
const emits = defineEmits([
  'closeDiaFn',
  'confirmFn',
  'editConfirmFn'])
const addShow = ref(props.isShow ?? false)
const title = ref(props.type || '提交')
const isDisabled = ref(props.type == '查看')
const detailFormRef = ref(null)
const detailForm = reactive({
  title: '',
  opinionType: '',
  content: '',

})
const isVote = ref('')
const votes = ref(0)
isVote.value = props.detailInfo?.isVote || ''
votes.value = props.detailInfo?.votes || 0

const detailRule = {
  title: [
    {required: true, message: '请输入意见标题', trigger: 'submit'},
    {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'submit'}
  ],
  opinionType: [{required: true, message: '请选择意见类型', trigger: 'submit'}],
  content: [
    {required: true, message: '请输入意见内容', trigger: 'submit'},
    {min: 1, max: 1000, message: '长度在 1 到 1000 个字符', trigger: 'submit'}
  ],

}


const handleClose = () => {
  addShow.value = false
  emits('closeDiaFn')
}
const handleSubmit = () => {
  if (detailFormRef.value) {
    detailFormRef.value.validate((valid) => {
      if (valid) {
        // addShow.value = false
        if (props.type == '提交') {
          emits('confirmFn', detailForm)
        } else {
          detailForm.opfbId = props.detailInfo.opfbId
          emits('confirmFn', detailForm)
        }
      }
    })
  }
}

// 点赞
const handleChangeVote = () => {
  // 调用投票接口
  let params = {
    sprintId: props.detailInfo.sprintId,
    opfbId: props.detailInfo.opfbId,
  }
  handleVote(params).then((res) => {
    if (res.success) {
      if (isVote.value == '1') {
        isVote.value = '2'
        votes.value = votes.value - 1
      } else {
        isVote.value = '1'
        votes.value = votes.value + 1
      }
    }
  })
}

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('<p>hello</p>')

const toolbarConfig = {}
const editorConfig = {
  placeholder: '',
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


watch(() => props.type, (newName) => {
  title.value = newName
});


onBeforeMount(async () => {
  if (props.type == '编辑' || props.type == '查看') {
    detailForm.title = props.detailInfo.title
    detailForm.opinionType = props.detailInfo.opinionType
    detailForm.content = props.detailInfo.content
  }
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
  //     margin-bottom: 30px;
  // }

  .dia-footer {
    .btn-cancel {
      margin-right: 12px;
    }
  }

  .vote-title {
    font-size: 20px;
    font-weight: 600;
    color: #1D1D1D;
    margin-bottom: 10px;
  }

  .content-title {
    font-size: 16px;
    font-weight: 600;
    color: #1D1D1D;
    margin: 20px 0 10px;
  }

  .content-value {
    padding: 15px;
    border: 1px solid #ccc;
    border-radius: 8px;
    min-height: 100px;
    max-height: 200px;
    overflow: auto;
  }

  .status-line {
    margin: 20px 0 40px;
    gap: 50px;

    div {
      font-size: 16px;

      span {
        font-size: 16px;
        font-weight: 600;
      }
    }
  }

  .detail-btn {
    padding: 3px 15px;
    border: 1px solid #2173F7;
    border-radius: 4px;
    color: #2173F7;
    cursor: pointer;
  }

  .detail-btn:hover {
    opacity: 0.8;
  }

  .input-icon {
    width: 14px;
    height: 14px;
  }

  .ml5 {
    margin-left: 5px;
  }

  .gap12 {
    gap: 12px;
  }

  .tag {
    padding: 2px 10px;
    // background-color: pink;
    color: #FFF;
    border-radius: 4px;
  }

  .tag-sprint {
    background-color: #2173F7;
  }

  .tag-type {
    padding: 0 5px;
  }

  .ellipsis1 {
    width: 100%;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
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
}
</style>