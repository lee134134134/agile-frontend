<template>
    <el-dialog v-model="addShow" :show-close="false" width="90vw" top="1vh" @close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false">
        <template #header="{ close }">
            <div class="dia-header">
                <div class="dia-header-title">
                    <div class="title-icon"></div>
                    <div class="title-text">自动化测试用例</div>
                </div>
                <el-icon class="dia-header-close" size="16px" @click="handleClose">
                    <Close />
                </el-icon>
            </div>
        </template>
        <div class="dia-main-auto">
            <div class="dia-main-content" :style="{height: isShowChecked ? 'calc(98vh - 480px)' : 'calc(98vh - 150px)' }">
                <div class="left-panel" :style="{ width: leftWidth + 'px' }">
                    <div class="editor-area">
                        <CodeMirrorEditor :defaultEditorText="defaultEditorText" :insertEditorText="insertEditorText" ref="editorRef"/>
                    </div>
                    <div class="editor-btn-box jus-end-center">
                        <div class="jus-start-center check-editor" 
                            :style="{color: hasRefresh ? '#2173F7' : ''}"  
                            @mouseenter="hasRefresh = true"
                            @mouseleave="!isActiveRefresh ? hasRefresh = false :  hasRefresh = true" 
                            @click="handleRefresh"
                        >
                            <img :src="!hasRefresh ? '/refresh-auto.png' : '/refresh-auto-active.png'" alt="" >
                            刷新
                        </div>

                        <div class="jus-start-center check-editor" 
                            :class="{'dis-not-allowed': isOccupied}"
                            :style="{color: hasChecked ? '#2173F7' : ''}"  
                            @mouseenter="!isOccupied ? (hasChecked = true) : null" 
                            @mouseleave="!isOccupied ? (!hasClickCheck ? hasChecked = false :  hasChecked = true) : null" 
                            @click="handleCheckCase"
                        >
                            <img :src="!hasChecked ? '/check.png' : '/check-active.png'" alt="" >
                            检查
                        </div>

                        <div class="jus-start-center check-editor" 
                            :class="{'dis-not-allowed': isOccupied}"
                            :style="{color: isFormat ? '#2173F7' : ''}"
                            @mouseenter="!isOccupied ? (isFormat = true) : null" 
                            @mouseleave="!isOccupied ? (!hasClickFormat ? isFormat = false :  isFormat = true) : null" @click="handleFormatCase"
                        >
                            <img :src="!isFormat ? '/format.png' : '/format-active.png'" alt="" >
                            格式化
                        </div>
                        
                        <div v-show="isShowRevoke" 
                            class="jus-start-center check-editor" 
                            :style="{color: isActiveRevoke ? '#2173F7' : ''}" 
                            @mouseenter="isActiveRevoke = !isActiveRevoke" 
                            @mouseleave="isActiveRevoke = !isActiveRevoke"
                            @click="handleRevoke"
                        >
                            <img :src="!isActiveRevoke ? '/revoke.png' : '/revoke-active.png'" alt="" >
                            撤销
                        </div>
                    </div>
                </div>
                <div class="resizer" @mousedown="startResize"></div>
                <div class="right-panel">
                    <ConfigListPage @optInsert="handleInsertContent" />
                </div>
            </div>
            <div v-if="isShowChecked" class="check-result-box">
                <div class="check-box-close jus-bet-center">
                    <div class="jus-start-center gap8">
                        <div class="result-tab" :class="{'result-tab-active': resultTab == 1}" @click="handleChangeResultTab(1)">检查</div>
                        <div class="result-tab" :class="{'result-tab-active': resultTab == 2}" @click="handleChangeResultTab(2)">格式化</div>
                    </div>
                    <el-icon size="16" @click="handleCloseCheck"><Close /></el-icon>
                </div>
                <div v-show="resultTab == 1 && checkResultText" class="check-box check-box-check">
                    <pre>{{ checkResultText }}</pre>
                </div>
                <div v-show="resultTab == 2 && formatChangeFlag" class="check-box check-box-format jus-bet-center gap8">
                    <div class="check-left">
                        <div class="check-title">格式化代码</div>
                        <div class="result-box result-box-left">
                            <div class="check-left-main">
                                <!-- <pre>{{ formatAfterCode }}</pre> -->
                                <CodeMirrorResult :defaultEditorText="formatAfterCode" editorId="formatAfter"/>
                            </div>
                        </div>
                        <div class="btn-box jus-end-center">
                            <div class="btn-cancel" @click="cancelFormatResult">取消</div>
                            <div class="btn-submit" @click="useFormatResult">应用</div>
                        </div>
                    </div>
                    <div class="middle-line"></div>
                    <div class="check-right">
                        <div class="check-title">差异分析</div>
                        <div class="result-box check-right-main">
                            <!-- <pre>{{ formatOutput }}</pre> -->
                            <CodeMirrorResult :defaultEditorText="formatOutput" editorId="formatCompare" />
                        </div>
                    </div>
                </div>
                <div v-show="(resultTab == 2 && !formatChangeFlag) || (resultTab == 1 && !checkResultText)" class="check-box">
                    <EmptyDia type="zwsj" />
                </div>
            </div>
            <div class="dia-footer jus-center" v-if="type !== '查看'">
                <div class="btn-cancel" @click="handleClose">取消</div>
              <div class="btn-submit" :class="{'dis-btn-submit': isOccupied}" @click="handleSubmit">保存</div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from 'vue';
