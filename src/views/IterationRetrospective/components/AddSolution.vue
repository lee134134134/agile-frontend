<template>
    <el-dialog v-model="addShow" :show-close="false" width="1000px" @close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false" class="edit-dia">
        <template #header="{ close }">
            <div class="dia-header">
                <div class="dia-header-title">
                    <div class="title-icon"></div>
                    <div class="title-text">{{ title }}解决方案</div>
                </div>
                <el-icon class="dia-header-close" size="16px" @click="close">
                    <Close />
                </el-icon>
            </div>
        </template>
        <div class="dia-main">
            <el-form ref="detailFormRef" :model="detailForm" :rules="detailRule" class="dia-main-content"
                label-width="110px" label-position="right">
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="解决方案描述" prop="solutionText">
                            <!-- <el-input v-model="detailForm.solutionText" placeholder="请输入解决方案描述" maxlength="1000" type="textarea" clearable show-word-limit :disabled="isDisabled" /> -->

                            <div style="border: 1px solid #ccc;width: 100%;">
                                <Toolbar
                                    style="border-bottom: 1px solid #ccc"
                                    :editor="editorRef"
                                    :defaultConfig="toolbarConfig"
                                />
                                <Editor
                                    style="width: 100%; height: 280px; overflow-y: hidden;"
                                    v-model="detailForm.solutionText"
                                    :defaultConfig="editorConfig"
                                    :mode="mode"
                                    @onCreated="handleCreated"
                                    @customPaste="customPaste"
                                    @onBlur="handleBlur"
                                    :disabled="isDisabled"
                                />
                            </div>

                        </el-form-item>

                    </el-col>
                </el-row>
                
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="负责人" prop="personInCharge">
                            <el-select v-model="detailForm.personInCharge" placeholder="请选择负责人" clearable :disabled="isDisabled">
                                <el-option v-for="item in dicStore.allUserList" :key="item.username" :label="item.nickname"
                                        :value="item.username" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="预计完成时间" prop="estimatedTime">
                            <el-date-picker v-model="detailForm.estimatedTime" placeholder="请选择预计完成时间" value-format="YYYY-MM-DD" format="YYYY-MM-DD"
                            clearable style="height:32px;border-radius: 4px;width:100%;" :disabled="isDisabled" />
                        </el-form-item>
                    </el-col>
                </el-row>
                
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="进度状态" prop="status">
                            <el-select v-model="detailForm.status" placeholder="请选择进度状态" clearable :disabled="isDisabled">
                                <el-option v-for="item in dicStore.progressList" :key="item.value" :label="item.name"
                                        :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="dia-footer jus-flex-end">
                <div class="btn-cancel" @click="handleClose">取消</div>
                <div class="btn-submit" @click="handleSubmit">确认</div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, onBeforeMount, onBeforeUnmount, shallowRef } from 'vue';
import { Close } from '@element-plus/icons-vue';
import { isValidEChar } from "@/utils/index.js";
import { useDicStore } from '@/stores/dic.js';
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { ElMessage } from 'element-plus';

const dicStore = useDicStore()
const props = defineProps(['type', 'isShow', 'detailInfo']);
const emits = defineEmits([
    'closeDiaFn',
    'confirmFn',
    'editConfirmFn'])
const addShow = ref(props.isShow ?? false)
const title = ref(props.type || '添加')
const isDisabled = ref(props.type == '查看')
const detailFormRef = ref(null)
const detailForm = reactive({
    solutionText: '',
    personInCharge: '',
    estimatedTime: '',
    status: '',
    
})

const checkValue = (rule, value, callback) => {
    if (!value || value == '<p><br></p>') {
        return callback(new Error('请输入解决方案描述'))
    } else {
        return callback()
    }
}

const detailRule = {
    solutionText: [
        { required: true, validator: checkValue, trigger: 'submit' },
        // { min: 1, max: 1000, message: '长度在 1 到 1000 个字符', trigger: 'submit' }
    ],
    personInCharge: [{ required: true, message: '请选择负责人', trigger: 'submit' }],
    estimatedTime: [{ required: true, message: '请选择预计完成时间', trigger: 'submit' }],
    status: [{ required: true, message: '请选择进度状态', trigger: 'submit' }],

}

watch(() => props.type, (newName) => {
    title.value = newName
});


const handleClose = () => {
    addShow.value = false
    emits('closeDiaFn')
}
const handleSubmit = () => {
    if (detailFormRef.value) {
        detailFormRef.value.validate((valid) => {
            if (valid) {
                detailForm.opfbId = props.detailInfo.opfbId
                if (props.type == '添加') {
                    emits('confirmFn', detailForm)
                } else {
                    detailForm.solutionId = props.detailInfo.solutionId
                    emits('confirmFn', detailForm)
                }
            }
        })
    }
}

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('<p>hello</p>')

const toolbarConfig = {
    toolbarKeys: [
        "headerSelect",
        "bold",
        {
            key: 'group-more-style',
            title: '样式',
            menuKeys: ["italic", "underline", "through", "clearStyle"]
        },
        "color",
        "bgColor",
        "fontSize",
        "fontFamily",
        {
            key: 'group-more-style',
            title: '缩进',
            menuKeys: ["indent", "delIndent"]
        },
        {
            key: 'group-more-style',
            title: '对齐方式',
            menuKeys: ["justifyLeft", "justifyRight", "justifyCenter"]
        },
        "lineHeight",
        "redo",
        "undo",
    ]
}

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
            // editor.dangerouslyInsertHtml(
            // `<img src="${imageSrc}" alt="粘贴的图片" style="max-width: 100%;" />`
            // );
            ElMessage.error('不允许插入图片')
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


onBeforeMount(async () => {
    if (props.type == '编辑' || props.type == '查看') {
        detailForm.solutionText = props.detailInfo.solutionText
        detailForm.personInCharge = props.detailInfo.personInCharge
        detailForm.estimatedTime = props.detailInfo.estimatedTime
        detailForm.status = props.detailInfo.status
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
        .btn-cancel {
            margin-right: 12px;
        }
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