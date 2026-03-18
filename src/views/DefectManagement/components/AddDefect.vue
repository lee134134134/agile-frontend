<template>
    <el-dialog v-model="addShow" :show-close="false" width="996px" @close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false" class="edit-dia">
        <template #header="{ close }">
            <div class="dia-header">
                <div class="dia-header-title">
                    <div class="title-icon"></div>
                    <div class="title-text">{{ title }}缺陷</div>
                </div>
                <el-icon class="dia-header-close" size="16px" @click="close">
                    <Close />
                </el-icon>
            </div>
        </template>
        <div class="dia-main">
            <el-form ref="detailFormRef" :model="detailForm" :rules="type == '查看' ? null : detailRule" class="dia-main-content"
                label-width="130px" label-position="right">
                <div class="module-title">基本信息</div>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="缺陷标题" prop="defectTitle">
                            <el-input v-model="detailForm.defectTitle" placeholder="请输入" maxlength="50" clearable :disabled="isDisabled" show-word-limit>
                                <!-- <template #suffix>
                                  最多50字符
                                </template> -->
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="所属项目" prop="projectId">
                            <el-select v-model="detailForm.projectId" placeholder="请选择" clearable :disabled="isDisabled" @change="handleChangeProject">
                                <el-option v-for="item in dicStore.curUserProjectList" :key="item.projectId" :label="item.name" :value="item.projectId" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属迭代" prop="sprintId">
                            <el-select v-model="detailForm.sprintId" placeholder="请选择" clearable style="width: 100%;" @change="handleChangeSprint" :disabled="isDisabled">
                                    <el-option-group v-for="group in curUserProjectIterationList" :key="group.state" :label="group.state">
                                        <el-option v-for="item in group.list" :key="item.code" :label="item.name"
                                            :value="item.code" />
                                    </el-option-group>
                                </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="用户故事" prop="storyId">
                            <el-select v-model="detailForm.storyId" placeholder="请选择" clearable :disabled="isDisabled">
                                <el-option v-for="item in iterUserStoryList" :key="item.storyId" :label="item.name" :value="item.storyId" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="缺陷描述" prop="defectDesc">
                            
                            <div style="border: 1px solid #ccc">
                                <Toolbar
                                    style="border-bottom: 1px solid #ccc"
                                    :editor="editorRef"
                                    :defaultConfig="toolbarConfig"
                                    :mode="mode"
                                    :disabled="isDisabled"
                                />
                                <Editor
                                    style="height: 400px; overflow-y: hidden;"
                                    v-model="detailForm.defectDesc"
                                    :defaultConfig="editorConfig"
                                    :mode="mode"
                                    @onCreated="handleCreated"
                                    @customPaste="customPaste"
                                    @onBlur="handleBlur"
                                    :disabled="isDisabled"
                                    :style="{cursor: isDisabled ? 'default' : 'pointer'}"
                                />
                            </div>

                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item v-show="!(isDisabled && detailForm.fileInfo == 0)" label="上传附件" prop="fileInfo" class="attach-form-item">
                            
                            <el-upload
                                v-show="!isDisabled"
                                :show-file-list="false"
                                :auto-upload="false"
                                action="#"
                                multiple
                                :before-upload="beforeFileUpload"
                                @change="uploadFileChange"
                                :disabled="isDisabled"
                                >
                                <div class="opt-btn" :class="{'opt-btn-disabled': isDisabled}">上传附件</div>
                            </el-upload>
                            <!-- 上传的附件列表 -->
                            <div class="fileList-area">
                                <div class="file-item" v-for="item in detailForm.fileInfo" :key="item.fileName">
                                    <img class="doc-icon" src="../../../assets/images/docIcon.png" alt="">
                                    <div class="doc-name">
                                        <div class="name">{{ item.originName }}</div>
                                        <div class="fileSize" v-if="item.size">{{ (Number(item.size) / 1024 / 1024).toFixed(2) }}M</div>
                                    </div>
                                    <div v-if="!isDisabled" class="delete-box jus-bet-center" :class="{'delete-box-disabled': isDisabled}" @click="delAttachment(item.id)">
                                        <el-icon><DeleteFilled /></el-icon>
                                        删除
                                    </div>
                                    <div v-else class="delete-box jus-bet-center" @click="handleDownloadAttach(item)">
                                        <el-icon><Download /></el-icon>
                                        下载
                                    </div>
                                </div>
                            </div>

                        </el-form-item>
                    </el-col>
                </el-row>

                <div class="module-title mt20">详细信息</div>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="优先级" prop="defectPriority">
                            <el-select v-model="detailForm.defectPriority" placeholder="请选择" clearable :disabled="isDisabled">
                              <el-option v-for="item in dicStore.priorityList" :key="item.value" :label="item.name" :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="缺陷类型" prop="defectType">
                            <el-select v-model="detailForm.defectType" placeholder="请选择" clearable :disabled="isDisabled">
                              <el-option v-for="item in dicStore.defectTypeList" :key="item.value" :label="item.name" :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="严重程度" prop="severity">
                            <el-select v-model="detailForm.severity" placeholder="请选择" clearable :disabled="isDisabled">
                              <el-option v-for="item in dicStore.severityList" :key="item.value" :label="item.name" :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="是否为线上缺陷" prop="isOnline">
                            <el-radio-group v-model="detailForm.isOnline" :disabled="isDisabled">
                                <el-radio :label="1">是</el-radio>
                                <el-radio :label="0">否</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="缺陷环境" prop="environment">
                            <el-select v-model="detailForm.environment" placeholder="请选择" clearable :disabled="isDisabled">
                              <el-option v-for="item in dicStore.defectEnvList" :key="item.value" :label="item.name" :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="处理人" prop="headlerAccount">
                            <el-select v-model="detailForm.headlerAccount" placeholder="请选择" clearable :disabled="isDisabled">
                                <el-option v-for="item in dicStore.allUserList" :key="item.username" :label="item.nickname" :value="item.username" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="负责人" prop="leaderAccount">
                            <el-select v-model="detailForm.leaderAccount" placeholder="请选择" clearable :disabled="isDisabled">
                                <el-option v-for="item in dicStore.allUserList" :key="item.username" :label="item.nickname" :value="item.username" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="缺陷状态" prop="defectStatus">
                            <el-select v-model="detailForm.defectStatus" placeholder="请选择" clearable :disabled="isDisabled">
                              <el-option v-for="item in dicStore.defectStatusList" :key="item.value" :label="item.name" :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="处理结果" prop="result">
                            <el-select v-model="detailForm.result" placeholder="请选择" clearable :disabled="isDisabled">
                              <el-option v-for="item in dicStore.handleResultList" :key="item.value" :label="item.name" :value="item.value" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="开发团队" prop="teamName">
                            <el-input v-model="detailForm.teamName" placeholder="请输入" maxlength="20" clearable :disabled="isDisabled" show-word-limit>
                                <!-- <template #suffix>
                                  最多20字符
                                </template> -->
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <div v-if="type != '新增' && detailForm.relationList && detailForm.relationList.length > 0" class="module-title mt20">已关联信息</div>
                <div v-if="type != '新增' && detailForm.relationList && detailForm.relationList.length > 0" class="link-item jus-bet-start" v-for="(item, index) in detailForm.relationList" :key="index">
                    <div style="margin-top: 6px;">
                        <el-icon size="16"><Link /></el-icon>
                    </div>
                    <div class="link-item-info">
                        <div class="link-info-main">
                            <div class="link-sprint-story">{{ item.sprintName || '-' }} - {{ item.storyName || '-' }}</div>
                            <div class="link-title" @click="viewLinkDefect(item.defectId)">{{ item.defectTitle }}</div>
                        </div>
                        <!-- <div class="">解除关联</div> -->
                        <el-button type="text" class="btn-text-primary text-btn" :class="{ 'disabled-btn': type == '查看' || item.defectStatus == 'suspend' }"
                            :disabled="type == '查看' || item.defectStatus == 'suspend'" @click="handleUnbindFn(item.defectId)">解除关联</el-button>
                    </div>
                </div>

            </el-form>
            <div class="dia-footer jus-flex-end" v-if="!isDisabled">
                <div class="btn-cancel" @click="handleClose">取消</div>
              <div class="btn-submit" @click="handleSubmit" >保存</div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, onBeforeUnmount, onMounted, shallowRef } from 'vue';