import { Close } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getDicList } from '@/api/api';
import { getOccupiedInfo, checkAutoCase, getCheckAutoCaseResult, formatAutoCase, revertAutoCase } from '@/api/testCaseApi';
import CodeMirrorEditor from './CodeMirrorEditor.vue'
import CodeMirrorResult from './CodeMirrorResult.vue'
import ConfigListPage from './ConfigListPage.vue'
import EmptyDia from '@/components/EmptyDia.vue'

const props = defineProps(['isShow', 'type', 'detailInfo']);
const emits = defineEmits([ 'closeDiaFn', 'confirmFn', 'refreshFn']);
const addShow = ref(props.isShow ?? false)


const hasClickCheck = ref(false) // 是否点击，用于鼠标移开不改样式
const hasRefresh = ref(false) // 用于控制刷新按钮样式
const isActiveRefresh = ref(false)

const hasChecked = ref(false)  // 用于控制检查按钮样式
const isShowChecked = ref(false) // 是否展示检查结果区域
const hasClickFormat = ref(false) // 是否点击，用于鼠标移开不改样式
const isFormat = ref(false)
const isShowRevoke = ref(false)
const isActiveRevoke = ref(false)
// const defaultEditorText = ref("AAMS-QYLYLB-FUNC-004\n# 步骤：\n# 1、进入权益类组合一览表页面\n# 预期结果：\n# 1、为多选下拉框，可进行全选/反选\n# 2、提示语为“请选择险种”灰色字体\n    JS Click By Selector    ${ZBJ_SELECT}\n    Click Element   ${QT_SELECT}\n    ${当前险种选中个数}    JS Get Text By Selector    ${XZ_NUMBER}\n    Should Be Equal    ${当前险种选中个数}    + 27\n    JS Click By Selector    ${ZY_SELECT}\n    JS Click By Selector    ${CT_SELECT}\n    JS Click By Selector    ${CJZ_SELECT}\n    JS Click By Selector    ${FH_SELECT}\n    JS Click By Selector    ${XWN_SELECT}\n    JS Click By Selector    ${LWN_SELECT}\n    JS Click By Selector    ${ZBJ_SELECT}\n    JS Click By Selector    ${QT_SELECT}\n    ${提示语文本}    JS Get Text By Selector    ${XZ_SELECT_TIP}\n    ${提示语颜色}    JS Get Attribute By Selector    ${XZ_SELECT_TIP}    class\n    Should Be Equal    ${提示语文本}    请选择险种\n    Should Contain    ${提示语颜色}    is-transparent")
const defaultEditorText = ref('')
const insertEditorText = ref('')
const editorRef = ref(null)
const editorResultRef = ref(null)
const isOccupied = ref(false)
let timerCheck = ref()
let timerFormat = ref()
const checkTaskId = ref('')
const formatTaskId = ref('')
const checkResultText = ref('')
const resultTab = ref() // 结果区域tab
const formatChangeFlag = ref(false)
const formatAfterCode = ref('') // 格式化后的结果
const formatOutput = ref('') // 格式化对比结果