import { Close } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { useDicStore } from '@/stores/dic.js';
import { getUserProjectIterationList, getIterUserStoryList } from '@/api/api';
import { uploadAttach, cancelRelate, downloadSingleAttach } from '@/api/defectApi';

const dicStore = useDicStore()

const props = defineProps(['isShow', 'type', 'detailInfo', 'userInfo']);
const emits = defineEmits([
    'closeDiaFn',
    'confirmFn',
    'editConfirmFn',
    'viewLinkDefectFn',
    'cancelRelateFn'
])
const addShow = ref(props.isShow ?? false)
const title = ref(props.type || '新增')
const isDisabled = ref(props.type == '查看' ? true : false)

const curUserProjectIterationList = ref([])
const iterUserStoryList = ref([])

const detailFormRef = ref(null)
const detailForm = reactive({
    defectTitle: '',
	projectId:'',
    sprintId: '',
    storyId: '',
    defectDesc: '', // 缺陷描述
    fileInfo: [], // 文件上传
    fileIds: [],
    defectPriority: dicStore.defaultPriority,
    defectType: '', // 缺陷类型
    severity: dicStore.defaultSeverity, // 严重程度
    isOnline: '', // 是否为线上缺陷
    environment: dicStore.defaultDefectEnv, // 缺陷环境
    headlerAccount: '', // 处理人
    leaderAccount: '', // 负责人
    defectStatus: dicStore.defaultDefectStatus, // 缺陷状态
    result: dicStore.defaultHandleResult, // 处理结果 
    teamName: '', // 开发团队
    relationList: '', // 关联信息
})
const statusList = ref([])
const assoUserOptions = ref([])
const otherRemainUserOptions = ref([])
otherRemainUserOptions.value = props.userOptions
const canDateEdit = ref(false) // 迭代周期字段是否可修改