const leftWidth = ref(window.innerWidth * 0.8 - 400)
let startX = 0
let isResizing = ref(false)

const startResize = (e) => {
  isResizing.value = true
  startX = e.clientX
  document.addEventListener('mousemove', resize)
  document.addEventListener('mouseup', stopResize)
}

const resize = (e) => {
  if (!isResizing.value) return
  const diff = e.clientX - startX
  leftWidth.value = Math.max(500, Math.min(leftWidth.value + diff, window.innerWidth * 0.8 - 400)) // 限制宽度范围
  startX = e.clientX
}

const stopResize = () => {
  isResizing.value = false
  document.removeEventListener('mousemove', resize)
  document.removeEventListener('mouseup', stopResize)
}

onUnmounted(() => {
  document.removeEventListener('mousemove', resize)
  document.removeEventListener('mouseup', stopResize)
})

// 刷新
const handleRefresh = () => {
    emits('refreshFn', props.detailInfo)
    editorRef.value.handleRefreshEditor() // 编辑器内容刷新
}

// 判断是否被占用
const getOccupiedInfoFn = async() => {
    await getOccupiedInfo(props.detailInfo.id).then(res => {
        if(res.success) {
            if(res.data.occupancyFlag) {
                isOccupied.value = true
            }else {
                isOccupied.value = false
            }
        }
    })
}

// 检查
const handleCheckCase = async() => {
    await getOccupiedInfoFn()
    if(isOccupied.value) return // 被占用， 不可点击
    // 点击了，用于鼠标移开不改样式
    hasClickCheck.value = true
    hasChecked.value = true

    // 调用检查接口，返回id, 查检查结果
    let params = {
        autoCaseId: props.detailInfo.id,
        content: editorRef.value.getEditorValue(),
    }
    checkAutoCase(params).then(res => {
        if(res.success) { 
            // 如果之前有定时器，先清除
            if(timerCheck) {
                clearInterval(timerCheck)
            }
            checkTaskId.value = res.data
            timerCheck = setInterval(() => {
                getCheckResultFn()
            }, 3000)
        }
    })
}

// 获取检查结果
const getCheckResultFn = () => {
    // 调用获取检查结果接口
    let params = {
        taskType: 'check',
        taskId: checkTaskId.value,
    }
    getCheckAutoCaseResult(params).then(res => {
        if(res.success) {
            if(res.data.checkStatus == 'success') {
                // 如获取到，关闭定时器
                clearInterval(timerCheck)
                ElMessage.success('检查成功')
                checkResultText.value = res.data.checkResult
                isShowChecked.value = true
                resultTab.value = 1
                hasChecked.value = false
            }else if(res.data.checkStatus == 'error') {
                ElMessage.error('检查失败')
            }
        }
        hasClickCheck.value = false
    })
}

const handleCloseCheck = () => {
    isShowChecked.value = false
}

// 格式化
const handleFormatCase = async() => {
    await getOccupiedInfoFn()
    if(isOccupied.value) return // 被占用， 不可点击
    // 点击了，用于鼠标移开不改样式
    hasClickFormat.value = true
    isFormat.value = true
    // 调用格式化接口，返回id, 查格式化结果
    let params = {
        autoCaseId: props.detailInfo.id,
        formatOriginalCode: editorRef.value.getEditorValue(),
    }
    formatAutoCase(params).then(res => {
        if(res.success) {
            formatTaskId.value = res.data
            timerFormat = setInterval(() => {
                getFormatResultFn()
            }, 3000)
        }
    })
}

// 获取格式化结果
const getFormatResultFn = () => {
    // 调用获取格式化结果接口
    let params = {
        taskType: 'format',
        taskId: formatTaskId.value,
    }
    getCheckAutoCaseResult(params).then(res => {
        if(res.success) {
            if(res.data.formatStatus == 'success') {
                // 如获取到，关闭定时器
                if(timerFormat) {
                    clearInterval(timerFormat)
                    
                    // editorRef.value.handleCoverEditor(res.data.formatAfterCode) // 覆盖编辑器内容
                    // isFormat.value = false // 格式化完成
                    // isShowRevoke.value = true // 显示撤销按钮

                    // 改为引用覆盖、取消不覆盖
                    isFormat.value = false // 格式化完成
                    formatChangeFlag.value = true
                    formatChangeFlag.value = res.data.changedFlag
                    if(res.data.changedFlag) {
                        formatAfterCode.value = res.data.formatAfterCode
                        formatOutput.value = res.data.formatOutput
                        isShowChecked.value = true
                        resultTab.value = 2
                        ElMessage.success('格式化成功')
                    }else {
                        ElMessage.success('格式化成功，格式化前后代码无差异')
                    }
                }
            }else if(res.data.formatStatus == 'error') {
                ElMessage.error('格式化失败')
            }
        }
        hasClickFormat.value = false
    })
}

// 应用格式化结果
const useFormatResult = () => {
    ElMessageBox.confirm('请确认是否应用该代码', '', {
        cancelButtonText: '取消',
        confirmButtonText: '确认',
        center: false,
        closeOnClickModal: false,
        autofocus: false,
        type: 'warning',
    }).then(() => {
        console.log('确定')
        editorRef.value.handleCoverEditor(formatAfterCode.value) // 覆盖编辑器内容
        isShowRevoke.value = true // 显示撤销按钮
        ElMessage.success('应用成功')
        cancelFormatResult()
    }).catch(() => {
        console.log('已取消')
    })
}

// 取消格式化结果
const cancelFormatResult = () => {
    isShowChecked.value = false
    formatChangeFlag.value = false
    formatAfterCode.value = ''
    formatOutput.value = ''
    // ElMessage.success('已取消')
}

const handleRevoke = () => {
    ElMessageBox.confirm('确认是否撤销', '', {
        cancelButtonText: '取消',
        confirmButtonText: '确认',
        center: false,
        closeOnClickModal: false,
        autofocus: false,
        type: 'warning',
    }).then(() => {
        isActiveRevoke.value = true
        let params = {
            autoCaseId: props.detailInfo.id
        }
        revertAutoCase(params).then(res => {
            if(res.success) {
                editorRef.value.handleCoverEditor(res.data.formatOriginalCode)
                isActiveRevoke.value = false
                isShowRevoke.value = false
            }
        })
    }).catch(() => {
        console.log('已取消')
    })
}

const handleChangeResultTab = (val) => {
    resultTab.value = val
}

const handleClose = () => {
    ElMessageBox.confirm('当前更新信息即将丢失，请确认是否取消', '', {
        cancelButtonText: '取消',
        confirmButtonText: '确认',
        center: false,
        closeOnClickModal: false,
        autofocus: false,
        type: 'warning',
    }).then(() => {
        emits('closeDiaFn', props.detailInfo.id)
    }).catch(() => {
        console.log('已取消')
    })
}

const handleSubmit = async() => {
    await getOccupiedInfoFn()
    if(isOccupied.value) return // 被占用， 不可点击
    const text = editorRef.value.getEditorValue()
    let params = {...props.detailInfo}
    params.content = text
    emits('confirmFn', params)
}

const handleInsertContent = (text) => {
    insertEditorText.value = text
    editorRef.value.handleInsertEditor(text)
}

watch(() => props.detailInfo, (newName) => {
    defaultEditorText.value = newName?.content || ''
    isOccupied.value = newName?.occupancyFlag || false
}, {deep: true});