const checkValue = (rule, value, callback) => {
    if (!value || value == '<p><br></p>') {
        return callback(new Error('请输入缺陷描述'))
    } else {
        return callback()
    }
}

const detailRule = {
    defectTitle: [
        { required: true, message: '请输入缺陷标题', trigger: 'submit' },
        { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'submit' }
    ],
    projectId: [{ required: true, message: '请选择所属项目', trigger: 'submit' }],
    defectDesc: [{ required: true, validator: checkValue, trigger: 'submit' }],
    defectPriority: [{ required: true, message: '请选择优先级', trigger: 'submit' }],
    defectType: [{ required: true, message: '请选择缺陷类型', trigger: 'submit' }],
    severity: [{ required: true, message: '请选择严重程度', trigger: 'submit' }],
    defectStatus: [{ required: true, message: '请选择缺陷状态', trigger: 'submit' }],
}

watch(() => detailForm.members, (newName) => {
    assoUserOptions.value = props.userOptions.filter(itemA => 
      newName.some(itemB => itemB.userAccount === itemA.username)
    )
    let flag1 = assoUserOptions.value.some(item => item.username == detailForm.productOwnerAccount)
    let flag2 = assoUserOptions.value.some(item => item.username == detailForm.scrumMasterAccount)
    if(!flag1) {
      detailForm.productOwnerAccount = ''
    }
    if(!flag2) {
      detailForm.scrumMasterAccount = ''
    }

},{deep: true});
watch(() => props.type, (newName) => {
    title.value = newName
});

watch(() => props.detailInfo,(newVal) => {
    detailForm.relationList = newVal.relationList
}, {deep: true})

watch(() => props.statusList, (newName) => {
    statusList.value = newName
    // detailForm.state = props.defaultStatus ?? ''
}, { immediate: true })
const handleClose = () => {
    addShow.value = false
    emits('closeDiaFn')
}
const handleSubmit = () => {
    if (detailFormRef.value) {
        detailFormRef.value.validate((valid) => {
            if (valid) {
            //   console.log('detailForm===', detailForm)
            //   return
              if (props.type == '新增') {
                  emits('confirmFn', detailForm)
              } else {
                  detailForm.defectId = props.detailInfo.defectId
                  emits('editConfirmFn', detailForm)
              }
            }
        })
    }
}