onBeforeUnmount(() => {
    if(timerCheck) {
        clearInterval(timerCheck)
    }
    if(timerFormat) {
        clearInterval(timerFormat)
    }
})
onMounted(() => {

})

</script>
<style lang="scss" scoped>
.dia-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 8px 0;

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
            font-size: 20px;
            color: #333;
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

.dia-main-auto {
    padding-bottom: 8px;
    padding-left: 10px;
    padding-right: 10px;

    .dia-main-content {
        display: flex;
        height: calc(90vh - 400px);
        padding: 0;
        // overflow-y: scroll;
    }


    .left-panel {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: #FFF;
        padding: 15px 13px 15px 20px;
        border: 1px solid #E2E2E2;
        border-radius: 8px 0 0 0;
        border-right: none;
        overflow: auto;
        .editor-area {
            height: calc(100% - 32px);
            border: 1px solid #E2E2E2;
            border-radius: 2px;
            background-color: #FFF;

           
        }
        .editor-btn-box {
            gap: 35px;
            width: 100%;
            height: 32px;
            padding-right: 16px;
            background-color: #F6F6F6;
            border-left: 1px solid #E2E2E2;
            border-right: 1px solid #E2E2E2;
            border-bottom: 1px solid #E2E2E2;

            .check-editor {
                gap: 4px;
                cursor: pointer;
                user-select: none;

                img {
                    width: 16px;
                }
            }
            .dis-not-allowed {
                cursor: default;
            }
        }
    }
    .resizer {
        width: 2px;
        background: #ddd;
        cursor: col-resize;
    }
    .right-panel {
        flex: 1;
        height: 100%;
        background: #fff;
        border-radius: 0 8px 0 0;
        overflow: auto;
    }

    .check-result-box {
        height: 330px;
        border-left: 1px solid #E2E2E2;
        border-right: 1px solid #E2E2E2;
        border-bottom: 1px solid #E2E2E2;

        .gap8 {
            gap: 8px;
        }
        .check-box-close {
            height: 26px;
            line-height: 26px;
            background-color: #F6F6F6;
            text-align: right;
            padding: 0 10px;

            .result-tab-active {
                color: #2173F7;
            }
            .el-icon {
                cursor: pointer;
                color: #303030;
                font-weight: 600;
            }
        }
        .check-box {
            height: calc(100% - 26px);
            padding: 12px;
            

            .check-left, .check-right {
                height: 100%;
                width: calc((100% - 10px) /2);
                padding: 0 0 10px;
            }
            .check-title {
                font-size: 12px;
                height: 24px;
                line-height: 24px;
                font-weight: bold;
            }
            .result-box {
                height: calc(100% - 24px);
                border: 1px solid #E2E2E2;
                border-radius: 4px;
                padding: 12px;
            }
            .result-box-left {
                height: calc(100% - 60px);
                padding-bottom: 8px;
            }
            
            .middle-line {
                width: 2px;
                height: 100% ;
                background-color: #CDCDCD;
            }
            .check-left {
                padding-bottom: 0;
                .check-left-main {
                    height: 100%;
                    overflow: auto;
                }
                .btn-cancel, .btn-submit {
                    width: 50px;
                    height: 24px;
                    line-height: 24px;
                }
            }
            .check-right {
                .check-right-main {
                    height: calc(100% - 20px);
                    overflow: auto;
                }
            }
            .btn-box {
                height: 36px;
                gap: 8px;
            }
        }
        .check-box-check {
            overflow: auto;
        }
        .check-box-format {
            padding: 0 12px;
        }
    }

    .dia-footer {
        margin-top: 20px;
        .dis-btn-submit {
            background-color: #E0E0E0;
            color: #555;
            cursor: default;

        }
        .dis-btn-submit:hover {
            opacity: 1;
        }
        .btn-cancel {
            margin-right: 12px;
        }
    }
    :deep(.CodeMirror-lines) {
        padding: 0 !important;
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
}
</style>