// 解除关联
const handleUnbindFn = (id) => {
    ElMessageBox.confirm(
        '确认解除关联吗?',
        '',
        {
            cancelButtonText: '取消',
            confirmButtonText: '确认',
            type: 'warning',
        }
    ).then(() => {
        let params = {
            sourceId: props.detailInfo.defectId,
            relationId: id,
        }
        emits('cancelRelateFn', params)
    })
}

// 查看关联缺陷详情
const viewLinkDefect = (id) => {
    emits('viewLinkDefectFn', id)
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
    console.log('失去焦点==', detailForm.defectDesc)
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


// 校验文件
function beforeFileUpload(file) {
    if(file.name.slice(-4) !== '.doc' && file.name.slice(-5) !== '.docx' 
        && file.name.slice(-5) !== '.xlsx' && file.name.slice(-4) !== '.xls' 
        && file.name.slice(-4) !== '.pdf') {
        ElMessage.error("暂不支持该格式的文件上传!")
        return false
    }
    if (file.size > 1024 * 1024 * 20) {
        ElMessage.error("文件大小不能超过20MB！")
        return
    }
    return true
}

 // 上传附件
 function uploadFileChange(file) {
    console.log('file===',file)
    let isValid = beforeFileUpload(file)
    if(!isValid) return
    let obj = new FormData()
    let newfile = file.raw
    newfile = new File([file.raw], `${encodeURIComponent(newfile.name)}`, { type: file.raw.type })
    newfile.uid = file.raw.uid
    obj.append("file",newfile);
    // obj.append('type','A04')


    uploadAttach(obj).then(res => {
        // console.log('上传文件返回参数：',res)
        if(res.success) {
            detailForm.fileInfo.push(res.data)
            detailForm.fileIds.push(res.data.id)
        }
    })
 }

// 删除附件
function delAttachment(id) {
    if(isDisabled.value) return
    ElMessageBox.confirm(
        '确认删除该附件吗?',
        '',
        {
            cancelButtonText: '取消',
            confirmButtonText: '确认',
            type: 'warning',
        }
    ).then(() => {
        detailForm.fileInfo = detailForm.fileInfo.filter(item => item.id != id)
        detailForm.fileIds = detailForm.fileIds.filter(item => item != id)
    })
}

// 下载单个附件
const handleDownloadAttach = (row) => {
    let params = {
        commentId: row.id,
    }
    downloadSingleAttach(params).then(res => {
        const blob = new Blob([res]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = row.originName; // 根据实际情况设置下载文件名
        a.click();
        window.URL.revokeObjectURL(url);
    }).catch(err => {
        ElMessage.err(err)
    })
}

// 获取项目下的迭代
const getProjectIterationListFn = async () => {
    let params = {
        projectId: detailForm.projectId || undefined
    }
    await getUserProjectIterationList(params).then(res => {
        if(res.success) {
            curUserProjectIterationList.value = res?.data ?? []
            // if(!curUserProjectIterationList.value.some(item => item.code == detailForm.sprintId)) {
            //     detailForm.sprintId = ''
            // }
            
            let flag = false
            curUserProjectIterationList.value.forEach(ele => {
                ele.list.forEach(item => {
                    if(item.code == detailForm.sprintId) {
                        flag = true
                    }
                })
            })
            if(!flag) {
                detailForm.sprintId = ''
            }
        }
    })
}

// 获取迭代下的用户故事
const getIterUserStoryListFn = async () => {
    let params = {
        sprintId: detailForm.sprintId || undefined
    }
    await getIterUserStoryList(params).then(res => {
        if(res.success) {
            iterUserStoryList.value = res?.data ?? []
            if(!iterUserStoryList.value.some(item => item.storyId == detailForm.storyId)) {
                detailForm.storyId = ''
            }
        }
    })
}


// 所属项目 -->  迭代  
watch(() => detailForm.projectId, async (newvalue, oldvalue) => {
    await getProjectIterationListFn()
}, { deep: true})

// 所属迭代 -->  用户故事  
watch(() => detailForm.sprintId, async (newvalue, oldvalue) => {
    await getIterUserStoryListFn()
}, { deep: true})

const handleChangeProject = () => {
    // getProjectIterationListFn()
}

const handleChangeSprint = () => {
    // getIterUserStoryListFn()
}


onMounted(async () => {
    await getProjectIterationListFn() // 项目下的迭代
    await getIterUserStoryListFn() // 迭代下的用户故事
    if (props.type == '编辑' || props.type == '查看') {
        detailForm.defectTitle = props.detailInfo.defectTitle
        detailForm.projectId = props.detailInfo.projectId
        detailForm.sprintId = props.detailInfo.sprintId
        detailForm.storyId = props.detailInfo.storyId
        detailForm.defectDesc = props.detailInfo.defectDesc
        detailForm.fileInfo = props.detailInfo.fileInfo
        props.detailInfo.fileInfo.forEach(item => {
            detailForm.fileIds.push(item.id)
        })
        detailForm.defectPriority = props.detailInfo.defectPriority || dicStore.defaultPriority
        detailForm.defectType = props.detailInfo.defectType
        detailForm.severity = props.detailInfo.severity || dicStore.defaultSeverity
        detailForm.isOnline = props.detailInfo.isOnline
        detailForm.environment = props.detailInfo.environment || dicStore.defaultDefectEnv
        detailForm.headlerAccount = props.detailInfo.headlerAccount
        detailForm.leaderAccount = props.detailInfo.leaderAccount
        detailForm.defectStatus = props.detailInfo.defectStatus || dicStore.defaultDefectStatus
        detailForm.result = props.detailInfo.result || dicStore.defaultHandleResult
        detailForm.teamName = props.detailInfo.teamName
        detailForm.relationList = props.detailInfo.relationList
        console.log('detailForm==', detailForm)
    }else {
        detailForm.projectId = localStorage.getItem('global_ProjectCode')
        detailForm.leaderAccount = props.userInfo.name
    }

})

</script>
<style lang="scss" scoped>

.mt20 {
    margin-top: 20px;
}
.opt-btn-disabled {
    background-color: #ececec;
    cursor: default;
    color: #A4A4A4;

}
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
    //     height: calc(90vh - 200px);
    //     overflow-y: scroll;
    //     margin-bottom: 30px;
    //     padding-right: 20px;
    // }

    .dia-footer {
        .btn-cancel {
            margin-right: 12px;
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

    .link-item {
        gap: 8px;
        .link-item-info {
            display: flex;
            justify-content: space-between;
            align-items: end;
            flex-grow: 1;
            margin-bottom: 12px;

            .link-info-main {
                line-height: 30px;
            }
            .link-title {
                text-decoration: underline;
                color: var(--el-color-primary);
                cursor: pointer;
            }
            .link-title:hover {
                opacity: 0.8;
            }
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
            height: 88px !important;
        }
    }

    :deep(.el-form-item__label) {
        color: #555 !important;
        font-weight: 400 !important;
    }
}

.fileList-area {
    width: 100%;
    // max-width: 400px;
    margin-top: 10px;
    .file-item {
        display: flex;
        align-items: center;
        padding: 10px;
        border-radius: 4px 4px 4px 4px;
        border: 1px solid #CFE4FE;
        margin-bottom: 10px;
        .doc-icon {
            width: 40px;
            height: 40px;
        }
        .doc-name {
            width: calc(100% - 100px);
            display: flex;
            flex-direction: column;
            justify-content: start;
            align-items: start;
            font-size: 14px;
            line-height: 22px;
            margin-left: 10px;
            .name {
                margin-bottom: 5px;
            }
            .fileSize {
                color: #6C6C6C;
                font-size: 12px;
            }
            .demo-progress {
                width: 200px;
            }
        }
        .delete-box {
            gap: 3px;
            color: #2173F7;
            font-size: 12px;
            cursor: pointer;
        }
        .delete-box-disabled {
            color: #A4A4A4;
            font-size: 12px;
            cursor: default;
        }
    }
}
.attach-form-item {
    :deep(.el-form-item__content) {
        flex-direction: column!important;
        align-items: start;
    }
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